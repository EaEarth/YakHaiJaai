import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap';
import styles from './billpage.module.scss';
import Payer from './Payer'

export const MenuInfo=(props) => {

  const items = props.list.map((item) => (
    <Row className="">
        <Col md={4}><p className="small m-0">{item.name}</p></Col>
        <Col md={4}><p className="small m-0">{item.price}</p></Col>
        <Col md={4}><p className="small m-0">{item.perPerson}</p></Col>
        <Payer payerList={item.payers}></Payer>
    </Row>
  ))
    return(
        <>
        {items}
      </>
    );
}

export default MenuInfo;