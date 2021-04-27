import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import React from 'react';
import { Container, Row, Form, Col, Nav, Tabs, Tab, FormControl,Button } from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import { useEffect, useState } from 'react';
import { Menu } from '../../components/Bill/Menu';
import { Participant } from '../../components/Bill/Participant';
import AddMenuModal from '../../components/Bill/modal';
import { auth, firebase } from '../../src/firebase'
import axios from 'axios'
import { useRootStore } from '../../stores/stores'

export const ViewBill = (props) => {
  const [billHolder, setBillHolder] = useState({
    title: '',
    promptpayId: ''
  })
  const [required, setRequired] = useState({
    title: '',
    promptpayId: ''
  })
  const [participants, setParticipants] = useState(props.participant);
  const totalParticipant = participants ? Object.keys(participants).length : 0 ;
  const [listMenu, setListMenu]= useState(props.menu);
  const [modalShow, setModalShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(props.totalPriceTemp);
  const notificationStore = useRootStore().notificationStore
  useEffect(() => {
    console.log(listMenu)
  },[listMenu] )
  const handleUpdateBill = (e) =>{
    e.preventDefault();
     let allInfo = true;
    if (!billHolder.title.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        title: '*required',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, title: '' }))

    // var participantsToken = []
    // participants.forEach(participant => {
    //   if(participant.fcmTokens){
    //     participant.fcmTokens.forEach(token => {
    //       if(token.isLogIn){
    //         participantsToken.push(token.token)
    //       }
    //     });
    //   }
    // });
    // const data = {
    //   title: billHolder.title,
    //   description: "New bill Created"
    // }
    // auth.currentUser.getIdToken(true).then((token) => {
    //   axios.post('http://localhost:8000/api/bill/bill',payload,{
    //     headers:{authtoken: token}
    //   }).then((response)=>{
    //     notificationStore.sendNotification(participantsToken, data)
    //   }).catch((err)=>{
    //     console.log(err)
    //   })
    // })
  }
  const handleClear = () => {
    setListMenu([])
    setTotalPrice(0)
    setParticipants({})
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
                  readOnly
                  type="text"
                  id="title"
                  placeholder="Add bill name"
                  value={billHolder.title}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Prompt Pay ID</Form.Label>
                <FormControl
                  plaintext
                  readOnly
                  type="text"
                  id="promptpayId"
                  placeholder="PromptPay Number"
                  value={billHolder.promptpayId}
                />
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
                  <Col md={{span: 3, offset: 1}}><Button size="sm"variant="primary"onClick={handleUpdateBill}>Update</Button>{' '}</Col>
                  <Col md={{span: 3, offset: 1}}><Button size="sm"variant="warning"onClick={handleClear}>Clear data</Button>{' '}</Col>
                  {/* <Col md={{span: 3, offset: 1}}><Button size="sm"variant="dark" onClick={() => setModalParticipantShow(true) }>Add Participant</Button>{' '}</Col> */}
              </Row>
    

              </Col>
              <AddMenuModal show={modalShow} onHide={() => setModalShow(false)} setListMenu={setListMenu} setParticipants={setParticipants} setTotalPrice={setTotalPrice}/>
          </Row>

        </Container>
      </>
    </DefaultLayout>
  )
}
export async function getServerSideProps(context) {
  // const detail = await axios.get(
  //   `http://localhost:8000/api/bill/get/${context.params.id}`
  // );
  const detail = {
    data: {
      id:1,
      title: "Bill name",
      promptPay: "123456",
      items:[
        {
          id:1,
          name: "item1",
          price: 20,
          payers: [
            {
              uid: "12324",
              username: "test1",
              fcmTokens: "12312"
            },
            {
              uid: "213423",
              username: "test2",
              fcmTokens: "12312"
            }
          ]},
        {
          id:2,
          name: "item2",
          price: 50,
          payers: [
            {
              uid: "12123324",
              username: "test1",
              fcmTokens: "12312"
            },
            {
              uid: "21341223",
              username: "test3",
              fcmTokens: "1234"
            }]
        }
      ]
  }};
  let participantTemp = {};
  let menutemp = detail.data.items;
  let listMenuTemp = [];
  let totalPriceTemp = 0;

  menutemp.forEach(itemList => {
    let payerTemp = [];
    totalPriceTemp += itemList.price;
    //create participant object
    itemList.payers.forEach(item => {
      participantTemp[item.username] ={
        uid: item.uid,
        cost : Math.round(itemList.price/itemList.payers.length),
        fcmTokens : item.fcmTokens
      }
    });
    itemList.payers.forEach(payer => {
        payerTemp.push(
          {
          username: payer.username,
          uid: payer.uid,
          value: payer.username,
          lable:payer.username,
          fcmTokens: payer.fcmTokens
        })
    });
    listMenuTemp.push({
      name: itemList.name,
      payers:payerTemp,
      perPerson: Math.round(itemList.price/itemList.payers.length),
      price:itemList.price
    })
    // console.log(payerTemp);
    // console.log(listMenuTemp);
    console.log(participantTemp);
    
  });
  return {
    props: {
      id: detail.data.id,
      title: detail.data.title,
      promptPayId: detail.data.promptPay,
      menu: listMenuTemp,
      participants: participantTemp,
      totalPrice: totalPriceTemp
    },
  };
}

export default ViewBill
