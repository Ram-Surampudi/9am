import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNav from '../jsx/Nav'

const UserLayout = () => {
  return (
    <div>
        <UserNav/>
        <Outlet/>
    </div>
  )
}

export default UserLayout
