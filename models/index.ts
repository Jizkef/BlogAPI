import { BlogModel } from "./blog/blog.model";
import { UserModel } from "./user/user.model";
import { PostModel } from "./post/post.model";
import { CommentModel } from "./comment/comment.model";
import { AttachmentModel } from "./attachment/attachment.model";

export const models = [
	UserModel,
	BlogModel,
	PostModel,
	CommentModel,
	AttachmentModel,
];