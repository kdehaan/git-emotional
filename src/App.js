import React, { Component } from 'react';
import './css/App.css';
import Sentimood from './sentiment/sentimood.js'
import SubmitPage from './screens/submitPage.js';
import StatPage from './screens/statPage.js';

import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={SubmitPage} exact={true} />
          <Route path="/stat/" component={StatPage} exact={true} />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;