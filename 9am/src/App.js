import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Records from './jsx/Records.jsx'
import Register from './jsx/Register.jsx';
import Test from './jsx/Test.jsx';
import Admin from './jsx/admin.jsx';
import Logout from './jsx/logout.jsx';
import UserLayout from './Layouts/UserLayout.jsx';
import AdminLayout from './Layouts/AdminLayout.jsx';
import { Toaster } from 'react-hot-toast';
export const URL = "http://localhost:5000/";
// export const URL = "https://9am-backend.vercel.app/";

const App = () => {
    
  return (
    <BrowserRouter>
    <Toaster toastOptions={{className: 'customtoast',}}/>
      <Routes>
        <Route path='/' element={<Navigate to={'/user/home'}/>} />
        <Route path='/user' element={<Navigate to={'/user/home'}/>} />
        <Route path='/admin' element={<Navigate to={'/admin/home'}/>} />
      
        <Route path='/user' Component={UserLayout}>
            <Route path='home' element={<Records/>} />
            <Route path='register' element={<Register/>} />
            <Route path='login' element={<Admin/>} />
            <Route path='*' element={<Navigate to='/user/home'/>} />
        </Route>

        <Route path='/admin' element={<AdminLayout/>}>
            <Route path='home' element={<Records/>} />
            <Route path='register' element={<Register/>} />
            <Route path='test' element={<Test/>} />
            <Route path='logout' element={<Logout/>} />
            <Route path='*' element={<Navigate to='/admin/home'/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

