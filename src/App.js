import './App.css';
import React from 'react';
import Chat from './components/Chat';
import UserChat from './components/UserChat';
import Login from './components/Login';
import PrivateRoute from "./components/PrivateRoute" 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from "./authContext"
import 'emoji-mart/css/emoji-mart.css'

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute path="/users/:senderId/:userId" component={UserChat} />
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
