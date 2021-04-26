import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap'

export const MenuBar =() => {
    return(
        <Row>
        <Col md={{span: 3, offset: 0}}><p className="small">Menu</p></Col>
        <Col md={{span: 4, offset: 1}}><p className="small">Price</p></Col>
        <Col md={{span: 3, offset: 1}}><p className="small">per person</p></Col>
      </Row>
    );
}

export default MenuBar;