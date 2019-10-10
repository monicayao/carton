import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Components 
import Navbar from './components/Navbar'

// pages 
import home from './pages/home';
import chores from './pages/chores';
import addChores from './pages/addChores';
import login from './pages/login';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#b8d9fd',
    },
    secondary: {
      main: '#ffb74d',
    }
  }
});

class App extends Component {

  render(){
      return (
        <MuiThemeProvider theme={theme}>
          <div className="App">
              <Router>
                <Navbar/>
                <div className = "container">
                  <Switch>
                    <Route exact path = '/' component = {home} />
                    <Route exact path = '/chores' component = {chores} />
                    <Route exact path = '/addChores' component = {addChores} />
                    <Route exact path = '/login' component = {login} />
                  </Switch>
                </div>
              </Router>
          </div>
        </MuiThemeProvider> 
      );
  }
}


export default App;
