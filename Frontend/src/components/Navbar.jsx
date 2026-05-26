import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <NavLink to="/">
            Home

        </NavLink>
        
        <NavLink to="/blog">
            BLog

        </NavLink>
        <NavLink to="/Like">
            Like

        </NavLink>
        <NavLink to="/logout">
            Logout

        </NavLink>

      
    </div>
  )
}

export default Navbar
