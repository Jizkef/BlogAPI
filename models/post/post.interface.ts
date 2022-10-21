import { IComment } from '../comment/comment.interface'
import { IAttachment } from '../attachment/attachment.interface'
import { IBlog } from '../blog/blog.interface';

export interface IPost {	
	title?: string;
	id?: number;
	blogId?: number;
	content?: Text;
	createdAt?: Date;

	blog?: IBlog;
	comments ?: Array<IComment>;
	attachments?: Array<IAttachment>;
};

