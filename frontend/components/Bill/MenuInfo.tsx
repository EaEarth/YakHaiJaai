import {
  Container,
  Row,
  Form,
  Col,
  Nav,
  Tabs,
  Tab,
  Badge,
  Button,
} from 'react-bootstrap'
import styles from './billpage.module.scss'
import Payer from './Payer'
import { UpdateMenuModal } from './ModalUpdate'

export const MenuInfo = (props) => {
  const items = props.list.map((item, index) => (
    <Row
      onClick={() => {
        props.setUpdateModal(true)
        props.setCurrent({
          index: index,
          menu: { name: item.name, price: item.price, payers: item.payers },
        })
      }}
      className={`${styles['item']}`}
    >
      <Col md={4}>
        <p className="m-0">{item.name}</p>
      </Col>
      <Col md={{ span: 3, offset: 1 }}>
        <p className="m-0">{item.price}</p>
      </Col>
      <Col md={{ span: 3, offset: 1 }}>
        <p className="m-0">{item.perPerson}</p>
      </Col>
      <Payer payerList={item.payers}></Payer>
    </Row>
  ))
  return <>{items}</>
}

export default MenuInfo
