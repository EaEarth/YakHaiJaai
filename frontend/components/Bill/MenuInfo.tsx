import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap';

export const MenuInfo=() => {
    return(
        <>
        <Row>
        <Col md={{span: 3, offset: 0}}><p className="small">Hotdog</p></Col>
        <Col md={{span: 4, offset: 1}}><p className="small">100</p></Col>
        <Col md={{span: 3, offset: 1}}><p className="small">50</p></Col>
        <Row>
        <Col md={{span: 2, offset: 2}}>
          <Badge variant="primary">Earth</Badge>{' '}
        </Col>
      </Row>
      </Row>
      </>
    );
}

export default MenuInfo;