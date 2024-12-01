import React, { useState } from 'react'
import './css/admin.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../App';

const Admin = () => {
  const [data, setData] = useState({});

  const navigate = useNavigate();

  const set = e => setData({...data, [e.target.name]:e.target.value});

  const SubmitHandler = async (e)=>{
    e.preventDefault();
    try{
      const res = await axios.post(`${URL}adminlogin`,data);
      localStorage.setItem("token", res.data);
      navigate('/test');
      window.location.reload();
   }
   catch(error){
    console.log(error);
    alert(error.response.data);
   }
  }

  return (
    <div>
       <div className='recordcontianermain admincontainermain'>
        <div className='recordcontianersub admincontainersub'>
          <p>Login</p>
          <form onSubmit={SubmitHandler}>

      <label>Username:</label>
      <input type="text" name="username" required onChange={set}/><br />
        <label>password:</label>
       <input type="password" name="password" onChange={set} required />
      <button type='submit'>login</button>
          </form>
    </div>
    </div>
    </div>
  )
}

export default Admin