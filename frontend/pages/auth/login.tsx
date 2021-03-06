import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Row,
} from 'react-bootstrap'
import DefaultLayout from '../../layouts/Default'
import { auth, firebase } from '../../src/firebase'
import { useRootStore } from '../../stores/stores'
import axios from 'axios'

export const Login = observer((prop) => {
  const router = useRouter()
  const authStore = useRootStore().authStore
  const [state, setState] = useState({
    email: '',
    password: '',
    error: null,
  })
  const [loginUser, setLoginUser] = useState(null)

  useEffect(() => {
    if (loginUser) router.push('/')
  }, [loginUser])

  useEffect(() => {
    if (authStore.user) router.push('/')
  }, [authStore.user])

  const handleSubmitClick = (e) => {
    e.preventDefault()

    const { email, password } = state

    auth
      .signInWithEmailAndPassword(email, password)
      .then(async (response) => {
        setLoginUser((prevState) => response.user)
        authStore.setUser(response.user)
        await auth.currentUser.getIdToken(true).then(async (idToken) => {
          var messaging
          if (process.browser) {
            messaging = firebase.messaging()
            await messaging
              .requestPermission()
              .then(function () {
                console.log('Notification permission granted.')
                messaging
                  .getToken({
                    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
                  })
                  .then((currentToken) => {
                    if (currentToken) {
                      const payload = { fcmToken: currentToken }
                      axios
                        .patch(
                          `${
                            process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'
                          }/api/user`,
                          payload,
                          {
                            headers: {
                              authtoken: idToken,
                            },
                          }
                        )
                        .then((response) => {
                          if (response.status === 200) {
                            router.push('/')
                          }
                        })
                        .catch((err) => {
                          console.log(err)
                        })
                    } else {
                      console.log(
                        'No registration token available. Request permission to generate one.'
                      )
                      router.push('/')
                    }
                  })
                  .catch((err) => {
                    console.log(
                      'An error occurred while retrieving token. ',
                      err
                    )
                    router.push('/')
                  })
              })
              .catch(function (err) {
                console.log('Unable to get permission to notify.', err)
                router.push('/')
              })
          }
        })
        router.push('/')
      })
      .catch((error) => {
        setState((prevState) => ({ ...prevState, error: error.message }))
      })
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }
  return (
    <DefaultLayout>
      <Head>
        <title>login</title>
      </Head>
      <Container>
        <Row className="justify-content-center">
          <Col md={{ span: 4 }}>
            <h2 className="text-center my-3">login</h2>
            <Form>
              <FormGroup>
                <FormControl
                  type="text"
                  id="email"
                  value={state.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="password"
                  id="password"
                  value={state.password}
                  placeholder="Password"
                  onChange={handleChange}
                />
                <p className="text-danger d-block text-start ml-2">
                  {state.error}
                </p>
              </FormGroup>
              <Row className="d-flex justify-content-center">
                <button
                  type="button"
                  className="my-2 btn btn-primary"
                  onClick={handleSubmitClick}
                >
                  Login
                </button>
              </Row>
              <Row className="justify-content-center">
                <span>Don't have an account?</span>
                <Link href="/auth/register">
                  <a className="ml-2">Register</a>
                </Link>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  )
})

export default Login
