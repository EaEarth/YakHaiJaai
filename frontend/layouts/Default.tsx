import React from 'react'
import NavBar from '../components/navBar'

export const DefaultLayout = ({ children, ...props }) => {
  return (
    <>
      <NavBar />
      <main role="main">{children}</main>
    </>
  )
}

export default DefaultLayout
