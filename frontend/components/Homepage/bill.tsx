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
        className={`${style['grid']} rounded`}
        onClick={() => {
          if (props.id) router.push(`/bills/${props.id}`)
        }}
      >
        <Row noGutters className="align-items-center">
          <Col md={4} className="d-flex align-items-center">
            <Row noGutters>
              <Col className="d-flex align-items-center">{props.title}</Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </a>
  )
}

export default BillCard
