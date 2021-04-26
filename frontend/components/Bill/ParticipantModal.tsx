import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Col, Container, Jumbotron, Form, Row, Modal,Button } from 'react-bootstrap';
import Select from 'react-select';
import Link from 'next/link';
import axios from 'axios';
import styles from './modal.module.scss';

export const ParticipantModal = (props) => {
  const [payer, setPayer] = useState([]);
  const name = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  
  const handleAdd =(e)=>{
    e.preventDefault();
    console.log("Add");
  }
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      id="browseModal"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header
        closeButton
        className={`show-grid ${styles['browse-body']}`}>
        <Modal.Title className={`${styles['browse-title']}`}>
          Add Participant
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`show-grid ${styles['browse-body']}`}>
        <Container>
        <Row>
            <Col>
              <Form>
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

export default ParticipantModal ;
