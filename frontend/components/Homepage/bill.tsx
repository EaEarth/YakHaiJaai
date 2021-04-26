import { faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { Container, Col, Row, Card } from 'react-bootstrap'
import Bill from '../../models/bill/bill'
import style from './homepage.module.scss'

export type BillCardProps = Partial<Bill>

export const BillCard: React.FC<BillCardProps> = (props) => {
  const router = useRouter()
  return (
    <a
      href={props.id ? `/jobs/${props.id}` : undefined}
      className={style['custom-a']}
      onClick={(e) => e.preventDefault()}
    >
      <Card
        className={`${style['grid']} rounded align-items-center`}
        onClick={() => {
          if (props.id) router.push(`/bills/${props.id}`)
        }}
      >
        <Row noGutters className="align-items-center">
          <Col>
            <Row noGutters className={` justify-content-center`}>
              <FontAwesomeIcon
                className="align-items-center"
                icon={faFileAlt}
                size="5x"
                color="Mediumslateblue"
              />
            </Row>
            <Row
              noGutters
              className={`${style['bill-title']} justify-content-center`}
            >
              {props.title}
            </Row>
          </Col>
        </Row>
      </Card>
    </a>
  )
}

export default BillCard
