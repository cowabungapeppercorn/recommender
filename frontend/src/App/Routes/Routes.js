import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home/Home';
import Songs from './Songs/Songs';
import Albums from './Albums/Albums';
import Artists from './Artists/Artists';
import LoginRegisterForm from './LoginRegisterForm/LoginRegisterForm';
import UserProfile from './UserProfile/UserProfile';

function Routes(props) {
  return (
    <Switch>

      <Route exact path='/' render={() => <Home />} />

      <Route exact path='/songs' render={props => <Songs {...props} />} />

      <Route exact path='/albums' render={props => <Albums {...props} />} />

      <Route exact path='/artists' render={props => <Artists {...props} />} />

      <Route exact path='/profile' render={props => <UserProfile {...props} />} />

      <Route exact path='/auth' render={props => 
        <LoginRegisterForm {...props} />} 
      />

      <Redirect to='/' />

    </Switch>
  )
}

export default Routes;