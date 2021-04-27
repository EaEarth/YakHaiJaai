import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap'

export const MenuBar =() => {
    return(
        <Row>
        <Col md={4}><p className="small font-weight-bold mt-3">Menu</p></Col>
        <Col md={{span:3, offset:1}}><p className="small font-weight-bold mt-3">Price</p></Col>
        <Col md={{span:3, offset:1}}><p className="small font-weight-bold mt-3">per person</p></Col>
      </Row>
    );
}

export default MenuBar;