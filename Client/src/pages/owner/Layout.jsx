import React from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import  {Outlet}  from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarOwner/>
      <div className='flex flex-1'>
        <Sidebar/>
        <div className='flex-1 bg-white'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Layout
