var models= require('./../models');
const {Op}=require('sequelize')

module.exports = function(transporter){
	var call="reportReserves";
 	var attributes={};
 	var year=transporter.ano
 	var queryMonth=thisMonth(transporter.mes)
 	var nextMonthSTR=nextMonth(transporter.mes)
	//TODO select year then filter results based on edits

 	queryMonth=="00" ? nextMonthSTR="12" : null
 	queryMonth=="00" ? queryMonth="01" : null
 	attributes.where={
 		inicio: {
 			[Op.lt]: `${year}-${nextMonthSTR}-01`
 		},
 		fim: {
 			[Op.gte]: `${year}-${queryMonth}-01`
 		}
 	} 	
 	transporter.espacoId != null ? attributes.where.barracaChapeusId = transporter.espacoId : null
	return new Promise(function(res,rej){
		models[call](attributes).then(function(result){
			data={}
			output=[]
			total=0
			result.rows.forEach(function(row){
				let id=row.dataValues.id
				row.dataValues.reservaId=row.dataValues.id
				Object.assign(row.dataValues, row.dataValues.BarracasChapeu.dataValues)
				let espacoId=row.dataValues.id
				let Pago={pago:false}
				if(row.dataValues.Pago){
					Pago.pago=row.dataValues.Pago.pago
					Pago.valor=row.dataValues.Pago.valor
					Pago.em=row.dataValues.Pago.em
				}
				row.dataValues.pessoa=row.dataValues.Pessoa.nome
				delete row.dataValues.Pessoa
				if ( row.dataValues.ReservasEdico != null) {
					//This is unnecessary
					Object.assign(row.dataValues, row.dataValues.ReservasEdico.dataValues)
					row.dataValues.numero=row.dataValues.ReservasEdico.dataValues.BarracasChapeu.dataValues.numero
					row.dataValues.localizacao=row.dataValues.ReservasEdico.dataValues.BarracasChapeu.dataValues.localizacao
					espacoId=row.dataValues.ReservasEdico.dataValues.BarracasChapeu.dataValues.id
					row.dataValues.pessoa=row.dataValues.ReservasEdico.dataValues.Pessoa.nome
				}
				delete row.dataValues.barracaChapeusId
				delete row.dataValues.BarracasChapeu
				row.dataValues.inicio= new Date(row.dataValues.inicio).toLocaleDateString("ko-KR",{ year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/. /g,"-").replace(".","")
				row.dataValues.fim= new Date(row.dataValues.fim).toLocaleDateString("ko-KR",{ year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/. /g,"-").replace(".","")
				row.dataValues.registo=row.dataValues.em || row.dataValues.registo
				data[id]={
					"#":row.dataValues.numero,
					tipo:row.dataValues.tipo,
					subTipo:row.dataValues.subTipo,
					fila:row.dataValues.localizacao,
					nome:row.dataValues.nome,
					inicioLong:row.dataValues.inicio,
					inicio:getDatePart(row.dataValues.inicio),
					fimLong:row.dataValues.fim,
					fim:getDatePart(row.dataValues.fim),
					"Inicio-Fim":getDatePart(row.dataValues.inicio)+" - "+getDatePart(row.dataValues.fim),
					valor:row.dataValues.valor,
					Pago,
					Responsavel:row.dataValues.pessoa,
					operadorId:row.dataValues.operadorId,
					registo: row.dataValues.registo.toUTCString() ,
					reservaId:row.dataValues.reservaId,
					espacoId,
					Cancelado:row.dataValues.del
				}
			})
			Object.keys(data).forEach(function(key){
				output.push(data[key])
			})
			res({rows:output})
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


function getDatePart(date){
  var d=new Date(date)
  let yyyy=d.getFullYear()
  let mm=pad(d.getMonth()+1,2)
  let dd=pad(d.getDate(),2)  
  return yyyy+"-"+mm+"-"+dd
}

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}