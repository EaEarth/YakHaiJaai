import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export const NavBar = observer(() => {
  const router = useRouter();

  return (
    <Navbar bg="dark" variant="dark">
      <Nav className="mr-auto"></Nav>
      <Button
        onClick={() => {
          router.push("/user/info");
        }}
      >
        <FontAwesomeIcon icon={faUserCircle} size="lg" /> {"Profile"}
      </Button>
    </Navbar>
  );
});

export default NavBar;
