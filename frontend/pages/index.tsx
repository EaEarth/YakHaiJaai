import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap'
import DefaultLayout from '../layouts/Default'
import styles from '../components/Homepage/homepage.module.scss'
import { GetServerSidePropsContext } from 'next'
import axios from 'axios'
import { auth, firebase } from '../src/firebase'
import BillGrid from '../components/Homepage/Grid'
import { useRouter } from 'next/router'
import dotenv from 'dotenv'
import { useRootStore } from '../stores/stores'
import { observer } from 'mobx-react-lite'

export const Home = observer((props) => {
  const [bills, setbills] = useState([])
  const [firstTime, setFirstTime] = useState(true)
  const authStore = useRootStore().authStore
  const router = useRouter()
  var messaging
  if (process.browser) {
    messaging = firebase.messaging()
    messaging.requestPermission().catch(function (err) {
      console.log('Unable to get permission to notify.', err)
    })
  }

  // auth.onAuthStateChanged(async (user) => {
  //   console.log(user)
  //   if (user) {
  //     if (firstTime) {
  //       const token = await user.getIdToken(true)
  //       const response = await axios.get(
  //         `http://localhost:8000/api/bill/list`,
  //         {
  //           headers: {
  //             authtoken: token,
  //           },
  //         }
  //       )
  //       setbills(response.data)
  //       setFirstTime(false)
  //     }
  //   } else {
  //     setbills([])
  //     setFirstTime(true)
  //   }
  // })

  useEffect(() => {
    if (authStore.user ) {
      auth.currentUser.getIdToken(true).then((token) => {
        axios
          .get(`http://localhost:8000/api/bill/list`, {
            headers: {
              authtoken: token,
            },
          })
          .then((response) => {
            setbills(response.data)
          })
      })
    } else {
      setbills([])
    }
  },[authStore.user])

  return (
    <DefaultLayout>
      <Head>
        <title>YakHaiJaai</title>
      </Head>
      <Jumbotron className={`${styles['bill-list']}`}>
        <Container className={`${styles['container']}`}>
          <Row className="show-grid m-1">
            <Col className={`${styles['table-title']} m-0 font-weight-bold `}>
              Your Bill
            </Col>
            <Col className={`${styles['button']}  text-md-right `}>
              <Button
                className={`${styles['button']}`}
                onClick={() => router.push('/bill')}
              >
                Create
              </Button>
            </Col>
          </Row>
          <BillGrid bills={bills} />
        </Container>
      </Jumbotron>
    </DefaultLayout>
  )
})

export default Home