var models= require('../barracas/models');

module.exports = function(options){
	var call="getAccessToken";
 	var attributes=options || {};
 	attributes.where={id: attributes.id} 	
	return models[call](attributes)
}