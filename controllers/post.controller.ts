import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { IAttachment } from '../models/attachment/attachment.interface';
import { BlogModel } from '../models/blog/blog.model';
import { IComment } from '../models/comment/comment.interface';
import { CommentModel } from '../models/comment/comment.model';
import { IPost } from '../models/post/post.interface';
import { PostModel } from '../models/post/post.model';
import { IUserJwt } from './user.controller';


export const createComment = (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	if (!!req.body.content) { 
		res.status(400).send({
			message: 'Content can not be empty!'
		});
		
		return
	}

	const comment: IComment = {

		postId: +req.params.id,
		content: req.body.content,
	};

	CommentModel.create(comment)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					'Some error occurred while creating the Comment'
			});
		});
};

export const createAttachment = (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	if (!!req.body.content) { 
		res.status(400).send({
			message: 'Content can not be empty!'
		});
		
		return
	}

	const attachment: IAttachment = {
        postId: +req.params.id,
        content: req.body.content,
        type: ''
    };

	CommentModel.create(attachment)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					'Some error occurred while creating the Attachment'
			});
		});
};

export const getPosts = async (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}
	
	try {
		const data: Model<IPost, IPost>[] = await PostModel.findAll()

		const posts: IPost[] = data.map(i => i.get({ plain: true })); 
		res.send(posts); 
	} catch (err) {
		res.status(500).send({
			message:
				'Some error occurred while getting the Post'
		});
	};
};

export const updatePost = async (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}

	const id: number = +req.params.id;
	const form: IPost = req.body;

	const foundPost: Model<IPost, IPost> | null = await PostModel.findOne({
		where: { id },
		include: { model: BlogModel, as: 'blog' } 
	})
	console.log(foundPost);
	if (foundPost === null) {
		res.status(400).send({ message: 'Данный пост не принадлежит этому пользователю'})
		return
	}

	try {
		await PostModel.update(form, {
			where: { id }
		});
	
	} catch (err) {
		res.status(400).send({
			message:
				'Cannot update Post'
		});
	}

	res.end();
};

export const deletePost = async (req: Request, res: Response) => {
	const jwt: IUserJwt = res.locals.jwt;
	if (!jwt) {
		res.status(401).send({ message: 'Not authorized' });
		return;
	}
	const id: number = +req.params.id;

	try {
		await PostModel.destroy({where: { id }}) 
	} catch (err) {
		res.status(400).send({message: 'Cannot delete Post'});
	}

	res.end();
};