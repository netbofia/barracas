/**
   * Created by Bruno Costa 28-04-2018
   * Generated by Utilities/createTable.py
   */
  'use strict';

  module.exports = function(sequelize, DataTypes) {
    const ReservasEdicoes = sequelize.define('ReservasEdicoes', {
      id: { 
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
    inicio: DataTypes.DATE,
    fim: DataTypes.DATE,
    valor: DataTypes.FLOAT,
    reservaId: DataTypes.INTEGER(11),
    comentarioId: DataTypes.INTEGER(11),
    operadorId: DataTypes.INTEGER(11),
    em: DataTypes.DATEtime,
  }, {
      tableName: 'ReservasEdicoes',
      timestamps: false,
      underscored: false,

     classMethods: {
        associate: function associate(models) {    
          ReservasEdicoes.belongsTo(models.Reservas, {
            foreignKey: 'reservaId',              //on ReservasEdicoes
            targetKey: 'id',  //foreign key  
          });
          ReservasEdicoes.belongsTo(models.Comentarios, {
            foreignKey: 'comentarioId',              //on ReservasEdicoes
            targetKey: 'id',  //foreign key  
          });
          ReservasEdicoes.belongsTo(models.Pessoas, {
            foreignKey: 'operadorId',              //on ReservasEdicoes
            targetKey: 'id',  //foreign key  
          }); 
        }
      },
    });

    return ReservasEdicoes;
  };