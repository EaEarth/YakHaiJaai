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
import { auth, firebase } from '../../src/firebase'
import axios from 'axios'
import { useRootStore } from '../../stores/stores'

export const Bill = (props) => {
  const [billHolder, setBillHolder] = useState({
    title: '',
    promptpayId: ''
  })
  const [required, setRequired] = useState({
    title: '',
    promptpayId: ''
  })
  const [participants, setParticipants] = useState({})

  // participants = {username:{
  //                            cost : 50
  //                            fcmTokens : [id:15 , token:.....]
  //                            uid : uasdad
  // }}
  const totalParticipant = Object.keys(participants).length;
  const [listMenu, setListMenu]= useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  var users = props.users
  // const [modalParticipantShow, setModalParticipantShow] = useState(false);
  const notificationStore = useRootStore().notificationStore
  const handleChange = (e) => {
    const { id, value } = e.target
    setBillHolder((prevState) => ({
      ...prevState,
      [id]: value,
    }))
}
const handleClear = () => {
  setListMenu([])
  setTotalPrice(0)
  setParticipants({})
}
  
  const handleCreatedBill = (e) =>{
    e.preventDefault();
     let allInfo = true;
    if (!billHolder.title.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        title: '*required',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, title: '' }))

    // if (!billHolder.promptpayId.length) {
    //   setRequired((prevRequired) => ({
    //     ...prevRequired,
    //     promptpayId: '*required',
    //   }))
    //   allInfo = false
    // } else setRequired((prevRequired) => ({ ...prevRequired, promptpayId: '' }))

    if(!allInfo) return

    var participant = []
    var participantsToken = []

    for(let user in participants){
      participant.push(participants[user].uid)
      participants[user].fcmTokens.forEach(token => {
        if(token.isLogIn){
          participantsToken.push(token.token)
        }
      });
    }

    const payload={
      title:billHolder.title,
      promptPay:billHolder.promptpayId,
      participants: participant,
      itemLists: listMenu
    }

    
    console.log(participants)

    // listMenu.forEach(user => {
    //   if(user.fcmTokens){
        
    //     user.fcmTokens.forEach(token => {
    //       if(token.isLogIn){
    //         participantsToken.push(token.token)
    //       }
    //     });
    //   }
    // });
    const data = {
      title: billHolder.title,
      description: "New bill Created"
    }
    console.log(payload)
    auth.currentUser.getIdToken(true).then((token) => {
      axios.post('http://localhost:8000/api/bill/bill',payload,{
        headers:{authtoken: token}
      }).then((response)=>{
        console.log(response.data)
        notificationStore.sendNotification(participantsToken, data)
      }).catch((err)=>{
        console.log(err)
      })
    })
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
                  id="title"
                  placeholder="Add bill name"
                  value={billHolder.title}
                  onChange={handleChange}
                  isInvalid={!!required.title}
                />
                <FormControl.Feedback type="invalid">
                  {required.title}
                </FormControl.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Prompt Pay ID</Form.Label>
                <FormControl
                  plaintext
                  type="text"
                  id="promptpayId"
                  placeholder="PromptPay Number"
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
                    <h4>{totalParticipant}</h4>
                  </Row>
                </Col>
                <Col md={{span: 5, offset: 1}}>
                  <Row md={8}>
                    <h6>Total amount</h6>
                  </Row>
                  <Row md={8}>
                    <h4>{totalPrice}</h4>
                  </Row>
                </Col>
              </Row>
              {/* Tab bar for menu and participant */}
              <Row>
                <Col>
                  <Tabs fill defaultActiveKey="menu" id="uncontrolled-tab-example">
                    <Tab eventKey="menu" title="Menu" >
                      <Menu list={listMenu}/>
                    </Tab>
                    <Tab eventKey="participant" title="participant" >
                      <Participant participants={participants}/>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
      
              <Row className="my-3 justify-content-center">
                <Col md={{span: 3, offset: 1}} ><Button size="sm"variant="dark" onClick={() => setModalShow(true) }>Add Menu</Button>{' '}</Col>
                <Col md={{span: 3, offset: 1}}><Button size="sm"variant="primary"onClick={handleCreatedBill}>Created Bill</Button>{' '}</Col>
                <Col md={{span: 3, offset: 1}}><Button size="sm"variant="warning"onClick={handleClear}>Clear data</Button>{' '}</Col>
                {/* <Col md={{span: 3, offset: 1}}><Button size="sm"variant="dark" onClick={() => setModalParticipantShow(true) }>Add Participant</Button>{' '}</Col> */}
              </Row>
              </Col>
              <AddMenuModal show={modalShow} onHide={() => setModalShow(false)} setListMenu={setListMenu} users={users} setParticipants={setParticipants} setTotalPrice={setTotalPrice}/>

              {/* <ParticipantModal show={modalParticipantShow} onHide={() => setModalParticipantShow(false)} setParticipant={setParticipants}/> */}
          </Row>

        </Container>
      </>
    </DefaultLayout>
  )
}

export async function getServerSideProps(context) {
  const users = await axios.get(
    `http://localhost:8000/api/user`
  );
  const userList = []
  var obj = {}
  users.data.forEach(user => {
    obj = {
      username : user.username,
      uid : user.uid,
      value : user.username,
      label : user.username,
      fcmTokens : user.fcmTokens
    }
    userList.push(obj)
  });
  return{
    props:{
      users: userList
    }
  }
}


export default Bill
