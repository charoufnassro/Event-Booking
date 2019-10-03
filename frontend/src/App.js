import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Bookings from './pages/Bookings';
import Events from './pages/Events';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Layout from './components/Lyout/MainLayout';



function App() {
  return (
    <BrowserRouter>
    <Layout>
      <Switch>
        <Redirect exact from="/" to="/events" />
        <Route path="/events" component={Events} />
        <Route path="/auth" component={Auth} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/404" component={NotFound}/>
        <Redirect to='/404' />
      </Switch>
    </Layout>
    </BrowserRouter>
  );
}

export default App;
