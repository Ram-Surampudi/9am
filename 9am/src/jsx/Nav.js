import React, { useEffect, useState } from 'react'
import './css/nav.css'

const UserNav = () => {
    const nav = ['home','register', 'login'];
  return (
    <div className='navcontainer'>
        <ul className='navgroup'>
        {nav.map(navItem=>(
            <li key={navItem} className='navItems'><a href={`/user/${navItem}`}>{navItem}</a></li>
            ))}
      </ul>
    </div>
  )
}

export default UserNav;
