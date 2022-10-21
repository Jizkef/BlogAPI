import { IBlog } from '../blog/blog.interface'

export interface IUser {
	username?: string;
	email?: string;
	birthday?: string;
	password?: string;
	id?: number;
	blogs?: Array<IBlog>;
	
}