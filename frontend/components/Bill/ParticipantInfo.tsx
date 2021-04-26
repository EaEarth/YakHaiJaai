import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap';

const participant={
    name:"test",
    amountToPay:"100"
}
export const ParticipantInfo =() =>{
    return (
        <>
            <Row>
                <Col md={{span:6, offset:0}}>{participant.name}</Col>
                <Col md={{span:5, offset:1}}>{participant.amountToPay}</Col>
            </Row>
        </>
    )
}
export default ParticipantInfo;