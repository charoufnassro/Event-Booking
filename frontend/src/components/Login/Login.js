import React , { Component } from 'react';
import { Modal, Icon } from 'antd';

export default class Login extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <div className="auth" style={{width: 100, textAlign: 'right'}} onClick={this.showModal}>
            Login
            <Icon type="login" style={{margin: '0 .5em'}}/>
        </div>
        <Modal
          title="Authantification"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}