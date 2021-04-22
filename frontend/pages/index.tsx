import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Col, Container, Jumbotron, Row } from 'react-bootstrap'
import DefaultLayout from '../layouts/Default'
import styles from '../components/Homepage/homepage.module.scss'
import { GetServerSidePropsContext } from 'next'
import axios from 'axios'
import { auth } from '../src/firebase'
import BillGrid from '../components/Homepage/Grid'

export const Home = (props) => {
  const [bills, setbills] = useState(props.bills)
  return (
    <DefaultLayout>
      <Head>
        <title>YakHaiJaai</title>
      </Head>
      <Jumbotron className={`${styles['recommend']}`}>
        <Container>
          <Row className="d-block">
            <h3 className="mb-4 font-weight-bold ">Bill List</h3>
            <BillGrid bills={bills} />
          </Row>
        </Container>
      </Jumbotron>
    </DefaultLayout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookie = context.req.cookies
  const token = auth.currentUser.getIdToken(true)
  const bills = await axios.get(`http://localhost:8000/api/bill/list`, {
    headers: {
      authtoken: token,
    },
  })

  return {
    props: {
      bills: bills,
    },
  }
}

export default Home
