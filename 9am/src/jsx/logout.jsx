import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const Logout = () => {
    localStorage.removeItem("token");
  return <Navigate to={"/home"}/>
}

export default Logout;