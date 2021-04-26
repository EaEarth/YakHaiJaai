import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import React from 'react';
import { Container, Row, Form, Col, Nav, Tabs, Tab, FormControl, Button } from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import { useEffect, useState } from 'react';
import { Menu } from '../../components/Bill/Menu';
import { Participant } from '../../components/Bill/Participant';
import AddMenuModal from '../../components/Bill/modal';
import ParticipantModal from '../../components/Bill/ParticipantModal';

export const Bill = () => {
  const [billHolder, setBillHolder] = useState({
    billName: '',
    promptpayId: ''
  })
  const [required, setRequired] = useState({
    billName: '',
    promptpayId: ''
  })
  const data = {
    name: 'Bill Name',
    totalParticipant: '20',
    totalAmout: '500',
    promptPayID: '098765432'
  }
  const [modalShow, setModalShow] = useState(false);
  const [modalParticipantShow, setModalParticipantShow] = useState(false);
  useEffect(() => {
    
  }, )
  const handleChange = (e) => {
    const { id, value } = e.target
    setBillHolder((prevState) => ({
      ...prevState,
      [id]: value,
    }))
}
  const handleCreatedBill = (e) =>{

  }
  
  return (
    <DefaultLayout>
      <>
        <Head>
          <title>Bill Name</title>
        </Head>
        <Container className="my-4 ">
          <Row>
          <Col>
              <Form.Group>
                <Form.Label>Bill Name</Form.Label>
                <FormControl
                  plaintext
                  type="text"
                  id="billName"
                  placeholder="Add bill name"
                  value={billHolder.billName}
                  onChange={handleChange}
                  isInvalid={!!required.billName}
                />
                <FormControl.Feedback type="invalid">
                  {required.billName}
                </FormControl.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Prompt Pay ID</Form.Label>
                <FormControl
                  plaintext
                  type="text"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  value={billHolder.promptpayId}
                  onChange={handleChange}
                  isInvalid={!!required.promptpayId}
                />
                <FormControl.Feedback type="invalid">
                  {required.promptpayId}
                </FormControl.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
              <Col md={12}>
              <Row>
                <Col md={{span: 5, offset: 1}}>
                  <Row md={8}>
                    <h6 className="text-center">#Participant</h6>
                  </Row>
                  <Row md={8}>
                    <h4>{data.totalParticipant}</h4>
                  </Row>
                </Col>
                <Col md={{span: 5, offset: 1}}>
                  <Row md={8}>
                    <h6>Total amount</h6>
                  </Row>
                  <Row md={8}>
                    <h4>{data.totalAmout}</h4>
                  </Row>
                </Col>
              </Row>
              {/* Tab bar for menu and participant */}
              <Row>
                <Col>
                  <Tabs fill defaultActiveKey="menu" id="uncontrolled-tab-example">
                    <Tab eventKey="menu" title="Menu" >
                      <Menu/>
                    </Tab>
                    <Tab eventKey="participant" title="participant" >
                      <Participant/>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
      
              <Row className="my-3 justify-content-center">
                <Col md={{span: 3, offset: 1}} ><Button size="sm"variant="dark" onClick={() => setModalShow(true) }>Add Menu</Button>{' '}</Col>
                <Col md={{span: 3, offset: 1}}><Button size="sm"variant="primary">Created Bill</Button>{' '}</Col>
                <Col md={{span: 3, offset: 1}}><Button size="sm"variant="dark" onClick={() => setModalParticipantShow(true) }>Add Participant</Button>{' '}</Col>
              </Row>
              </Col>
              <AddMenuModal show={modalShow} onHide={() => setModalShow(false)}/>
              <ParticipantModal show={modalParticipantShow} onHide={() => setModalParticipantShow(false)}/>
          </Row>

        </Container>
      </>
    </DefaultLayout>
  )
}

export default Bill
