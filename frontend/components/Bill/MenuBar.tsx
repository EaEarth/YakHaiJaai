import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap'

export const MenuBar =() => {
    return(
        <Row>
        <Col md={4}><p className="small font-weight-bold">Menu</p></Col>
        <Col md={4}><p className="small font-weight-bold">Price</p></Col>
        <Col md={4}><p className="small font-weight-bold">per person</p></Col>
      </Row>
    );
}

export default MenuBar;