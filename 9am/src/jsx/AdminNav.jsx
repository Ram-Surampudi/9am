import React from 'react'
import './css/nav.css'

const Nav = () => {
    const nav = ['logout']
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
