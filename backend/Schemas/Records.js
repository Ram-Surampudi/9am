const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true }, 
  description: { type: String, required: true }, 
  credit: { type: Number, default: 0 }, 
  debit: { type: Number, default: 0 }, 
  balance: { type: Number,default : 0}, 
  quantity : {type:String, default:0}
});

const moneyRegisterSchema = new mongoose.Schema({
  month: { type: Number, required: true }, 
  year: { type: Number, required: true }, 
  balance : {type : Number, required:true },
  transactions: [transactionSchema], 
});

const MoneyRegister = mongoose.model("Records", moneyRegisterSchema);

module.exports = MoneyRegister;
