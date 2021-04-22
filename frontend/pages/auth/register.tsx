import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { Col, Container, Form, Row, FormControl, Modal } from 'react-bootstrap'
import DefaultLayout from '../../layouts/Default'
import Image from 'react-bootstrap/Image'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useRootStore } from '../../stores/stores'
import { auth } from '../../src/firebase'

export const Register = (props) => {
  const router = useRouter()
  const systemStore = useRootStore().systemStore
  const [modalShow, setModalShow] = useState(false)
  const [pict, setPict] = useState(null)
  const [urlPic, setURLPic] = useState(null)
  const [profile, setProfile] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confimedPassword: '',
  })
  const [required, setRequired] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confimedPassword: '',
  })

  useEffect(() => {
    if (pict == null) return
    const url = URL.createObjectURL(pict)
    setURLPic(url)

    return () => URL.revokeObjectURL(url)
  }, [pict])

  const handleChange = (e) => {
    const { id, value } = e.target
    if (id === 'confirmedPassword') {
      if (value !== profile.password) {
        setRequired((prevRequired) => ({
          ...prevRequired,
          confimedPassword: "*Password doesn't match",
        }))
      } else {
        setRequired((prevRequired) => ({
          ...prevRequired,
          confimedPassword: '',
        }))
      }
    } else if (id === 'password') {
      if (profile.confimedPassword.length) {
        if (value !== profile.confimedPassword) {
          setRequired((prevRequired) => ({
            ...prevRequired,
            confimedPassword: "*Password doesn't match",
          }))
        } else {
          setRequired((prevRequired) => ({
            ...prevRequired,
            confimedPassword: '',
          }))
        }
      }
    }
    setProfile((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setPict(file)
  }

  const handleSubmitClick = async (e) => {
    e.preventDefault()
    let allInfo = true
    if (!profile.firstname.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        firstname: '*required',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, firstname: '' }))

    if (!profile.lastname.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        lastname: '*required',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, lastname: '' }))

    if (!profile.email.length) {
      setRequired((prevRequired) => ({ ...prevRequired, email: '*required' }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, email: '' }))

    if (!profile.phoneNumber.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        phoneNumber: '*required',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, phoneNumber: '' }))

    if (!profile.password.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        password: '*required',
      }))
      allInfo = false
    } else if (profile.password.length < 6) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        password: 'Password must have more than 5 characters',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, password: '' }))

    if (!profile.confimedPassword.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        password: '*required',
      }))
      allInfo = false
    } else if (required.confimedPassword.length) {
      allInfo = false
    } else
      setRequired((prevRequired) => ({
        ...prevRequired,
        confirmedPassword: '',
      }))

    if (!allInfo) return
    const payload = {
      firstname: profile.firstname,
      lastname: profile.lastname,
      phoneNumber: profile.phoneNumber,
      avatarId: pict?.id || null,
    }
    if (pict != null) {
      await systemStore.uploadFile(pict)
      payload['avatarFileId'] = systemStore.id
    }
    auth
      .createUserWithEmailAndPassword(profile.email, profile.password)
      .then((cred) => {
        auth.currentUser.getIdToken(true).then((idToken) => {
          axios
            .post('/user', payload, {
              headers: {
                authtoken: idToken,
              },
            })
            .then((response) => {
              if (response.status === 200) {
                setModalShow(true)
              }
            })
            .catch((err) => {
              console.log(err)
            })
        })
      })
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Register</title>
      </Head>

      <Container className="my-4">
        <Row>
          <Col className="text-center">
            <h1>Register</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 5, offset: 1 }} className="mt-5">
            <Image
              src={urlPic || pict?.path || '/images/user/User.svg'}
              className="my-2 d-block w-75 mx-auto"
              rounded
            />
            <Form>
              <Form.Group>
                <Form.File
                  id="profilePic"
                  className="d-flex justify-content-center w-75 mx-auto mb-3"
                  label="Profile picture"
                  data-browse="Add profile"
                  onChange={handleFileChange}
                  custom
                />
              </Form.Group>
            </Form>
          </Col>
          <Col md={{ span: 5 }} className="mx-auto mt-5">
            <h2>Information</h2>
            <Form>
              <fieldset>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <FormControl
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={profile.email}
                    onChange={handleChange}
                    isInvalid={!!required.email}
                  />
                  <FormControl.Feedback type="invalid">
                    {!!required.email}
                  </FormControl.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <FormControl
                    type="password"
                    id="password"
                    placeholder="password"
                    value={profile.password}
                    onChange={handleChange}
                    isInvalid={!!required.password}
                  />
                  <FormControl.Feedback type="invalid">
                    {!!required.password}
                  </FormControl.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirmed Password</Form.Label>
                  <FormControl
                    type="password"
                    id="confirmedPassword"
                    placeholder="Confirmed Password"
                    value={profile.confimedPassword}
                    onChange={handleChange}
                    isInvalid={!!required.confimedPassword}
                  />
                  <FormControl.Feedback type="invalid">
                    {!!required.confimedPassword}
                  </FormControl.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <FormControl
                    type="text"
                    id="firstname"
                    placeholder="First Name"
                    value={profile.firstname}
                    onChange={handleChange}
                    required
                    isInvalid={!!required.firstname}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.firstname}
                  </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <FormControl
                    type="text"
                    id="lastname"
                    placeholder="Last Name"
                    value={profile.lastname}
                    onChange={handleChange}
                    isInvalid={!!required.lastname}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.lastname}
                  </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <FormControl
                    type="text"
                    id="phoneNumber"
                    placeholder="Phone Number"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    isInvalid={!!required.phoneNumber}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.phoneNumber}
                  </FormControl.Feedback>
                </Form.Group>
              </fieldset>
            </Form>
          </Col>
        </Row>
        <Row className="">
          <Col md={6}>
            <button
              type="button"
              className="float-right my-2 btn btn-success"
              onClick={handleSubmitClick}
            >
              register
            </button>
          </Col>
          <Col md={6}>
            <button
              type="button"
              className="float-left my-2 btn btn-danger"
              onClick={() => {
                router.push('/home')
              }}
            >
              Cancel
            </button>
          </Col>
        </Row>
      </Container>
      <Modal show={modalShow} onHide={(e) => setModalShow(false)} centered>
        <Modal.Body className={``}>
          <Container>
            <Row>
              <Col className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="256"
                  height="256"
                  fill="currentColor"
                  className="bi bi-check2 text-success"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                </svg>
                <h1 className="text-success mb-2">Register Successful</h1>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </DefaultLayout>
  )
}

export default Register
