import React, { useState } from 'react'
import './css/admin.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../App';
import Loading from './Loading';
import toast from 'react-hot-toast';

const Admin = () => {
  const [data, setData] = useState({});
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();

  const set = e => setData({...data, [e.target.name]:e.target.value});

  const SubmitHandler = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await axios.post(`${URL}adminlogin`,data);
      console.log(res);
      
      localStorage.setItem("token", res.data);
      navigate('/test');
      window.location.reload();
   }
   catch(error){
    console.log(error);
    toast.error(error.response.data);
   }
   setLoading(false);
  }

  return (
    <div>
      {loading && <Loading/>}
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
