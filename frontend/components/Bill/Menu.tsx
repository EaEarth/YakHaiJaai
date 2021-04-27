import { Container, Row, Form, Col, Nav, Tabs, Tab, Badge, Button } from 'react-bootstrap';
import { MenuBar } from './MenuBar';
import { MenuInfo } from './MenuInfo';


export type BillMenu = {
	name: string, 
	participantList: Array<any>,  
	price: string
};

export const Menu =(props) => {
    return(
        <>
            <MenuBar/>
            <MenuInfo list={props.list}/>
        </>
    );
}

export default Menu;