var models= require('./../models');
const db = require("../../sqldb");

m.cancelRent=function(attributes){
	return db.Aluguer
		.destroy({
			where: attributes.where,
		}).then(function(task){
			return task
		}).catch(function(err){
			console.log('Kill Rent Tent - Err: '+ err);
			return err
		})
}