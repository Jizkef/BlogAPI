

import { sequelize } from './blog-orm';
import { models } from './models';
import './server'; 
import { app } from './server'


app.listen(3000, function(){
	sequelize.addModels(models);
	models.map(async (i) => await i.sync());
	console.log('Server started!');

});




