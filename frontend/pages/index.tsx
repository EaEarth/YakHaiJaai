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

export const Home = (props) => {
  const [bills, setbills] = useState(props.bills)
  const router = useRouter()
  var messaging
  if (process.browser) {
    messaging = firebase.messaging()
    messaging.requestPermission().catch(function (err) {
      console.log('Unable to get permission to notify.', err)
    })
  }
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
                onClick={() => router.push('/')}
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
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = auth.currentUser
  var bills
  if (user) {
    const token = user.getIdToken(true)
    bills = await axios.get(`http://localhost:8000/api/bill/list`, {
      headers: {
        authtoken: token,
      },
    })
  } else {
    bills = []
  }

  return {
    props: {
      bills: bills,
    },
  }
}

export default Home
