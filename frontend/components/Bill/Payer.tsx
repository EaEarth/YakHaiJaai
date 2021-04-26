import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap';
import styles from './billpage.module.scss';
export const Payer = (props) =>{
    const payers = props.payerList.map((payer) => (
        <Col md={1} className="m-0 pr-0">
          <Badge className={`${styles['badge-name']}`} variant="primary" >{payer.username}</Badge>{' '}
        </Col>
    ))
    return (
        <>{payers}</>
        )
}
export default Payer