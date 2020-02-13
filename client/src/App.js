import React, { useState, useEffect } from 'react'
import SocketIOClient from 'socket.io-client'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import styled from 'styled-components'
import MouseTest from './components/MouseTest'
import ChatTest from './components/ChatTest'

const port = process.env.PORT || 3000

const App = () => {

  const [ socket, setSocket ] = useState(null)
  const [ clients, setClients ] = useState([])
  const [ uid, setUid ] = useState(null)

  useEffect(() => setSocket(SocketIOClient(`https://jmhj-socket-test.herokuapp.com/${ port }`)), [])

  useEffect(() => {
    if(socket) {
      socket.on('set_uid', setUid)
      socket.on('update_clients', setClients)
    }
  }, [ socket ])

  return (
    <Router>
      <nav>
        <Menu>
          <li><Link to="/chat-test">Chat Test</Link></li>
          <li><Link to="/mouse-test">Mouse Test</Link></li>
        </Menu>
        <div>ID: { uid }</div>
        <pre>Clients: { JSON.stringify(clients, null, 2) }</pre>
      </nav>
      <Switch>
        <Route path="/chat-test">
          <ChatTest socket={ socket } uid={ uid } />
        </Route>
        <Route path="/mouse-test">
          <MouseTest socket={ socket } uid={ uid } />
        </Route>
      </Switch>
    </Router>
  )
}

const Menu = styled.ul`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 30px;
  background-color: #000;
  display: flex;
  align-items: center;
  list-style-type: none;
  li {
    margin-left: 15px;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
`

export default App
