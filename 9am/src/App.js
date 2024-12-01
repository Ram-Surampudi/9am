import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Nav from './jsx/Nav'
import Records from './jsx/Records.jsx'
import Register from './jsx/Register.jsx';
import Test from './jsx/Test.jsx';
import Admin from './jsx/admin.jsx';
import Logout from './jsx/logout.jsx';
export const URL = "http://localhost:5000/";

const App = () => {
    
  return (
    <BrowserRouter>
    <Nav/>
      <Routes>
        <Route path='/' element={<Navigate to={'/home'}/>} />
        <Route path='/home' element={<Records/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/test' element={<Test/>} />
        <Route path='/admin' element={<Admin/>} />
        <Route path='/logout' element={<Logout/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
