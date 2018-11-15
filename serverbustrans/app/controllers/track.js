'use strict'
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'dbapps2';
let socketIO = null;
let trackingState = {}

const emitRoute = (trackingState) => {
	
	MongoClient.connect(url,function(err,client){
		if(err){
			console.log('Unable to connect monggo db');
		}else{
			const db = client.db(dbName);
			var collection = db.collection('bustransX');
			/*var query = {
				tanggal: { // 18 minutes ago (from now)
					$gt: new Date(Date.now() - 1000 * 60 * 1)
				}
			}*/
			var query = {
				$and :[
					{tanggal: { // 18 minutes ago (from now)
						$gt: new Date(Date.now() - 1000 * 60 * 1)
					}},
/*					{
					buscode:{$in:["DMR 5110"]}  
					}*/
				]
			}
			

			collection.aggregate([
				{$match: query},
				{$limit:50},
				{$group: {
					_id: {
						value: "$buscode",
						trip_name : "$trip_name",
						location : "$location",
						latitude : "$lat",
						longitude : "$lng",
						timestamp: "$tanggal",
						color :"$color",
						course : "$course"
					}
				}},
				{$project: {
					trip_name : "$_id.trip_name",
					location : "$_id.location",
					latitude : "$_id.latitude",
					longitude : "$_id.longitude",
					buscode : "$_id.value",
					tanggal: "$_id.timestamp",
					color : "$_id.color",
					course : "$_id.course"
				}},
				{$sort: {tanggal: 1}},
			]).toArray(function(err, res) {
			if (err) throw err;
				var myJson = JSON.stringify(res);
				var data = JSON.parse(myJson);

				for(var i= 0; i< data.length;i++){

					trackingState[i] = {
						tripname : data[i]['_id']['trip_name'],
						buscode : data[i]['_id']['value'],
						lat :Number(data[i]['_id']['longitude']),
						lng :Number(data[i]['_id']['latitude']),
						color :data[i]['_id']['color'],
						course : data[i]['_id']['course']
					};					
				}

			});	
			//
		}
	})
	
	console.log(trackingState[300]);
	
	socketIO.emit('locationUpdated',trackingState);
	
	return setTimeout(() => {
		emitRoute(trackingState)
	},60000)
}
//running awal sekali.
const run = io => {
	socketIO = io;
    emitRoute(trackingState);
    console.log("ada jalan disini");
}

module.exports.run = run;