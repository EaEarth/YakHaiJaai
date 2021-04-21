import Head from 'next/head'
import React from 'react'
import Image from 'next/image'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

export const editProfile = () => {
  return (
    <>
      <Head>Profile</Head>
      <Container className="my-4">
        <Row>
          <Col className="text-center">Your Profile</Col>
        </Row>
        <Row>
          <Col md={{ span: 5, offset: 1 }} className="mt-5">
            <Image src="/images/user.png" width={200} height={200} />
          </Col>
          <Col md={5}>
            {/* {Content} */}
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Username </Form.Label>
                <Form.Control type="text" placeholder="Your username" />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email </Form.Label>
                <Form.Control type="email" placeholder="helloo@cloud.com" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" placeholder="PhoneNumber" />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 5 }} className="mx-auto mt-5">
            {' '}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
          <Col>
            {' '}
            <Button variant="primary" type="submit">
              cancel
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default editProfile
