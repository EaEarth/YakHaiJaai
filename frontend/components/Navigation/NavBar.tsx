import { Badge, Button, Form, FormControl, NavDropdown } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { observer } from 'mobx-react-lite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useRootStore } from '../../stores/stores'
import { auth } from '../../src/firebase'

export const NavBar = observer((props) => {
  const router = useRouter()
  const authStore = useRootStore().authStore

  const handleRegisterClick = (e) => {
    router.push('/')
  }

  const handleLogoutClick = (e) => {
    e.preventDefault()
    auth.signOut().then((response) => {
      authStore.user = null
    })
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Yak-Hai-Jaai</Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      {authStore.isLoggedIn && (
        <NavDropdown
          className="left-aligned"
          title={
            <>
              <FontAwesomeIcon icon={faBell} color="white" size="lg" />
              <Badge
                pill
                variant="danger"
                style={{ position: 'absolute', top: '-0.3em', left: '2.2em' }}
              >
                100
              </Badge>
            </>
          }
          id="collasible-nav-dropdown"
        >
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
      )}
      {!authStore.isLoggedIn && (
        <Nav.Link className="right-aligned" onClick={handleRegisterClick}>
          register
        </Nav.Link>
      )}
      {authStore.isLoggedIn && (
        <Nav.Link className="right-aligned" onClick={handleLogoutClick}>
          logout
        </Nav.Link>
      )}
      {authStore.isLoggedIn && (
        <Button>
          <FontAwesomeIcon icon={faUserCircle} size="lg" />{' '}
          {authStore.userInfo.email}
        </Button>
      )}
      {!authStore.isLoggedIn && (
        <Button>
          <FontAwesomeIcon icon={faUserCircle} size="lg" /> Login
        </Button>
      )}
    </Navbar>
  )
})

export default NavBar
