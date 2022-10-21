import { IPost } from '../post/post.interface'
import { IUser } from '../user/user.interface';

export interface IBlog {
	title?: string;
	id?: number;
	userId?: number;
	createdAt?: Date;
	posts?: Array<IPost>;
	user?: IUser;
};