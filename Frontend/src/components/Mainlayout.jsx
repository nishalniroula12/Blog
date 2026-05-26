import React from 'react'
import { Outlet } from 'react-router-dom'

const Mainlayout = () => {
  return (
    <div>
        <main>
            <Outlet/>
        </main>

      
    </div>
  )
}

export default Mainlayout
