import React , { Component } from 'react';
import AuthContext from '../../context/auth-context';
import { Drawer, Form, Button, Col, Row, Input,InputNumber, DatePicker, Icon } from 'antd';



const { TextArea } = Input;

export default class CreateEvent extends Component {
    state = { visible: false };

    static contextType = AuthContext;

    showDrawer = () => {
        this.setState({
        visible: true,
        });
    };

    onClose = () => {
        this.setState({
        visible: false,
        });
        this.props.form.resetFields();
    };

    handeleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
              const event = {title: values.title, price: values.price, date: values.date._d.toISOString(), description: values.description};
              
              const requestBody = {
                query: `
                    mutation {
                        createEvent(eventInput: {title: "${event.title}", description: "${event.description}", price: ${event.price}, date: "${event.date}"}){
                            _id
                            title
                            description
                            price
                            date
                            creator{
                                _id
                                email
                            }
                        }
                    }
                `
            }
        
            const token = this.context.token;

            fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Charouf ' + token
                }
            }).then(res => {
                if(res.status !== 200 && res.status !== 201){
                    throw new Error('failed')
                }
                return res.json()
            }).then(resData => {
                if(resData){
                    this.props.fetchData(true);
                }
            })
                .catch(err => {
                    console.log(err)
                })
            }
        });
        this.onClose();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
        <div>
            <Button key="1" type="primary" onClick={this.showDrawer}>
                    <Icon type="plus" /> Add Event
            </Button>
            <Drawer
            title="Create a new event"
            width={500}
            onClose={this.onClose}
            visible={this.state.visible}
            >
            <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                <Col span={24}>
                    <Form.Item label="Title : ">
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: 'Please enter the title' }],
                    })(<Input placeholder="Please enter the title" />)}
                    </Form.Item>
                </Col>
                </Row>
                <Row gutter={16}>
                <Col span={24}>
                    <Form.Item label="Price : ">
                    {getFieldDecorator('price', {
                        rules: [{ required: true, message: 'Please entre the price' }],
                    })(
                        <InputNumber
                        size={'default'}
                            min={0}
                            max={10000}
                            step={0.5}
                            
                            />,
                    )}
                    </Form.Item>
                </Col>
                </Row>
                <Row gutter={16}>
                <Col span={24}>
                    <Form.Item label="Date : ">
                    {getFieldDecorator('date', {
                        rules: [{ required: true, message: 'Please select the date' }],
                    })(
                        <DatePicker showTime placeholder="Select Time" />,
                    )}
                    </Form.Item>
                </Col>
                </Row>
                <Row gutter={16}>
                <Col span={24}>
                    <Form.Item label="Description : ">
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: 'Please entre the description of event' }],
                    })(
                        <TextArea
                            onChange={this.onChange}
                            placeholder="Please entre the description of event"
                            autosize={{ minRows: 10, maxRows: 10 }}
                            />,
                    )}
                    </Form.Item>
                </Col>
                </Row>
            </Form>
            <div
                style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
                }}
            >
                <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
                </Button>
                <Button onClick={this.handeleSubmit} type="primary">
                Submit
                </Button>
            </div>
            </Drawer>
        </div>
        );
    }
}

CreateEvent = Form.create({})(CreateEvent);