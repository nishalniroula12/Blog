import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

const Publicroute = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}

export default Publicroute
