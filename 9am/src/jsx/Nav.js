import React, { useEffect, useState } from 'react'
import './css/nav.css'

const Nav = () => {
    const [nav, setNav] = useState([]);
    useEffect(()=>{
      if(localStorage.token)
        setNav(['home','register', 'test', 'logout']);
      else setNav(['home','register', 'admin'])
    },[]);
  return (
    <div className='navcontainer'>
        <ul className='navgroup'>
        {nav.map(navItem=>(
            <li key={navItem} className='navItems'><a href={`/${navItem}`}>{navItem}</a></li>
            ))}
      </ul>
    </div>
  )
}

export default Nav
