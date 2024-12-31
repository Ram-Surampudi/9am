import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const Logout = () => {

  useEffect(()=>{
    localStorage.removeItem("token");
  }, []);
  
  return <Navigate to={"/home"}/>
}

export default Logout;
