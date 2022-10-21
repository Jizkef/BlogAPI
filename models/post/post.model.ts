import { Column, Model, HasMany, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { IAttachment } from '../attachment/attachment.interface';
import { AttachmentModel } from '../attachment/attachment.model';
import { IBlog } from '../blog/blog.interface';
import { BlogModel } from '../blog/blog.model';
import { IComment } from '../comment/comment.interface';
import { CommentModel } from '../comment/comment.model';
import { IPost } from './post.interface';

@Table({ tableName: 'post', updatedAt: false})
export class PostModel extends Model<IPost, IPost> implements IPost {

	@ForeignKey(() => BlogModel)
	@Column(DataType.INTEGER)
	public blogId: number;

	@Column({
		type: DataType.STRING,
	})
	public title: string;

	@Column({
		type: DataType.TEXT,
	})
	public content: Text;


	@HasMany(() => CommentModel, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	public comments?: IComment[]

	@HasMany(() => AttachmentModel, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	public attachments?: IAttachment[]

	@BelongsTo(() => BlogModel)
	public blog?: IBlog;
}

