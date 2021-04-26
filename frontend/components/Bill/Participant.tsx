import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap';
import ParticipantBar from './ParticipantBar';
import ParticipantInfo from './ParticipantInfo';


export const Participant =(props) =>{
    return(
        <>
            <ParticipantBar/>
            <ParticipantInfo participants={props.participants}/>
        </>
    )
}
export default Participant;