import { Column, Model, HasMany, Table, BelongsTo, DataType, ForeignKey } from 'sequelize-typescript';
import { IPost } from '../post/post.interface';
import { PostModel } from '../post/post.model';
import { IUser } from '../user/user.interface';
import { UserModel } from '../user/user.model';
import { IBlog } from './blog.interface';

@Table({ tableName: 'blog', updatedAt: false})
export class BlogModel extends Model<IBlog, IBlog> implements IBlog {
	@Column({
		type: DataType.STRING,
	})
	public title: string;

	@ForeignKey(() => UserModel)
	@Column(DataType.INTEGER)
	public userId: number;

	@HasMany(() => PostModel, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	public posts?: IPost[]

	@BelongsTo(() => UserModel)
	public user?: IUser;
}
