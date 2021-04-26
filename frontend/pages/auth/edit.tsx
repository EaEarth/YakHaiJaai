import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { Col, Container, Form, Row, FormControl, Modal } from 'react-bootstrap'
import DefaultLayout from '../../layouts/Default'
import Image, { propTypes } from 'react-bootstrap/Image'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useRootStore } from '../../stores/stores'
import { auth, firebase } from '../../src/firebase'
import AuthStore from '../../stores/AuthStore'
import { GetServerSidePropsContext } from 'next'

export const Edit = (props) => {
  const router = useRouter()
  const systemStore = useRootStore().systemStore
  const [pict, setPict] = useState(null)
  const [urlPic, setURLPic] = useState(null)
  const [oldUserInfo, setOldUserInfo] = useState(null)
  const [firstTime, setFirstTime] = useState(true)
  const [profile, setProfile] = useState({
    username: '',
    firstname: '',
    lastname: '',
    phoneNumber: '',
  })
  const [required, setRequired] = useState({
    username: '',
    firstname: '',
    lastname: '',
    phoneNumber: '',
  })

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      if (firstTime) {
        const token = await user.getIdToken(true)
        const response = await axios.get(
          `http://localhost:8000/api/user/current-user/info`,
          {
            headers: {
              authtoken: token,
            },
          }
        )
        const userInfo = response.data
        setOldUserInfo(userInfo)
        setPict(userInfo.avatarPict ? userInfo.avatarPict : null)
        setURLPic(userInfo.avatarPict ? userInfo.avatarPict.path : null)
        setProfile((prevState) => ({
          ...prevState,
          username: userInfo.username,
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          phoneNumber: userInfo.phoneNumber,
        }))
        setFirstTime(false)
      }
    } else {
      setOldUserInfo(null)
    }
  })

  useEffect(() => {
    if (pict !== null && pict !== oldUserInfo.avatarFile && !pict.title) {
      const url = URL.createObjectURL(pict)
      setURLPic(url)

      return () => URL.revokeObjectURL(url)
    }
  }, [pict])

  const handleChange = (e) => {
    const { id, value } = e.target
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

    if (!profile.username.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        username: '*required',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, username: '' }))

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

    if (!profile.phoneNumber.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        phoneNumber: '*required',
      }))
      allInfo = false
    } else setRequired((prevRequired) => ({ ...prevRequired, phoneNumber: '' }))

    if (!allInfo) return
    const payload = {
      username:
        profile.username === oldUserInfo.username ? null : profile.username,
      firstname:
        profile.firstname === oldUserInfo.firstname ? null : profile.firstname,
      lastname:
        profile.lastname === oldUserInfo.lastname ? null : profile.lastname,
      phoneNumber:
        profile.phoneNumber === oldUserInfo.phoneNumber
          ? null
          : profile.phoneNumber,
      avatarId: pict === oldUserInfo.avatarFile ? null : pict?.id || null,
      fcmToken: null,
    }
    if (pict != null && pict !== oldUserInfo.avatarPict) {
      await systemStore.uploadFile(pict)
      payload['avatarId'] = systemStore.id
    }
    updateProfile(payload)
  }

  const updateProfile = (payload) => {
    auth.currentUser.getIdToken(true).then(async (token) => {
      const instance = axios.create({
        baseURL: 'http://localhost:8000/api',
        headers: { authtoken: token },
      })
      instance
        .patch('/user', payload)
        .then((response) => {
          router.push('/')
        })
        .catch((err) => {
          setRequired((prevRequired) => ({
            ...prevRequired,
            username: 'Username already exists.',
          }))
        })
    })
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Edit</title>
      </Head>

      <Container className="my-4">
        <Row>
          <Col className="text-center">
            <h1>Edit Your Profile</h1>
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
              Save
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

export default Edit
