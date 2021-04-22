import { Badge, Button, Form, FormControl, NavDropdown } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { observer } from 'mobx-react-lite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useRootStore } from '../../stores/stores'
import { auth } from '../../src/firebase'
import { useEffect } from 'react'
import axios from 'axios'

export const NavBar = observer((props) => {
  const router = useRouter()
  const authStore = useRootStore().authStore

  const handleRegisterClick = (e) => {
    router.push('/')
  }

  const handleLoginClick = (e) => {
    router.push('/auth/login')
  }

  const handleLogoutClick = (e) => {
    e.preventDefault()
    auth.signOut().then((response) => {
      authStore.setUser(null)
    })
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      authStore.setUser(user)
    } else {
      authStore.setUser(null)
    }
  })

  useEffect(() => {
    if (authStore.user) {
      auth.currentUser.getIdToken(true).then((idToken) => {
        axios
          .get(`http://localhost:8000/api/user/current-user/info`, {
            headers: {
              authtoken: idToken,
            },
          })
          .then(function (response) {
            authStore.setUserInfo(response.data)
          })
      })
    } else {
      authStore.setUserInfo(null)
    }
  }, [authStore.user])

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
          {authStore.userInfo.username}
        </Button>
      )}
      {!authStore.isLoggedIn && (
        <Button onClick={handleLoginClick}>
          <FontAwesomeIcon icon={faUserCircle} size="lg" /> Login
        </Button>
      )}
    </Navbar>
  )
})

export default NavBar
