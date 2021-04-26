import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Col, Container, FormControl, Form, Row, Modal,Button } from 'react-bootstrap';
import Select from 'react-select';
import Link from 'next/link';
import axios from 'axios';
import styles from './modal.module.scss';


export const AddMenuModal = (props) => {
  const [menuName, setMenuName] = useState('');
  const [price, setPrice] = useState(null);
  const [payer, setPayer] = useState([]);
  const [required, setRequired] = useState({
    name:'',
    price:'',
    payer:''
  })
  const name = [
    { value: 'chocolate', label: 'arm', username:'arm' },
    { value: 'strawberry', label: 'name', username:'name'},
    { value: 'vanilla', label: 'earth', username:'earth' }
  ]
  const handleAdd =(e)=>{
    e.preventDefault();
    let allInfo = true;
    let menu = {
      name:menuName,
      price:price,
      payer:payer,
      perPerson: payer.length ? Math.round(price/payer.length) : 0
    }
    if(!menuName.length){
      setRequired((prevRequired) => ({
        ...prevRequired,
        name: '*required',
      }))
      console.log("required")
      allInfo = false
    } else{
      setRequired((prevRequired) => ({
        ...prevRequired,
        name: '',
      }))
    }
    if(!price.length){

      setRequired((prevRequired) => ({
        ...prevRequired,
        price: '*required',
      }))
      console.log("required")
      allInfo = false
    } 
    if(allInfo){ 
      props.setListMenu((prevMenu) => {
        const nextMenu = prevMenu.slice();
        nextMenu.push(menu);
      return nextMenu;
    });
    props.setParticipants((prevPar) => {
      const newParticipant ={...prevPar}
      console.log(newParticipant)
      payer.forEach(user => {
        if(newParticipant[user.username]){
          newParticipant[user.username] += Math.round(price/payer.length);
        }else{
          newParticipant[user.username] = Math.round(price/payer.length)
        }
      });
      return newParticipant
    });
      setMenuName('')
      setPrice('')
      setPayer([])
      props.onHide()
    }
  }
  

  const hide = (e) =>{
    setRequired({
      name:'',
      price:'',
      payer:''
    })
    props.onHide()
  }

  return (
    <Modal
      show={props.show}
      onHide={hide}
      id="browseModal"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header
        closeButton
        className={`show-grid ${styles['browse-body']}`}>
        <Modal.Title className={`${styles['browse-title']}`}>
          Add Menu
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`show-grid ${styles['browse-body']}`}>
        <Container>
        <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label className={styles.label}>
                    Menu Name
                  </Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
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
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                    isInvalid={!!required.price}
                  />
                <FormControl.Feedback type="invalid">
                  {required.price}
                </FormControl.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label className={styles.label}>Participant :</Form.Label>
                  <Select
                  
                    isMulti
                    value={payer}
                    options={name}
                    className="basic-multi-select "
                    classNamePrefix="select"
                    onChange={(e) => setPayer(e)}
                  />
                </Form.Group>
                <Col md={{span:3, offset:5}}><Button size="sm"variant="dark" onClick={handleAdd}><Link href="/bill">
                Add</Link></Button>{' '}</Col>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default AddMenuModal ;
