import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import {
  Col,
  Container,
  FormControl,
  Form,
  Row,
  Modal,
  Button,
} from 'react-bootstrap'
import Select from 'react-select'
import Link from 'next/link'
import axios from 'axios'
import styles from './modal.module.scss'

export const UpdateMenuModal = (props) => {
  const [menuName, setMenuName] = useState(props.current?.menu.name || null)
  const [price, setPrice] = useState(props.current?.menu.price || null)
  const [payers, setPayers] = useState(props.current?.menu.payers || null)
  const [oldMenu, setOldMenu] = useState(props.current ? props.current : null)
  const backPage = props.backPage
  // const index = props.current?.index || null;
  const [required, setRequired] = useState({
    name: '',
    price: '',
    payers: '',
  })
  const name = props.users
  useEffect(() => {
    if (props.current) {
      setMenuName(props.current.menu.name)
      setPrice(props.current.menu.price)
      setPayers(props.current.menu.payers)
      setOldMenu(props.current)
    }
  }, [props.current])

  const handleAdd = (e) => {
    e.preventDefault()
    let index = props.current.index
    let allInfo = true
    let menu = {
      name: menuName,
      payers: payers,
      perPerson: payers.length ? Math.round(price / payers.length) : 0,
      price: Number(price),
    }
    if (!menuName.length) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        name: '*required',
      }))
      allInfo = false
    } else {
      setRequired((prevRequired) => ({
        ...prevRequired,
        name: '',
      }))
    }
    if (!price) {
      setRequired((prevRequired) => ({
        ...prevRequired,
        price: '*required',
      }))
      allInfo = false
    }
    if (allInfo) {
      props.setListMenu((prevMenu) => {
        const nextMenu = prevMenu.slice()
        nextMenu[index] = menu
        return nextMenu
      })
      props.setTotalPrice((prevPrice) => {
        const newPrice = new Number(price)
        var subtract = 0
        if (oldMenu) {
          subtract = oldMenu.menu.price
        }
        return prevPrice + newPrice - subtract
      })
      if (oldMenu) {
        props.setParticipants((prevPar) => {
          const newParticipant = { ...prevPar }
          oldMenu.menu.payers.forEach((user) => {
            newParticipant[user.username].cost -= Math.round(
              oldMenu.menu.price / oldMenu.menu.payers.length
            )
          })
          return newParticipant
        })
      }
      props.setParticipants((prevPar) => {
        const newParticipant = { ...prevPar }
        payers.forEach((user) => {
          if (newParticipant[user.username]) {
            newParticipant[user.username].cost += Math.round(
              price / payers.length
            )
          } else {
            newParticipant[user.username] = {
              uid: user.uid,
              cost: Math.round(price / payers.length),
              fcmTokens: user.fcmTokens,
            }
          }
        })

        return newParticipant
      })
      setMenuName('')
      setPrice('')
      setPayers([])
      props.onHide()
    }
  }
  const hide = (e) => {
    setRequired({
      name: '',
      price: '',
      payers: '',
    })
    props.onHide()
  }

  const handleRemove = (e) => {
    let index = props.current.index
    props.setTotalPrice((prevPrice) => {
      var subtract = 0
      if (oldMenu) {
        subtract = oldMenu.menu.price
      }
      return prevPrice - subtract
    })
    if (oldMenu) {
      props.setParticipants((prevPar) => {
        const newParticipant = { ...prevPar }
        oldMenu.menu.payers.forEach((user) => {
          newParticipant[user.username].cost -= Math.round(
            oldMenu.menu.price / oldMenu.menu.payers.length
          )
        })
        return newParticipant
      })
    }
    props.setListMenu((prevMenu) => {
      const nextMenu = prevMenu.slice()
      nextMenu.splice(index, 1)
      return nextMenu
    })
    setMenuName('')
    setPrice('')
    setPayers([])
    props.onHide()
  }

  return (
    <Modal
      show={props.show}
      onHide={hide}
      id="browseModal"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        closeButton
        className={`show-grid ${styles['browse-body']}`}
      >
        <Modal.Title className={`${styles['browse-title']}`}>
          Update Menu
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`show-grid ${styles['browse-body']}`}>
        <Container>
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label className={styles.label}>Menu Name</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    isInvalid={!!required.name}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.name}
                  </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label className={styles.label}>Price :</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value)
                    }}
                    isInvalid={!!required.price}
                  />
                  <FormControl.Feedback type="invalid">
                    {required.price}
                  </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label className={styles.label}>
                    Participant :
                  </Form.Label>
                  <Select
                    isMulti
                    value={payers}
                    options={name}
                    className="basic-multi-select "
                    classNamePrefix="select"
                    onChange={(e) => setPayers(e)}
                  />
                </Form.Group>
                <Row>
                  <Col md={{ span: 3, offset: 3 }}>
                    <Button size="sm" variant="dark" onClick={handleAdd}>
                      Save
                    </Button>{' '}
                  </Col>
                  <Col md={{ span: 3 }}>
                    <Button size="sm" variant="danger" onClick={handleRemove}>
                      Remove
                    </Button>{' '}
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  )
}

export default UpdateMenuModal
