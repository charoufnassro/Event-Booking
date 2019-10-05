import React, { Component, createRef } from 'react'
import AuthContext from '../context/auth-context';

import { Form, Icon, Input, Button, Checkbox} from 'antd';

export default class Auth extends Component {

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.emailEl = createRef();
        this.passwordEl = createRef();
    }

  handleSubmit = e => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    
    if(email.trim().length === 0 || password.trim().length === 0){
        return;
    }

    const requestBody = {
        query: `
            query {
                login(email: "${email}", password: "${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }
        `
    }

    fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if(res.status !== 200 && res.status !== 201){
            throw new Error('failed')
        }
        return res.json()
    }).then(resData => {
        if(resData.data.login.token){
            this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
        }
    })
        .catch(err => {
            console.log(err)
        })
  };

  render() {
      
    return (
      <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
        <Form.Item>
          
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
              ref={this.emailEl}
              name='email'
            />
        </Form.Item>
        <Form.Item>
          
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              ref={this.passwordEl}
              name='password'
            />
        </Form.Item>
        <Form.Item>
          <Checkbox>Remember me</Checkbox>
          <div style={{float: 'right'}} >
            Forgot password
          </div>
          <Button type="primary" htmlType="submit" style={{width: '100%'}}>
            Log in
          </Button>
          Or register now!
        </Form.Item>
      </Form>
    );
  }
}