import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap';
import ParticipantBar from './ParticipantBar';
import ParticipantInfo from './ParticipantInfo';


export const Participant =() =>{
    return(
        <>
            <ParticipantBar/>
            <ParticipantInfo/>
        </>
    )
}
export default Participant;