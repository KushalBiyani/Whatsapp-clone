import './App.css';
import React from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Login from './components/Login';
import PrivateRoute from "./components/PrivateRoute"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from "./authContext"

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute path="/rooms/:roomId" component={Chat} />
            <PrivateRoute exact path="/" component={Chat} />
            <Route path="/login" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
