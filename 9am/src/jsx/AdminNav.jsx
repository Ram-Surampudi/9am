import React from 'react'
import './css/nav.css'

const Nav = () => {
    const nav = ['home','register', 'test', 'logout'];
  return (
    <div className='navcontainer'>
        <ul className='navgroup'>
        {nav.map(navItem=>(
            <li key={navItem} className='navItems'><a href={`/admin/${navItem}`}>{navItem}</a></li>
            ))}
      </ul>
    </div>
  )
}

export default Nav
