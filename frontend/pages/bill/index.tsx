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
import ParticipantModal from '../../components/Bill/ParticipantModal'
import { auth } from '../../src/firebase'
import axios from 'axios'
import { useRootStore } from '../../stores/stores'
import { useRouter } from 'next/router'
import styles from './bill.module.scss'
import { UpdateMenuModal } from '../../components/Bill/ModalUpdate'
import getConfig from '../../next.config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig;

const apiUrl = serverRuntimeConfig.apiUrl || publicRuntimeConfig.apiUrl;

export const Bill = observer((props: any) => {
  const [billHolder, setBillHolder] = useState({
    title: '',
    promptpayId: '',
  })
  const [required, setRequired] = useState({
    title: '',
    promptpayId: '',
  })
  const [participants, setParticipants] = useState({})
  const authStore = useRootStore().authStore

  // participants = {username:{
  //                            cost : 50
  //                            fcmTokens : [id:15 , token:.....]
  //                            uid : uasdad
  // }}
  const totalParticipant = Object.keys(participants).length
  const [listMenu, setListMenu] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [modalUpdateShow, setUpdateModalShow] = useState(false)
  const [current, setCurrent] = useState(null)
  const router = useRouter()
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
    setParticipants({
      [authStore.userInfo.username]: {
        cost: 0,
        fcmTokens: authStore.userInfo.fcmTokens,
        uid: authStore.userInfo.uid,
      },
    })
  }

  useEffect(() => {
    if (authStore.userInfo) {
      setParticipants((prevPar) => {
        const newParticipant = { ...prevPar }
        if (!newParticipant[authStore.userInfo.username]) {
          newParticipant[authStore.userInfo.username] = {
            cost: 0,
            fcmTokens: authStore.userInfo.fcmTokens,
            uid: authStore.userInfo.uid,
          }
        }
        return newParticipant
      })
    }
  }, [authStore.userInfo])

  const handleCreatedBill = (e) => {
    e.preventDefault()
    let allInfo = true
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

    if (!allInfo) return

    var participant = []
    var participantsToken = []

    for (let user in participants) {
      participant.push(participants[user].uid)
      if (participants[user].fcmTokens) {
        participants[user].fcmTokens.forEach((token) => {
          if (token.isLogIn) {
            participantsToken.push(token.token)
          }
        })
      }
    }

    const payload = {
      title: billHolder.title,
      promptPay: billHolder.promptpayId,
      participants: participant,
      itemLists: listMenu,
    }

    auth.currentUser.getIdToken(true).then((token) => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/api/bill/bill`,
          payload,
          {
            headers: { authtoken: token },
          }
        )
        .then((response) => {
          const notiPayload = {
            title: billHolder.title,
            description: 'New bill Created',
            billId: response.data.id,
            usersId: participant,
          }
          axios.post(
            `${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/api/notification`,
            notiPayload,
            {
              headers: { authtoken: token },
            }
          )
          const data = {
            title: billHolder.title,
            description: 'New bill Created',
            bill: { id: response.data.id },
          }
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
                <Form.Label className={`${styles['form-label']}`}>
                  Prompt Pay ID
                </Form.Label>
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
                <Col md={{ span: 5, offset: 1 }} className="my-4">
                  <Row md={8}>
                    <h6 className="text-center">#Participant</h6>
                  </Row>
                  <Row md={8}>
                    <h4>{totalParticipant}</h4>
                  </Row>
                </Col>
                <Col md={{ span: 3, offset: 1 }} className="my-4">
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
                <Col md={{ span: 3, offset: 1 }}>
                  <Button
                    size="sm"
                    variant="dark"
                    onClick={() => setModalShow(true)}
                  >
                    Add Menu
                  </Button>{' '}
                </Col>
                <Col md={{ span: 3, offset: 1 }}>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleCreatedBill}
                  >
                    Create Bill
                  </Button>{' '}
                </Col>
                {/* <Col md={{span: 3, offset: 1}}><Button size="sm"variant="warning"onClick={handleClear}>Clear data</Button>{' '}</Col> */}
                {/* <Col md={{span: 3, offset: 1}}><Button size="sm"variant="dark" onClick={() => setModalParticipantShow(true) }>Add Participant</Button>{' '}</Col> */}
              </Row>
            </Col>
            <AddMenuModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              setListMenu={setListMenu}
              users={users}
              setParticipants={setParticipants}
              setTotalPrice={setTotalPrice}
              backPage={'/bill'}
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
              backPage={`/bill`}
            />

            {/* <ParticipantModal show={modalParticipantShow} onHide={() => setModalParticipantShow(false)} setParticipant={setParticipants}/> */}
          </Row>
        </Container>
      </>
    </DefaultLayout>
  )
})
export async function getServerSideProps(context) {
  console.log("Server Side Prop")
  const users = await axios
    .get(`${process.env.NEXT_PUBLIC_URL_SERVERSIDE || 'http://localhost:8080'}/api/user`)
  console.log(users)
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
  console.log(userList)
  return {
    props: {
      users: userList,
    },
  }
}

export default Bill
