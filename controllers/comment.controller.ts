import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { IComment } from '../models/comment/comment.interface';
import { CommentModel } from '../models/comment/comment.model';
import { IUser } from '../models/user/user.interface';
import { UserModel } from '../models/user/user.model';
import { IUserJwt } from './user.controller';

export const getComments = async (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}
	
	try {
		const data: Model<IComment, IComment>[] = await CommentModel.findAll()

		const comments: IComment[] = data.map(i => i.get({ plain: true })); 
		res.send(comments); 
	} catch (err) {
		res.status(500).send({
			message:
				'Some error occurred while getting the Comment'
		});
	};
};

export const updateComment = async (req: Request, res: Response) => {
	const id: number = +req.params.id;
	const form: IComment = req.body;

	try {
		await CommentModel.update(form, {
			where: { id }
		});
	
	} catch (err) {
		res.status(400).send({
			message:
				'Cannot update Comment'
		});
	}

	res.end();
};

export const deleteComment = async (req: Request, res: Response) => {
	const id: number = +req.params.id;

	try {
		await CommentModel.destroy({where: { id }}) 
	} catch (err) {
		res.status(400).send({
			message:
				'Cannot delete Comment'
		});
	}

	res.end();
};