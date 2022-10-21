import { IPost } from "../post/post.interface";

export interface IAttachment {

	postId?: number;
	content?: Text;
	type: string;

	post?: IPost;
}