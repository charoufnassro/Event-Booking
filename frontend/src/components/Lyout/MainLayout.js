import React, { Component } from 'react';
import './MainLayout.css';

import { Link } from 'react-router-dom';
import Auth from '../../pages/Auth';
import AuthContext from '../../context/auth-context';
// import ModalLogin from '../Login/Login';

import { Layout, Menu, Icon, Badge, Row, Col, Input, Popover} from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;
// const { SubMenu } = Menu;

const login = (
  <Auth />
);


export default class MainLayout extends Component {
  state = {
    collapsed: false,
    SelectedKeys:  1,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  
  changeSelectedKey = key =>{

    this.setState({
      SelectedKeys: key,
    })
  }


  render() {
      
    return (
      <AuthContext.Consumer>
        {(context) => {
          return    <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                  <div className="logo">{(this.state.collapsed)? 'EB' : 'Event Booking' }</div>

                  <Menu theme="dark" defaultSelectedKeys={[`${this.state.SelectedKeys}`]} mode="inline">
                    <Menu.Item key="1">
                        <Icon type="carry-out" />   
                        <span>Events</span>
                        <Link to="/events" />
                    </Menu.Item>
                    {context.token && <Menu.Item key="2" title="Bookings">
                        <Icon type="bold" />
                        <span>Bookings</span>
                        <Link to="/bookings" />
                    </Menu.Item>}
                  </Menu>
                </Sider>
                <Layout>
                  <Header className="header" style={{background: '#fff', padding: 0}}>
                    <Row >
                        <Col span={18} style={{textAlign: 'center'}}>
                            <div >
                                <div className="search" >
                                <Search  placeholder="Search"  onSearch={value => console.log(value)}  style={{ width: '60%'}} />
                                </div>
                            </div>
                        </Col>
                        <Col span={6} style={{textAlign: 'right'}}>
                            {/* <ModalLogin /> */}
                        <div className="auth" style={{width: 100, textAlign: 'right'}} >
                            {/* <NavLink to="/auth" style={{color: 'inherit', fontWeight: 'bold'}}>Login</NavLink> */}
                            {(!context.token)? <Popover placement="bottomRight"  content={login} trigger="click">
                                Login
                              <Icon type="login" style={{margin: '0 .5em', fontWeight: 'bold'}}/>
                            </Popover> : <div onClick={context.logout}>
                                Logout
                              <Icon type="logout" style={{margin: '0 .5em', fontWeight: 'bold'}}/>
                            </div>}
                            
                        </div>
                        </Col>
                    </Row>
                  </Header>
                  <Content style={{ margin: '10px 16px' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        {this.props.children}
                    </div>
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>Events Booking ©{new Date().getFullYear()} Created by  <Badge status="processing" text="Charouf Nassro" /></Footer>
                </Layout>
              </Layout>
        }}
      </AuthContext.Consumer>
    );
  }
}