const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Records = require("./Schemas/Records");
const MoneyRegister = require("./Schemas/MoneyRegister");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Register } = require("./cla.js");

const app = express();
app.use(bodyParser.json());

require('dotenv').config();



app.use(cors());

app.use(cors({
  origin: "", // Allowed origin
  methods: "GET,POST,PUT,DELETE", // Allowed methods
  credentials: true // Allow cookies and authentication headers
}));

mongoose.connect(process.env.MONGO_URI);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn:"3h"});
};

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('error..............');
      
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};


app.get("/getregister", async (req, res)=>{
  const money_register = await MoneyRegister.find() ;
  res.status(200).send(money_register);
})

app.post("/insertManyMr", async (req, res)=>{
  req.body.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year; 
    }
    return a.month - b.month;
  });
  await MoneyRegister.deleteMany(); 
 await MoneyRegister.insertMany(req.body);
  res.status(200).send(req.body);
})

app.post("/crud",authenticateToken, async (req, res)=>{
  const { month, year, transactions} = req.body;

  try {
    let record = await Records.findOne({ month, year });

    if (!record) {
      record = new Records({ month, year, transactions: [] });
    }

    const balance = await Register(record);
    record.set({...record,transactions,balance});
    
    await record.save();
    console.log("crud");
    

    res.status(201).send(record);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
    
    
  }

})

app.post("/add", async (req, res) => {
  const { month, year, transaction } = req.body;
  

  try {
    let record = await Records.findOne({ month, year });
    if (!record) {
      record = new Records({ month, year, transactions: [] });
    }

    record.transactions.push(transaction);
    await record.save();

    await Register(record);

    res.status(201).send(record);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
    
  }
});

app.post("/insert", async (req, res) => {
  const { month, year, position, transaction } = req.body;

  try {
    const record = await Records.findOne({ month, year });

    if (!record) {
      return res.status(404).send("Record not found for the specified month and year.");
    }

    record.transactions.splice(position, 0, transaction);
    await record.save();

    await Register(record);

    res.status(200).send(record);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/update", async (req, res) => {
  const { month, year, index, transaction } = req.body;

  try {
    const record = await Records.findOne({ month, year });

    if (!record || !record.transactions[index]) {
      return res.status(404).send("Transaction not found.");
    }

    record.transactions[index] = { ...record.transactions[index], ...transaction };
    await record.save();

    await Register(record);

    res.status(200).send(record);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/delete", async (req, res) => {
  const { month, year, index } = req.body;

  try {
    const record = await Records.findOne({ month, year });

    if (!record || !record.transactions[index]) {
      return res.status(404).send("Transaction not found.");
    }

    record.transactions.splice(index, 1);
    await record.save();
    await Register(record);

    res.status(200).send(record);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/deleteall", async (req, res)=>{
  const {month ,year} = req.body;
  await Records.deleteMany({month , year});
  res.send("success");
});

app.post("/query", async (req, res) => {
  const { month, year } = req.body;

  try {
    const record = await Records.findOne({ month, year });

    if (!record) {
      return res.status(404).send("No records found for the specified month and year.");
    }

    res.status(200).send(record);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/verifyandquery",authenticateToken, async (req, res) => {
  const { month, year } = req.body;
  try {
    const record = await Records.findOne({ month, year });

    if (!record) {
      return res.status(404).send("No records found for the specified month and year.");
    }

    res.status(200).send(record);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/adminlogin", (req, res)=>{
    
    if(req.body.username === process.env.LOGIN_USERNAME){
      if(req.body.password === process.env.PASSWORD){
        res.status(202).send(generateToken("ram_surampudi"));
      }
      else res.status(400).send("incorret password");
    }
   else res.status(404).send("incorrect username");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



