import React from 'react'
import Nav from '../jsx/AdminNav'
import { Navigate, Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div>
        <Nav/>
        {localStorage.getItem("token") ? <Outlet/> : <Navigate to="/user/login"/>}
    </div>
  )
}

export default AdminLayout
