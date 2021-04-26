import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap'

export const  ParticipantBar=() => {
    return(
        <Row>
        <Col md={{span: 6, offset: 0}}><p className="small">Name</p></Col>
        <Col md={{span: 5, offset: 1}}><p className="small">Price</p></Col>
      </Row>
    );
}

export default ParticipantBar;