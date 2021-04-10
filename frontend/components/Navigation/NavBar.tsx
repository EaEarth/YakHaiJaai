import { Badge, Button, Form, FormControl, NavDropdown } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { observer } from 'mobx-react-lite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

export const NavBar = observer((props) => {
  const router = useRouter()
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Yak-Hai-Jaai</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
      </Nav>
      <Form inline>
        <NavDropdown
          className="mr-3"
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
        <Button>
          <FontAwesomeIcon icon={faUserCircle} size="lg" /> Profile
        </Button>
      </Form>
    </Navbar>
  )
})

export default NavBar
