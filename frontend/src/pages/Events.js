import React, { Component } from 'react';
import CreateEvent from '../components/Events/CreateEvent';
import ListEvents from '../components/Events/ListEvents';
import AuthContext from '../context/auth-context';

import { PageHeader} from 'antd';


export default class Events extends Component {
    
    state = { fetch: false };

    handleFetch = (f) =>{
        this.setState({
            fetch: f
        })
    }

    static contextType = AuthContext;

    render() {
        console.log('fetch : ', this.state.fetch)
        return (
            <PageHeader
                title="Events"
                subTitle="List of All Events"
                extra={[
                    this.context.token && <CreateEvent key={1} fetchData={this.handleFetch}/>,
                ]}>
                <ListEvents sendFetch={this.state.fetch} fetchData={this.handleFetch}/>

            </PageHeader>
        )
    }
}
