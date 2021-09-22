import Head from 'next/head'
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import DefaultLayout from '../layouts/Default'
import axios from 'axios'
import Link from 'next/link'

export const Edit = (props) => {
  const [profile, setProfile] = useState({
    username: props.profile.username,
    firstname: props.profile.firstname,
    lastname: props.profile.lastname,
  })

  return (
    <DefaultLayout>
      <Head>
        <title>Welcome</title>
      </Head>

      <Container className="my-4">
        <Row>
          <Col className="text-center">
            <h1>Welcome</h1>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-5">
            <h4>{profile.username || 'guest'}</h4>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <h5>
              {profile.firstname || 'new'}
              {'  '}
              {profile.lastname || 'user'}
            </h5>
          </Col>
        </Row>
        <Row className="m-5">
          <Col className="text-center">
            <h3>Is this not you? </h3>
            <Link href="/user/info">
              <a>
                <h3>Click</h3>
              </a>
            </Link>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  )
}

export async function getServerSideProps(context) {
  const { data } = await axios.get(`http://localhost:8080/api/user`)
  return {
    props: {
      profile: data[0],
    },
  }
}

export default Edit
