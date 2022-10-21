import express, { Request } from 'express'; 
import bodyParser from 'body-parser';
import { createBlog, deleteUser, getMyBlogs, getUsers, IUserJwt, loginUser, registrateUser, updateUser } from './controllers/user.controller';
import { createPost, deleteBlog, getBlogs, updateBlog } from './controllers/blog.controller';
import { createAttachment, createComment, deletePost, getPosts, updatePost } from './controllers/post.controller';
import { deleteComment, getComments, updateComment } from './controllers/comment.controller';
import { check } from 'express-validator';
import { models } from './models';
import { decode, JwtPayload } from 'jsonwebtoken';


export const app = express();

app.use(bodyParser.urlencoded({ extended: true}));

app.use(bodyParser.json()); 

app.use((req: Request, res, next) => {

	const token: string = req.headers.token as string;
	console.log(token);
	const jwt = decode(token, { json: true }) as IUserJwt;
	
	if (!jwt) {
		next();
		return;
	}

	console.log(jwt);
	res.locals.jwt = jwt;

	next();
})



app.post('/users/sign-up', [
	check('username', 'Имя пользователя не может быть пустым').notEmpty(), 
	check('password', 'Пароль должен быть больше 4 и меньше 10 символов').isLength({min: 4, max: 10})
], registrateUser);

app.post('/users/login', loginUser); 

app.post('/users/blogs', createBlog); 

app.get('/users/blogs', getMyBlogs) 

app.get('/users', getUsers); 

app.put('/users', updateUser); 

app.delete('/users', deleteUser); 



app.get('/blogs', getBlogs); 

app.post('/blogs/:id', createPost); 

app.put('/blogs/:id', updateBlog);  

app.delete('/blogs/:id', deleteBlog); 



app.get('/posts', getPosts); 

app.post('/posts/comment/:id', createComment);

app.post('/posts/attachment/:id', createAttachment);

app.put('/posts/:id', updatePost);

app.delete('/posts/:id', deletePost);



app.get('/comments', getComments);

app.put('/comments/:id', updateComment);

app.delete('/comments/:id', deleteComment);




