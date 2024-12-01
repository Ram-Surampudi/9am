import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { URL } from '../App';

const Register = () => {

  const [data, setData] = useState(null);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const fetchRecords = async ()=>{
    try{
       const res = await axios.get(`${URL}getregister`);
       res.data.sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year; 
        }
        return a.month - b.month;
      });
      setData(res.data);
    }
    catch(error){
       setData(null);
       console.log(error);
    }
   }

   useEffect(()=>{
    fetchRecords();
  },[]);



  return (
    <div>
      <h1  className="transcationstableh2" >Register</h1>
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
                <td>{e.money_credited}</td>
                <td>{e.hostel_fee}</td>
                <td>{e.usage}</td>
                <td>{e.balance}</td>
            </tr>
      ))}
        </tbody>
    </table>
    </div>
  )
}

export default Register
