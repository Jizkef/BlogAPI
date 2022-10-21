import { IPost } from "../post/post.interface";
import { IUser } from "../user/user.interface";

export interface IComment {
	content?: Text;
	createdAt?: Date;
	userId?: number;
	postId?: number;
	id?: number;

	user?: IUser;
	post?: IPost;
};