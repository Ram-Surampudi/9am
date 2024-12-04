import React, { useEffect, useState } from 'react'
import './css/records.css'
import axios from 'axios';
import { URL } from '../App';
import Loading from './Loading';
import toast from 'react-hot-toast';

const Records = () => {
    const [year , setYear] = useState('2024');
    const [month , setMonth] = useState(new Date().getMonth()+1);
    const [data, setData] = useState(null);
    const [total, setTotal] = useState(0);
    const [loading , setLoading] = useState(false);

    const getValue = value => value < 1 ? '-' : value?.toLocaleString('en-US') || '-';

    useEffect(()=>{
      fetchRecords();
    },[]);

    const fetchRecords = async ()=>{
      setLoading(true);
      try{
        const res = await axios.post(`${URL}query`,{month,year});
        console.log(res);
        setData(res.data.transactions);
        setTotal(res.data.transactions.reduce((tot, current)=>tot+current.debit, 0));
        console.log();
        
     }
     catch(error){
        setData(null);
        toast.error("No Records Found");
     }
     setLoading(false);
    }
    
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
      <button onClick={fetchRecords}>search</button>
    </div>
    </div>
    {data &&
    <div>
      <h2 className="transcationstableh2" >Transaction Table</h2>
      <p className="totalvaluesclass" >TOTAL USAGE : <strong>{total.toLocaleString('en-US')}</strong></p>
    <table>
        <thead>
            <tr key="head">
                <th>Date</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>credit</th>
                <th>debit</th>
                <th>Balance</th>
            </tr>
        </thead>
        <tbody>
      {data.map(e=>(
            <tr key={e._id}>
                <td>{String(new Date(e.date).getDate()).padStart(2, '0')+ '-' + month + '-'+ year}</td>
                <td>{e.description}</td>
                <td>{getValue(e.quantity)}</td>
                <td>{getValue(e.credit)}</td>
                <td>{getValue(e.debit)}</td>
                <td>{getValue(e.balance)}</td>
            </tr>
      ))}
        </tbody>
    </table>
    </div>
  }
    </div>
  )
}

export default Records
