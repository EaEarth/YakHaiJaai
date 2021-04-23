import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { Col, Container, Form, Row, FormControl, Modal } from 'react-bootstrap'
import DefaultLayout from '../../layouts/Default'
import Image from 'react-bootstrap/Image'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useRootStore } from '../../stores/stores'
import { auth } from '../../src/firebase'
import AuthStore from '../../stores/AuthStore'

export const Register = (props) => {
  const router = useRouter()
  const systemStore = useRootStore().systemStore
  const [pict, setPict] = useState(null)
  const [urlPic, setURLPic] = useState(null)
  const [profile, setProfile] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmedPassword: '',
  })
  const [required, setRequired] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmedPassword: '',
  })

  useEffect(() => {
    if (pict !== null) {
      const url = URL.createObjectURL(pict)
      setURLPic(url)

      return () => URL.revokeObjectURL(url)
    }
  }, [pict])

  const handleChange = (e) => {
    const { id, value } = e.target
    if (id === 'confirmedPassword') {
      if (value !== profile.password) {
        setRequired((prevRequired) => ({
          ...prevRequired,
          confirmedPassword: "*Password doesn't match",
        }))
      } else {
        setRequired((prevRequired) => ({
          ...prevRequired,
          confirmedPassword: '',
        }))
      }
    } else if (id === 'password') {
      if (profile.confirmedPassword.length) {
        if (value !== profile.confirmedPassword) {
          setRequired((prevRequired) => ({
            ...prevRequired,
            confirmedPassword: "*Password doesn't match",
          }))
        } else {
          setRequired((prevRequired) => ({
            ...prevRequired,
            confirmedPassword: '',
          }))
        }
        if (
          required.password == 'Password must have more than 5 characters' &&
          required.password.length &&
          required.password.length > 5
        ) {
          setRequired((prevRequired) => ({
            ...prevRequired,
            password: '',
          }))
        }
      }
      if (required[id] === '*required' && value.length) {
        setRequired((prevState) => ({
          ...prevState,
          [id]: '',
        }))
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

    if (!profile.confirmedPassword.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        password: '*required',
      }))
      allInfo = false
    } else if (required.confirmedPassword.length) {
      allInfo = false
    } else
      setRequired((prevRequired) => ({
        ...prevRequired,
        confirmedPassword: '',
      }))

    if (!allInfo) return
    const payload = {
      username: profile.username,
      firstname: profile.firstname,
      lastname: profile.lastname,
      phoneNumber: profile.phoneNumber,
      avatarId: pict?.id || null,
    }
    if (pict != null) {
      await systemStore.uploadFile(pict)
      payload['avatarId'] = systemStore.id
    }
    auth
      .createUserWithEmailAndPassword(profile.email, profile.password)
      .then((cred) => {
        auth.currentUser.getIdToken(true).then((idToken) => {
          axios
            .post('http://localhost:8000/api/user', payload, {
              headers: {
                authtoken: idToken,
              },
            })
            .then((response) => {
              if (response.status === 201) {
                router.push('/')
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
                  <p style={{ color: 'red' }}>{required.email}</p>
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
                  <p style={{ color: 'red' }}>{required.password}</p>
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
                    value={profile.confirmedPassword}
                    onChange={handleChange}
                    isInvalid={!!required.confirmedPassword}
                  />
                  <p style={{ color: 'red' }}>{required.confirmedPassword}</p>
                  <FormControl.Feedback type="invalid">
                    {!!required.confirmedPassword}
                  </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <FormControl
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={profile.username}
                    onChange={handleChange}
                    required
                    isInvalid={!!required.username}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.username}
                  </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Firstname</Form.Label>
                  <FormControl
                    type="text"
                    id="firstname"
                    placeholder="Firstname"
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
                  <Form.Label>Lastname</Form.Label>
                  <FormControl
                    type="text"
                    id="lastname"
                    placeholder="Lastname"
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
          <Col>
            <button
              type="button"
              className="float-right my-2 btn btn-success"
              onClick={handleSubmitClick}
            >
              register
            </button>
          </Col>
          <Col>
            <button
              type="button"
              className="float-left my-2 btn btn-danger"
              onClick={() => {
                router.push('/')
              }}
            >
              Cancel
            </button>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  )
}

export default Register
