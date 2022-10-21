import { BelongsTo, Model, Column, Table, ForeignKey, DataType } from 'sequelize-typescript';
import { IComment } from '../comment/comment.interface';
import { CommentModel } from '../comment/comment.model';
import { IPost } from '../post/post.interface';
import { PostModel } from '../post/post.model';
import { IAttachment } from './attachment.interface';

@Table({ tableName: 'blog', updatedAt: false, createdAt: false})
export class AttachmentModel extends Model<IAttachment, IAttachment> implements IAttachment {
	
	@ForeignKey(() => PostModel)
	@Column(DataType.INTEGER)
	public postId: number;

	@Column({
		type: DataType.TEXT,
	})
	public content: Text;

	@Column({
		type: DataType.STRING
	})
	public type: string;

	@BelongsTo(() => PostModel)
	public post?: IPost;

}