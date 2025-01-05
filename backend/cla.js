
const MoneyRegister = require("./Schemas/MoneyRegister.js");
const Records = require("./Schemas/Records.js");

 const nextMonth = ({month , year}) =>{
    if(month === 12){
        month = 1;
        year++;
    }
    else ++month;
    return {m:month , y:year};
}

 const prevMonth = ({month , year}) =>{
    if(month === 1){
        month = 12;
        --year;
    }
    else month -= 1;
    return {m:month , y:year};
}

const Register = async (record) =>{
    let hostel_fee=0, money_credited =0, usage =0;
  
    const {month, year, transactions} = record;
    
    var reg = await MoneyRegister.find();
    // var reg = await MoneyRegister.findOne({month , year});

 reg.sort((a,b)=>{
   if(a.year == b.year){
    return a.month - b.month;
   }
  return a.year - b.year;
 })
    
    transactions.forEach(item=>{
        money_credited += item.credit;
        usage += item.debit;
        if(item.description.toLowerCase() === 'hostel fee' || item.description.toLowerCase() === 'ac bill') hostel_fee += item.debit;
    });
    

    // if(reg){
    //     reg.set({...reg, hostel_fee, money_credited, usage});
    // }
    // else reg = new MoneyRegister({month, year, money_credited , hostel_fee, usage});

    // reg.save();
    
    console.log("called register 1");
    var index =0, balance =0 , prevBalance =0;
    const {m,y} = prevMonth({month,year});

    for(index =0; index<reg.length; index++){
        var mr_reg=null ;
        if(reg[index].year === y && reg[index].month === m){
            prevBalance = reg[index].balance;
             balance = (money_credited - usage) + prevBalance;
             if(index++ !== reg.length-1){
                 reg[index].balance = balance;  
                 mr_reg = reg[index];
                 mr_reg.set({...mr_reg,hostel_fee, balance, money_credited, usage });
                }
                else mr_reg = new MoneyRegister({month ,year, hostel_fee, balance, money_credited, usage})
            await mr_reg.save();
            break;
        }
    }

    if(index < reg.length-1){
        var operations = [];
        for(var i = index+1 ; i<reg.length; i++){
            reg[i].balance = (reg[i].money_credited - reg[i].usage) + reg[i-1].balance;
            operations.push({
                updateOne: {
                    filter: { _id:reg[i]._id },  
                    update: { $set: reg[i] },
                }
            });
        }
        await MoneyRegister.bulkWrite(operations);
    }

    let oldRecordBalance = record.balance;

    if(transactions.length > 0){
        transactions[0].balance = ((transactions[0]?.credit || 0) + prevBalance ) - transactions[0]?.debit || 0; 
    }
    for(var j =1; j < transactions.length; j++){
        transactions[j].balance = (transactions[j-1].balance - (transactions[j]?.debit || 0)) + transactions[j]?.credit || 0;
    }
    record.transactions = transactions;
    record.balance = transactions[transactions.length-1].balance;
    await record.save();

    if(index < reg.length -1 && oldRecordBalance !== record.balance){
        var newRecords = await Records.find();

        newRecords.sort((a,b)=>{
            if(a.year == b.year){
             return a.month - b.month;
            }
           return a.year - b.year;
          })
        
        var operations = [];
        for(var i = index+1 ; i < newRecords.length; i++){
            let prevBal = newRecords[i-1].balance;
            const {transactions} = newRecords[i];

            if(transactions.length > 0){
                transactions[0].balance = ((transactions[0]?.credit || 0) + prevBal) - transactions[0]?.debit || 0; 
            }
            for(var j =1; j < transactions.length; j++){
                transactions[j].balance = (transactions[j-1].balance - (transactions[j]?.debit || 0)) + transactions[j]?.credit || 0;
            }
            newRecords[i].transactions = transactions; 
            newRecords[i].balance = transactions[transactions.length-1].balance;
            operations.push({
                updateOne: {
                    filter: { _id:newRecords[i]._id },  
                    update: { $set: newRecords[i] },
                }
            });           
        }
        if(operations)
            await Records.bulkWrite(operations);

    }

  }

  module.exports = { nextMonth, prevMonth, Register };
