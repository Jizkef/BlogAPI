import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { sequelize } from '../../blog-orm';
import { IBlog } from '../blog/blog.interface';
import { BlogModel } from '../blog/blog.model';
import { IComment } from '../comment/comment.interface';
import { CommentModel } from '../comment/comment.model';
import { IUser } from './user.interface';

@Table({ tableName: 'user', updatedAt: false, createdAt: false})
export class UserModel extends Model<IUser, IUser> implements IUser {
	
	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: false,
	})
	public username: string;

	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: false,
	})
	public password: string;

	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: false,
	})
	public email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	public birthday: string;

	@HasMany(() => BlogModel, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	public blogs?: IBlog[]

	@HasMany(() => CommentModel, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	public comments?: IComment[]

}
