const mongoose = require("mongoose");

const money_register = new mongoose.Schema({
  year : { type: Number, required: true }, 
  month : { type: Number, required: true }, 
  money_credited : { type: Number }, 
  hostel_fee :{ type: Number},
  college_fee : { type: Number, default: 0 } ,
  usage : { type: Number}  ,
  balance : {type : Number}
});

const MoneyRegister = mongoose.model("MoneyRegister", money_register);

module.exports = MoneyRegister;