import { Sequelize } from 'sequelize-typescript'

export const sequelize: Sequelize = new Sequelize({
	database: 'blog',
	password: '531065',
	username: 'postgres',
	dialect: 'postgres',
	host: 'localhost',
	port: 5432,
	logging: false,
});

async function connect() {
	try {
		await sequelize.authenticate()
		console.log('Successfully connected to DB')
	} 	catch (e) {
		console.log('Something went wrong while connecting to DB: ', e)
	}
}

connect().then(() => console.log('connect executed'));