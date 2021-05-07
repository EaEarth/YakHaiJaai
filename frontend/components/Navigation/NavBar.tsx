import {
  Badge,
  Button,
  Col,
  Form,
  FormControl,
  NavDropdown,
  Row,
} from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { observer } from 'mobx-react-lite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useRootStore } from '../../stores/stores'
import { auth, firebase } from '../../src/firebase'
import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from '../Homepage/homepage.module.scss'

export const NavBar = observer((props) => {
  const router = useRouter()
  const authStore = useRootStore().authStore
  const notificationStore = useRootStore().notificationStore

  var messaging
  if (process.browser) {
    messaging = firebase.messaging()
    messaging.onMessage((payload) => {
      var id = null
      if (payload.data.bill) {
        const bill = JSON.parse(payload.data.bill)
        id = { id: bill.id }
      }
      const message = {
        title: payload.data.title,
        description: payload.data.description,
        bill: id,
      }
      var isDuplicated = false
      const noti = notificationStore.getNotifications
      for (let i = 0; i < noti.length; i++) {
        if (
          noti[i].title === message.title &&
          noti[i].description === message.description
        ) {
          if (!noti[i].bill) {
            if (!message.bill) {
              isDuplicated = true
              break
            }
          } else {
            if (message.bill && message.bill.id === noti[i].bill.id) {
              isDuplicated = true
              break
            }
          }
        }
      }
      if (!isDuplicated) {
        noti.unshift(message)
        notificationStore.setNotifications(noti)
        notificationStore.setNotificationCount(
          notificationStore.notificationCount + 1
        )
      }
    })
  }

  const handleNotiClick = async (billNoti) => {
    if (billNoti && billNoti.id) {
      const bill = await axios.get(
        `${process.env.URL || 'http://localhost:8080'}/api/bill/get/${
          billNoti.id
        }`
      )
      if (bill) {
        router.push(`/bill/${billNoti.id}`)
      }
    }
  }

  const notification = notificationStore.notifications.map((noti) => (
    <NavDropdown.Item key={noti.id} onClick={() => handleNotiClick(noti.bill)}>
      <Col className={`p-0`}>
        <Row>
          <Col className={`${styles['nav-title']}`}>{noti.title}</Col>
        </Row>
        <Row>
          <Col className={`${styles['nav-item']}`}>{noti.description}</Col>
        </Row>
      </Col>
    </NavDropdown.Item>
  ))

  const handleRegisterClick = (e) => {
    router.push('/auth/register')
  }

  const handleLoginClick = (e) => {
    router.push('/auth/login')
  }

  const handleLogoutClick = async (e) => {
    e.preventDefault()
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
                axios.patch(
                  `${
                    process.env.URL || 'http://localhost:8080'
                  }/api/user/token`,
                  {
                    token: currentToken,
                    isLogin: false,
                  }
                )
              } else {
                console.log(
                  'No registration token available. Request permission to generate one.'
                )
              }
            })
            .catch((err) => {
              console.log('An error occurred while retrieving token. ', err)
            })
        })
        .catch(function (err) {
          console.log('Unable to get permission to notify.', err)
        })
    }
    auth.signOut().then((response) => {
      authStore.setUser(null)
      router.push('/')
    })
  }

  const handleToggleNotification = (e) => {
    notificationStore.setNotificationCount(0)
    auth.currentUser.getIdToken(true).then((idToken) => {
      const instance = axios.create({
        baseURL: `${process.env.URL || 'http://localhost:8080'}/api`,
        headers: { authtoken: idToken },
      })
      instance.patch('/notification/readAll').catch((error) => {
        console.error(error)
      })
    })
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      authStore.setUser(user)
    } else {
      authStore.setUser(null)
    }
  })

  useEffect(() => {
    if (authStore.user) {
      auth.currentUser.getIdToken(true).then((idToken) => {
        axios
          .get(
            `${
              process.env.URL || 'http://localhost:8080'
            }/api/user/current-user/info`,
            {
              headers: {
                authtoken: idToken,
              },
            }
          )
          .then(function (response) {
            authStore.setUserInfo(response.data)
          })
        axios
          .get(
            `${
              process.env.URL || 'http://localhost:8080'
            }/api/notification/current-user/unreaded`,
            {
              headers: {
                authtoken: idToken,
              },
            }
          )
          .then(function (response) {
            notificationStore.setNotifications(response.data)
            notificationStore.setNotificationCount(response.data.length)
          })
      })
    } else {
      authStore.setUserInfo(null)
    }
  }, [authStore.user])

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Yak-Hai-Jaai</Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      {authStore.isLoggedIn && (
        <NavDropdown
          onClick={handleToggleNotification}
          className="left-aligned"
          title={
            <>
              <FontAwesomeIcon icon={faBell} color="white" size="lg" />
              <Badge
                pill
                variant="danger"
                style={{ position: 'absolute', top: '-0.3em', left: '2.2em' }}
              >
                {notificationStore.notificationCount
                  ? notificationStore.notificationCount
                  : ''}
              </Badge>
            </>
          }
          id="collasible-nav-dropdown"
        >
          {notification}
        </NavDropdown>
      )}
      {!authStore.isLoggedIn && (
        <Nav.Link className="right-aligned" onClick={handleRegisterClick}>
          register
        </Nav.Link>
      )}
      {authStore.isLoggedIn && (
        <Nav.Link className="right-aligned" onClick={handleLogoutClick}>
          logout
        </Nav.Link>
      )}
      {authStore.isLoggedIn && (
        <Button
          onClick={() => {
            router.push('/auth/edit')
          }}
        >
          <FontAwesomeIcon icon={faUserCircle} size="lg" />{' '}
          {authStore.userInfo.username}
        </Button>
      )}
      {!authStore.isLoggedIn && (
        <Button onClick={handleLoginClick}>
          <FontAwesomeIcon icon={faUserCircle} size="lg" /> Login
        </Button>
      )}
    </Navbar>
  )
})

export default NavBar
