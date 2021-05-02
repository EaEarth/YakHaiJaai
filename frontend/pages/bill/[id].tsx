import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import React from 'react'
import {
  Container,
  Row,
  Form,
  Col,
  Nav,
  Tabs,
  Tab,
  FormControl,
  Button,
} from 'react-bootstrap'
import DefaultLayout from '../../layouts/Default'
import { useEffect, useState } from 'react'
import { Menu } from '../../components/Bill/Menu'
import { Participant } from '../../components/Bill/Participant'
import AddMenuModal from '../../components/Bill/modal'
import { auth, firebase } from '../../src/firebase'
import axios from 'axios'
import { useRootStore } from '../../stores/stores'
import { useRouter } from 'next/router'
import styles from './bill.module.scss'
import { UpdateMenuModal } from '../../components/Bill/ModalUpdate'

export const ViewBill = (props) => {
  const [billHolder, setBillHolder] = useState({
    title: props.title,
    promptpayId: props.promptPayId,
  })
  const [required, setRequired] = useState({
    title: '',
    promptpayId: '',
  })
  const [participants, setParticipants] = useState(props.participants)
  const totalParticipant = participants ? Object.keys(participants).length : 0
  const [listMenu, setListMenu] = useState(props.menu)
  const [modalShow, setModalShow] = useState(false)
  const [modalUpdateShow, setUpdateModalShow] = useState(false)
  const [totalPrice, setTotalPrice] = useState(props.totalPrice)
  const [current, setCurrent] = useState(null)
  const notificationStore = useRootStore().notificationStore
  const authStore = useRootStore().authStore
  var users = props.users
  const billId = props.id
  const router = useRouter()

  const handleUpdateBill = (e) => {
    console.log(listMenu)
    e.preventDefault()
    let allInfo = true
    if (!billHolder.title.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        title: '*required',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, title: '' }))

    var participant = []
    var participantsToken = []

    for (let user in participants) {
      participant.push(participants[user].uid)
      participants[user].fcmTokens.forEach((token) => {
        if (token.isLogIn) {
          participantsToken.push(token.token)
        }
      })
    }

    const data = {
      title: billHolder.title,
      description: 'Bill have been updated',
      bill: { id: billId },
    }

    const payload = {
      title: billHolder.title,
      promptPay: billHolder.promptpayId,
      participants: participants,
      itemLists: listMenu,
    }
    auth.currentUser.getIdToken(true).then((token) => {
      axios
        .patch(`http://localhost:8000/api/bill/bill/${billId}`, payload, {
          headers: { authtoken: token },
        })
        .then((response) => {
          const notiPayload = {
            title: billHolder.title,
            description: 'Bill have been updated',
            billId: billId,
            usersId: participant,
          }
          axios.post('http://localhost:8000/api/notification', notiPayload, {
            headers: { authtoken: token },
          })
          notificationStore.sendNotification(participantsToken, data)
          router.push('/')
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
  const handleClear = () => {
    setListMenu([])
    setTotalPrice(0)
    setParticipants({
      [authStore.userInfo.username]: {
        cost: 0,
        fcmTokens: authStore.userInfo.fcmTokens,
        uid: authStore.userInfo.uid,
      },
    })
  }

  const handleDelete = () => {
    const data = {
      title: billHolder.title,
      description: 'Bill have been deleted',
    }
    var participantsToken = []

    for (let user in participants) {
      participants[user].fcmTokens.forEach((token) => {
        if (token.isLogIn) {
          participantsToken.push(token.token)
        }
      })
    }
    auth.currentUser.getIdToken(true).then((token) => {
      axios
        .delete(`http://localhost:8000/api/bill/bill/${billId}`, {
          headers: { authtoken: token },
        })
        .then((response) => {
          notificationStore.sendNotification(participantsToken, data)
          router.push('/')
        })
        .catch((err) => {
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
                <Form.Label className={`${styles['form-label']}`}>
                  Bill Name
                </Form.Label>
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
                <Form.Label className={`${styles['form-label']}`}>
                  Prompt Pay ID
                </Form.Label>
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
                <Col md={{ span: 5, offset: 1 }} className="my-4">
                  <Row md={8}>
                    <h6 className="text-center">#Participant</h6>
                  </Row>
                  <Row md={8}>
                    <h4>{totalParticipant}</h4>
                  </Row>
                </Col>
                <Col md={{ span: 5, offset: 1 }} className="my-4">
                  <Row md={8}>
                    <h6>Total amount</h6>
                  </Row>
                  <Row md={8}>
                    <h4>{totalPrice}</h4>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={2} className="my-2">
                  <Button
                    size="sm"
                    variant="outline-warning"
                    onClick={handleClear}
                  >
                    Clear data
                  </Button>{' '}
                </Col>
              </Row>
              {/* Tab bar for menu and participant */}
              <Row>
                <Col>
                  <Tabs
                    fill
                    defaultActiveKey="menu"
                    id="uncontrolled-tab-example"
                  >
                    <Tab eventKey="menu" title="Menu">
                      <Menu
                        list={listMenu}
                        setCurrent={setCurrent}
                        setUpdateModal={setUpdateModalShow}
                      />
                    </Tab>
                    <Tab eventKey="participant" title="participant">
                      <Participant participants={participants} />
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
              <Row className="my-5 justify-content-center">
                <Col md={{ span: 2, offset: 1 }}>
                  <Button
                    size="sm"
                    variant="dark"
                    onClick={() => setModalShow(true)}
                  >
                    Add Menu
                  </Button>{' '}
                </Col>
                <Col md={{ span: 2, offset: 1 }}>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleUpdateBill}
                  >
                    Update
                  </Button>{' '}
                </Col>
                <Col md={{ span: 2, offset: 1 }}>
                  <Button size="sm" variant="danger" onClick={handleDelete}>
                    Delete
                  </Button>{' '}
                </Col>
                {/* <Col md={{span: 3, offset: 1}}><Button size="sm"variant="dark" onClick={() => setModalParticipantShow(true) }>Add Participant</Button>{' '}</Col> */}
              </Row>
            </Col>
            <AddMenuModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              setModalShow={setModalShow}
              setListMenu={setListMenu}
              users={users}
              setParticipants={setParticipants}
              setTotalPrice={setTotalPrice}
              backPage={`/bill/${billId}`}
            />
            <UpdateMenuModal
              show={modalUpdateShow}
              listMenu={listMenu}
              setUpdateModalShow={setUpdateModalShow}
              onHide={() => setUpdateModalShow(false)}
              setListMenu={setListMenu}
              current={current}
              users={users}
              setParticipants={setParticipants}
              setTotalPrice={setTotalPrice}
              backPage={`/bill/${billId}`}
            />
          </Row>
        </Container>
      </>
    </DefaultLayout>
  )
}
export async function getServerSideProps(context) {
  const detail = await axios.get(
    `http://localhost:8000/api/bill/get/${context.params.id}`
  )
  const users = await axios.get(`http://localhost:8000/api/user`)
  const userList = []
  var obj = {}
  users.data.forEach((user) => {
    obj = {
      username: user.username,
      uid: user.uid,
      value: user.username,
      label: user.username,
      fcmTokens: user.fcmTokens,
    }
    userList.push(obj)
  })

  let participantTemp = {}
  let menutemp = detail.data.items
  let listMenuTemp = []
  let totalPriceTemp = 0

  menutemp.forEach((itemList) => {
    let payerTemp = []
    totalPriceTemp += itemList.price
    //create participant object
    itemList.payers.forEach((item) => {
      let costTemp = Math.round(itemList.price / itemList.payers.length)
      let oldCost = participantTemp[item.username]?.cost || 0
      participantTemp[item.username] = {
        uid: item.uid,
        cost: oldCost + costTemp,
        fcmTokens: item.fcmTokens,
      }
    })
    itemList.payers.forEach((payer) => {
      payerTemp.push({
        username: payer.username,
        uid: payer.uid,
        value: payer.username,
        label: payer.username,
        fcmTokens: payer.fcmTokens,
      })
    })
    listMenuTemp.push({
      name: itemList.name,
      payers: payerTemp,
      perPerson: Math.round(itemList.price / itemList.payers.length),
      price: itemList.price,
    })
  })
  return {
    props: {
      id: detail.data.id,
      title: detail.data.title,
      promptPayId: detail.data.promptPay,
      menu: listMenuTemp,
      participants: participantTemp,
      totalPrice: totalPriceTemp,
      users: userList,
    },
  }
}

export default ViewBill
