import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Bookings from './pages/Bookings';
import Events from './pages/Events';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Layout from './components/Lyout/MainLayout';
import AuthContext from './context/auth-context';



class App extends Component {

  state = {
    token: null,
    userId: null,
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId})
  }

  logout = () => {
    this.setState({token: null, userId: null})
  }
  render(){
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout}}>
          <Layout>
            <Switch>
              <Redirect exact from="/" to="/events" />
              {!this.state.token && <Redirect exact from="/bookings" to="/" />}
              {this.state.token && <Redirect exact from="/auth" to="/" />}
              <Route path="/events" component={Events} />
              {!this.state.token && <Route path="/auth" component={Auth} />}
              {this.state.token && <Route path="/bookings" component={Bookings} />}
              <Route path="/404" component={NotFound}/>
              <Redirect to='/404' />
            </Switch>
          </Layout>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }

  
}

export default App;
