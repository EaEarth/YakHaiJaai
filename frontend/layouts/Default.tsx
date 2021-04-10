import NavBar from '../components/Navigation/NavBar'

export const DefaultLayout = ({ children, ...props }) => {
  return (
    <>
      <NavBar />
      <main role="main">{children}</main>
    </>
  )
}

export default DefaultLayout
