var mongoose = require('mongoose');


var bustransX = mongoose.Schema({	
    lat: String,
    lng: String,
    buscode : String,
    current_tripid : String,
    trip_name :String,
    gpsdatetime: String,
    location:String,
    koridor:String,
    speed:String,
    course:String,
    color:String,
    tanggal: String
})




module.exports = mongoose.model('bustransX', bustransX);