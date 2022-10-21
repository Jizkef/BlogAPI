import { BlogModel } from '../models/blog/blog.model';
import { PostModel } from '../models/post/post.model';
import { sequelize } from '../blog-orm';
import { IPost } from '../models/post/post.interface';
import { Request, RequestHandler, Response } from 'express';
import { Model } from 'sequelize';
import { IBlog } from '../models/blog/blog.interface';
import { JwtPayload } from 'jsonwebtoken';
import { IUserJwt } from './user.controller';

export const createPost = async(req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	if (!req.body.title || !req.body.content) { 
		res.status(400).send({
			message: 'Content or title can not be empty!'
		});
		
		return
	}

	const post: IPost = {
		title: req.body.title,
		blogId: +req.params.id,
		content: req.body.content,
	};

	const foundBlog: Model<IBlog, IBlog> | null = await BlogModel.findOne({where: { id: post.blogId, userId: jwt.id }})
	if (foundBlog === null) {
		res.status(400).send({ message: 'Данный блог не принадлежит этому пользователю'})
		return
	}
	
	try {
		await PostModel.create(post)
		res.send(post);
	
	} catch(err) {
		res.status(400).send({message: 'Some error occurred while creating the Post'});
	}
}

export const getBlogs: RequestHandler = async (req, res) => { 
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}
	
	try {
		const data: Model<IBlog, IBlog>[] = await BlogModel.findAll({attributes: ['title', 'userId', 'id']})

		const blogs: IBlog[] = data.map(i => i.get({ plain: true })); 
		res.send(blogs); 

	} catch (err) {
		res.status(500).send({
			message: 'Some error occurred while getting the other Blogs',
			details: (err as Error).message
		});
	};
};

export const updateBlog = async (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	const id: number = +req.params.id;
	const form: IBlog = req.body;

	const foundBlog: Model<IBlog, IBlog> | null = await BlogModel.findOne({where: { id, userId: jwt.id }})
	if (foundBlog === null) {
		res.status(400).send({ message: 'Данный блог не принадлежит этому пользователю'})
		return
	}

	try {
		await BlogModel.update(form, {
			logging: console.log,
			where: { id, userId: jwt.id }
		});
	
	} catch (err) {
		res.status(400).send({
			message:
				'Cannot update Blog'
		});
	}

	res.end();
};

export const deleteBlog = async (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	const id: number = +req.params.id;

	const foundBlog: Model<IBlog, IBlog> | null = await BlogModel.findOne({where: { id, userId: jwt.id }})
	if (foundBlog === null) {
		res.status(400).send({ message: 'Данный блог не принадлежит этому пользователю'})
		return
	}

	try {
		await BlogModel.destroy({where: { id, userId: jwt.id }})
		res.end()
	} catch (err) {
		res.status(400).send({ message: 'You cant delete this Blog'})
	}

};