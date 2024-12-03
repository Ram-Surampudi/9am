import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { URL } from '../App';
import Loading from './Loading';
import toast from 'react-hot-toast';

const Register = () => {

  const [data, setData] = useState(null);
  const [loading , setLoading] = useState(false);
  const [toatalMoneyCredited , setToatalMoneyCredited] = useState(0);
  const [totalUsage , setTotalUsage] = useState(0);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const fetchRecords = async ()=>{
    setLoading(true);
    try{
       const res = await axios.get(`${URL}getregister`);
      setData(res.data);
      let tmc =0, tu=0;
      res.data.forEach(item=>{
        tmc += item.money_credited;
        tu += item.usage;
      });
      setToatalMoneyCredited(tmc);
      setTotalUsage(tu);
    }
    catch(error){
       setData(null);
       toast.error("No Records Found");
    }
    setLoading(false);
   }

   useEffect(()=>{
    fetchRecords();
  },[]);



  return (
    <div>
      {loading && <Loading/>}
      <h1  className="transcationstableh2" >Money Register</h1>
      <div className="totalvaluesclass">
      <p>Total Money Credited : {toatalMoneyCredited.toLocaleString('en-US')}</p>
      <p>total Usage : {totalUsage.toLocaleString('en-US')}</p>
      </div>
      <table>
        <thead>
            <tr key="head">
                <th>year</th>
                <th>month</th>
                <th>money credited</th>
                <th>hostel fee</th>
                <th>usage</th>
                <th>Balance</th>
            </tr>
        </thead>
        <tbody>
        {data?.map(e=>(
            <tr key={e._id}>
                <td>{e.year}</td>
                <td>{months[e.month-1]}</td>
                <td>{e.money_credited.toLocaleString('en-US')}</td>
                <td>{e.hostel_fee.toLocaleString('en-US')}</td>
                <td>{e.usage.toLocaleString('en-US')}</td>
                <td>{e.balance.toLocaleString('en-US')}</td>
            </tr>
      ))}
        </tbody>
    </table>
    </div>
  )
}

export default Register
