import React from 'react'
import { Col, Row } from 'react-bootstrap'
import style from './homepage.module.scss'
import Bill from '../../models/bill/bill'
import BillCard from './bill'

export type BillGridProps = {
  bills: Partial<Bill>[]
}

export const BillGrid: React.FC<BillGridProps> = ({ bills }) => {
  const rows = []
  rows.push(
    <Row key={'title'}>
      <Col>
        <Row
          noGutters
          className={`${style['title']} align-items-center rounded`}
        >
          <Col className="pl-3 pr-0" md={4}>
            Title
          </Col>
        </Row>
      </Col>
    </Row>
  )
  for (let i = 0; i < bills.length; i++) {
    rows.push(
      <Row key={i}>
        {i < bills.length && (
          <Col>
            <BillCard key={i} {...bills[i]} />
          </Col>
        )}
      </Row>
    )
  }
  return <>{rows}</>
}

export default BillGrid
