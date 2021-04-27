import React from 'react'
import { Col, Row } from 'react-bootstrap'
import style from './homepage.module.scss'
import Bill from '../../models/bill/bill'
import BillCard from './bill'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

export type BillGridProps = {
  bills: any[]
}

export const BillGrid: React.FC<BillGridProps> = ({ bills }) => {
  const rows = []
  const router = useRouter()
  const bill = bills.map((bill) => (
    <Col key={bill.id} className="pl-0 pr-0 pt-3" md={4}>
      <BillCard key={bill.id} {...bill} />
    </Col>
  ))
  rows.push(
    <Row key={'title'}>
      <Col>
        <Row
          noGutters
          className={`${style['title']} align-items-center  justify-content-center rounded`}
        >
          Bill List
        </Row>
        {bill.length > 0 && (
          <Row noGutters className=" align-items-center rounded">
            {bill}
          </Row>
        )}
        {bill.length === 0 && (
          <Row
            noGutters
            className={`${style['empty-bill']} mt-5  justify-content-center rounded`}
          >
            You don't have any bill yet.
          </Row>
        )}
        {bill.length === 0 && (
          <Row
            className={`${style['empty-bill']} mt-2  justify-content-center rounded`}
          >
            <span>Let's </span>
            <Link href="/bill">
              <a className="ml-2">create </a>
            </Link>
            <span>&nbsp;a new one!</span>
          </Row>
        )}
      </Col>
    </Row>
  )
  return <>{rows}</>
}

export default BillGrid
