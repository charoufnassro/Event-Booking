import React, { Component } from 'react';
import { List, Button, Skeleton } from 'antd';

const count = 3;

export default class ListEvents extends Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };

  componentDidMount() {
    this.getData(res => {
        
      this.setState({
        initLoading: false,
        data: res.data.events,
        list: res.data.events,
      });
    });
  }

  getData = callback => {
        const requestBody = {
            query: `
                query {
                    events{
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
        if(resData){
            callback(resData);
        }
    })
        .catch(err => {
            console.log(err)
        })
  };

  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({loading: true, name: {} }))),
    });
    this.getData(res => {
      const data = this.state.data.concat(res.data.events);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
        },
      );
    });
  };

  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>loading more</Button>
        </div>
      ) : null;

    return (
      <List
        style={{minHeight: '350px'}}
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={item => (
            
          <List.Item
            actions={["edit","more"]}
          >
            <Skeleton title={false} loading={item.loading} active>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
              <div>{item.date}</div>
            </Skeleton>
          </List.Item>
        )}
      />
    );
  }
}