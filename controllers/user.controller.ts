import { UserModel } from '../models/user/user.model';
import { BlogModel } from '../models/blog/blog.model';
import { sequelize } from '../blog-orm';
import { IBlog } from '../models/blog/blog.interface';
import { Request, RequestHandler, Response } from 'express';
import { IUser } from '../models/user/user.interface';
import { Model, ValidationError } from 'sequelize';
import { compareSync, hashSync } from 'bcrypt';
import { Result, validationResult } from 'express-validator';
import { sign, JwtPayload } from 'jsonwebtoken';
import config from '../config/config';

export interface IUserJwt extends JwtPayload {
	id: number;
};

const generateAccessToken = (id: number): string => {
	const payload: IUserJwt = {
		id
	}

	return sign(payload, config.secret, { expiresIn: "24h" });
}



export const createBlog = (req: Request, res: Response) => { 
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	if (!req.body.title) { 
		res.status(400).send({
			message: 'Title can not be empty!'
		});
		
		return
	}

	
	
	const blog: IBlog = {
		title: req.body.title,
		userId: jwt.id, 
	};

	BlogModel.create(blog)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(400).send({
				message:
					err.message || 'Some error occurred while creating the Blog'
			});
		});

};

export const getMyBlogs: RequestHandler = async (req, res) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	try {
		const data: Model<IBlog, IBlog>[] = await BlogModel.findAll({ where: { userId: jwt.id}})

		const blogs: IBlog[] = data.map(i => i.get({ plain: true })); 
		res.send(blogs); 
	} catch (err) {
		res.status(400).send({
			message:
				'Some error occurred while getting Blogs'
		});
	};
}

export const getUsers: RequestHandler = async (req, res) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	try {
		const data: Model<IUser, IUser>[] = await UserModel.findAll({attributes: ['id', 'email', 'birthday', 'username']})

		const users: IUser[] = data.map(i => i.get({ plain: true })); 
		res.send(users); 
	} catch (err) {
		res.status(400).send({
			message:
				'Some error occurred while getting Users'
		});
	};
};

export const updateUser = async (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	const id: number = jwt.id;
	const form: IUser = req.body;

	try {
		await UserModel.update(form, {
			where: { id }
		});

		res.send({message: 'User was updated'})
	
	} catch (err) {
		res.status(400).send({
			message:
				'Cannot update User'
		});
	}

	res.end() 
};

export const deleteUser = async (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}
	
	const id: number = jwt.id;

	try {
		await UserModel.destroy({where: { id }}) 
		res.send({message: 'User was deleted'})
	} catch (err) {
		res.status(400).send({
			message:
				'Cannot delete User'
		});
	}

	res.end()
};

export const registrateUser = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req) 
		if (!errors.isEmpty()) { 
			return res.status(400).send({
				message:
					'Ошибка при регистрации', errors
			})

		}
		const { username, password, email, birthday } = req.body;
		const candidate: Model<IUser, IUser> | null = await UserModel.findOne({where: { username }}) 
		if (candidate) {
			return res.status(400).send({
				message:
					'Пользователь с таким именем уже существует'
			})
		}
		const hashPassword = hashSync(password, 7);

		const form: IUser = { username, password: hashPassword, email, birthday} 

		const user: Model<IUser, IUser> = await UserModel.create(form)
		
		res.send(user);
		

	} catch (err) {
		console.log(err)
		res.status(400).send({
			message:
				'Registration error'
		});
	}
};

export const loginUser = async (req: Request, res: Response) => {

	try {
		const { username, password} = req.body;
		const model: UserModel = await UserModel.findOne({where: { username }})
		if (!model) {
			return res.status(400).send({
				message:
					`Пользователь ${username} не найден`
			});
		}
		
		const user: IUser = model.get({plain: true}) 
		const validPassword = compareSync(password, user.password as string)
		if (!validPassword) {
			return res.status(400).send({
				message:
					'Введен неверный пароль'
			});
		}

		const token = generateAccessToken(user.id as number)
		return res.send({token})
	} catch (err) {
		console.log(err);
	}
};








