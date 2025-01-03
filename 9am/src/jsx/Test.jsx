import React, { useEffect, useState } from "react";
import './css/crud.css'
import "./css/records.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL } from "../App";
import Loading from "./Loading";
import toast from "react-hot-toast";

const EditableTable = () => {
  
  const temp = {
    _id: "",
    date: "",
    description: "",
    quantity: "",
    credit: "",
    debit:"",
    balance:""
  };

  const [data, setData] = useState(null);
  const [year , setYear] = useState(new Date().getFullYear());
  const [month , setMonth] = useState(new Date().getMonth()+1);
  const [toggle , setToggle] = useState(false);
  const [ibr, setIbr] = useState(false);
  const [newRow, setNewRow] = useState(temp);
  const [insertRow, setInsertRow] = useState(temp);
  const [editRowId, setEditRowId] = useState(null);
  const [total, setTotal] = useState(0);
  var balance =0;
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();

  const set = e => setInsertRow({...insertRow, [e.target.name]:e.target.value});
  const handleDelete = (id) => setData((prevData) => prevData.filter((row) => row._id !== id));
  const handleInputChange = e => setNewRow({...newRow, [e.target.name] : e.target.value});

  const calculateBalance = (row , index) =>{
      row.balance = (index ===0 ? balance : data[index-1].balance) - (parseInt(row?.debit) || 0) + (parseInt(row?.credit) || 0);
  };
  
  const handleInsert = (e) => {
    setLoading(true);
    try{
    insertRow._id = new Date();
    calculateBalance(insertRow,data ? data?.length : 0);
    if(data !== null){
      data.push(insertRow);
      setData(data);
    }
    else setData([insertRow]);
    setInsertRow(temp);
    setTotal(data.reduce((tot, current)=>tot+parseInt(current.debit || 0), 0));
  }
  catch(error){
    console.log(error);
  }
  setLoading(false);
  };

  const handleInsertAbove = (index) => {
    setLoading(true);
    const _id = new Date();
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(index, 0, {...temp, _id}); 
      return updatedData;
    });
    setIbr(true);
    setNewRow({...temp, _id})
    setEditRowId(_id);
    setLoading(false);
  };

  const handleEdit = (_id, row) => {
    setEditRowId(_id);
    setNewRow(row);
  };

  const handleSave = (index) => {
      setEditRowId(null);
      data[index] = newRow;
      if(ibr) setIbr(false);
      setTotal(data.reduce((tot, current)=>tot+parseInt(current.debit || 0), 0));
      for(var i =index ; i<data.length; i++){
        calculateBalance(data[i], i);
      }
      setData(data);
      setNewRow(temp);
  };
  
  const handleUpdatedb = async (e) =>{
    e.preventDefault();
    setLoading(true);
    try{
      data?.forEach(item => {
        delete item._id;
        item.credit = parseInt(item.credit);
        item.debit = parseInt(item.debit);
      });
       const res = await axios.post(`${URL}crud`,{month, year, balance, transactions :data}, {headers: {Authorization:localStorage.getItem("token"),},});
       toast.success("Updated Sucessfully");
       setData(res?.data.transactions);
    }
    catch(error){
       console.log(error);
       toast.error("Something Went Wrong");
    }
    setLoading(false);
  };

  const getRecords = async () =>{
    setLoading(true);
    const token = localStorage.getItem("token");
    try{
      const res = await axios.post(`${URL}verifyandquery`,{month,year}, {headers: {Authorization:token,},});
      setData(res?.data?.transactions); 
      setTotal(res?.data?.transactions?.reduce((tot, current)=>tot+current.debit, 0));
      balance = res?.data?.balance;
      console.log(balance);
      
      console.log(total);
      
   }
   catch(error){
    console.log(error);
    balance =0;
    setTotal(0);
    setData(null);
    if(error?.response?.status !== 404)
      navigate("/admin/logout");
    }
    setLoading(false);
  };

  useEffect(()=>{getRecords()},[]);

  return (
    <div>
      {loading && <Loading/>}
       <div className='recordcontianermain'>
        <div className='recordcontianersub'>
          <p>Money Resigter</p>
      <div>
      <label>Year:</label>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          </select>
      </div>
      <div>
        <label>Month:</label>
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          <option className='options' value="1">January</option>
          <option className='options' value="2">February</option>
          <option className='options'  value="3">March</option>
          <option className='options' value="4">April</option>
          <option className='options' value="5">May</option>
          <option className='options' value="6">June</option>
          <option className='options' value="7">July</option>
          <option className='options' value="8">August</option>
          <option className='options' value="9">September</option>
          <option className='options' value="10">October</option>
          <option className='options' value="11">November</option>
          <option className='options' value="12">December</option>
        </select>
      </div>
      <button onClick={getRecords} >search</button>
    </div>
    </div>
      <h2 className="transcationstableh2">Edit Transactions </h2>
      <div className="selfOrAuto">
          <div className="toggle-container">
            <span id="toggle-status">Auto Save </span>
            <div className={"toggle " + (toggle ? "active" : "")} id="toggle" onClick={(e)=>setToggle(!toggle)}></div>
          </div>
          <div>
            <button className="tablebutton save" onClick={handleUpdatedb}>update Mongodb</button>
          </div>
      </div>
      <div className="totalvaluesclass">
        <p>total Usage : {total?.toLocaleString('en-US')}</p>
      </div>

      <table className="actionstableelements">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>credit</th>
            <th>debit</th>
            <th>balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          
          {data?.map((row, index) => (
            editRowId !== row._id ?
            <tr key={row._id}>
              <td>{String(new Date(row.date).getDate()).padStart(2, '0')+ '-' + month + '-'+ year}</td>
              <td>{row.description}</td>
              <td>{row.quantity}</td>
              <td>{row.credit?.toLocaleString('en-US')}</td>
              <td>{row.debit?.toLocaleString('en-US')}</td>
              <td>{row.balance?.toLocaleString('en-US')}</td>
              <td className="actionbuttons">
                <button className="tablebutton edit" onClick={() => handleEdit(row._id, row)}></button>
                <button className="tablebutton insertabove" onClick={() => handleInsertAbove(index)}>&#8624;</button>
                <button className="tablebutton" onClick={() => handleDelete(row._id)}>&#10060;</button>
              </td>
            </tr> 
            : <tr key={row._id} >
                <td> <input className="tableinput" type="date" name="date" value={newRow.date} onChange={handleInputChange}/> </td>
                <td> <input className="tableinput" type="text" name="description" value={newRow.description} onChange={handleInputChange }/> </td>
                <td> <input className="tableinput" type="text" name="quantity" value={newRow.quantity} onChange={handleInputChange}/> </td>
                <td> <input className="tableinput" type="number" name="credit" value={newRow.credit} onChange={handleInputChange}/> </td>
                <td> <input className="tableinput" type="number" name="debit" value={newRow.debit} onChange={handleInputChange}/> </td>
                <td> <input className="tableinput" type="number" name="balance" value={newRow.balance} onChange={handleInputChange}/> </td>
                {ibr ?
                  <td>
                    <button className="tablebutton insert" onClick={e=>handleSave(index)}>insert</button>
                  </td> : 
                  <td className="actionbuttons" >
                    <button className="tablebutton save" onClick={e=>handleSave(index)}>✓</button>
                    <button className="tablebutton insertabove" onClick={() => handleInsertAbove(index)}>&#8624;</button>
                    <button className="tablebutton delete" onClick={() => handleDelete(row.id)}>&#10060;</button>
                  </td>
                }
            </tr>
          ))}
           <tr key={"edit"} >

                <td> <input className="tableinput" type="date" name="date" value={insertRow.date} onChange={set}/> </td>
                <td> <input className="tableinput" type="text" name="description" value={insertRow.description} onChange={set}/> </td>
                <td> <input className="tableinput" type="text" name="quantity" value={insertRow.quantity} onChange={set}/> </td>
                <td> <input className="tableinput" type="number" name="credit" value={insertRow.credit} onChange={set} /></td>
                <td> <input className="tableinput" type="number" name="debit" value={insertRow.debit} onChange={set}/> </td>
                <td></td>
                <td><button className="tablebutton insert" onClick={handleInsert}>insert</button></td>
            </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
