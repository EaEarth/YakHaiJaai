import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap';

// const participant={
//     name:"test",
//     amountToPay:"100"
// }
export const ParticipantInfo =(props) =>{
    const listParticipant = [];
    console.log(props.participants)
    for(let user in props.participants){
        let temp = {
            name:user,
            amountToPay:props.participants[user]
        }
        listParticipant.push(temp)
    }
    const participants = listParticipant.map((participant) => 
        <Row>
            <Col md={{span:6, offset:0}}>{participant.name}</Col>
            <Col md={{span:5, offset:1}}>{participant.amountToPay}</Col>
        </Row>
    )

    return (
        <>
        {participants}
        </>
    )

}
export default ParticipantInfo;