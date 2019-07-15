var models= require('./../models');

module.exports = function(transporter){
	var call="reportReserves";
 	var attributes={};
 	var year=transporter.ano
 	var queryMonth=thisMonth(transporter.mes)
 	var nextMonthSTR=nextMonth(transporter.mes)
 	attributes.where={
 		dataInicio: {
 			"$lte": `${year}-${nextMonthSTR}-01`
 		},
 		dataFim: {
 			"$gte": `${year}-${queryMonth}-01`
 		}
 	} 	

	return new Promise(function(res,rej){
		models[call](attributes).then(function(result){
			data=[]
			total=0
			result.rows.forEach(function(row){
				Object.assign(row.dataValues, row.dataValues.BarracasChapeu.dataValues)
				delete row.dataValues.id
				delete row.dataValues.barracaChapeusId
				row.dataValues.operadorId=row.dataValues.Pessoa.nome
				delete row.dataValues.Pessoa
				delete row.dataValues.BarracasChapeu
				row.dataValues.dataInicio=row.dataValues.dataInicio.toUTCString()
				row.dataValues.dataFim=row.dataValues.dataFim.toUTCString()
				row.dataValues.registo=row.dataValues.registo.toUTCString()
				data.push(row.dataValues)
			})
			res({rows:data})
		}).catch(function(err){
			//Is empty an error????
			rej(err)
		})
	})
}

function thisMonth(thisMonth){
	return parseInt(thisMonth)>9 ? thisMonth+1 : `0${parseInt(thisMonth)}`
}
function nextMonth(thisMonth){
	thisMonth=parseInt(thisMonth)
	let nextMonth
	thisMonth>=9 ? nextMonth=thisMonth+1 : nextMonth=`0${thisMonth+1}`
	return nextMonth
}
