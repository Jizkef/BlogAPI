import { BelongsTo, Model, Column, Table, ForeignKey, DataType, HasMany } from 'sequelize-typescript';
import { sequelize } from '../../blog-orm';
import { IPost } from '../post/post.interface';
import { IUser } from '../user/user.interface';
import { IComment } from './comment.interface';
import { UserModel } from '../user/user.model'
import { PostModel } from '../post/post.model';
import { AttachmentModel } from '../attachment/attachment.model';
import { IAttachment } from '../attachment/attachment.interface';

@Table({ tableName: 'comment', updatedAt: false})
export class CommentModel extends Model<IComment, IComment> implements IComment {

	@ForeignKey(() => UserModel)
	@Column(DataType.INTEGER)
	public userId: number;
	
	@ForeignKey(() => PostModel)
	@Column(DataType.INTEGER)
	public postId: number;

	@Column({
		type: DataType.TEXT,
	})
	public content: Text;

	@BelongsTo(() => PostModel)
	public post?: IPost;

	@BelongsTo(() => UserModel)
	public user?: IUser;
}

