/**
 * Created by Manjesh on 14-05-2016.
 */

/** https://github.com/dsquier/oauth2-server-php-mysql **/

//This is the configuration file that has all the credentials
var config_barracas = require('./../../config_barracas');
var Sequelize = require('sequelize');
var glob = require('glob');
var path = require('path');
var debug = require('debug')
const {DataTypes} = require("sequelize");
//var debug_std = debug
//DB credentials
let db = {
  sequelize: new Sequelize(
    config_barracas.sql.database,
    config_barracas.sql.username,
    config_barracas.sql.password,
    config_barracas.sql
  )
};


//db tables  //Do this for all Keys in Object requeire(dir that start with capital letters)

//Get all file names in this directory that start with a capital letter and have a Java script extension.
//This may be bad for performance 
var tables=glob.sync(__dirname+'/'+'!([a-z]*.js|*.[^j][^s]*|.gitignore)')
for( index in tables){
	var table=path.basename(tables[index],'.js');
	db[table]=require('./'+table)(db.sequelize,DataTypes);
}

Object.keys(db).forEach(function(modelName) {
  if ('classMethods' in db[modelName].options) {
    try {
      db[modelName].options.classMethods.associate(db);
    } catch(e) {
      debug(`Occured while trying to associate ${modelName}\n${e}`);
    }
  }
});

module.exports = db;