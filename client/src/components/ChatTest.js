import React, { useState, useEffect } from 'react'

const ChatTest = ({ socket }) => {

  const [ messages, setMessages ] = useState([])
  const [ msg, setMsg ] = useState('')
  const [ pos, setPos ] = useState({ x: 0, y: 0 })
  const [ isMaster, setIsMaster ] = useState(false)
  const [ currentColor, setCurrentColor ] = useState({})

  const colors = ['dodgerblue', 'tomato', 'mediumseagreen']

  const handleColorChange = color => {
    socket.emit('change color', color)
  }

  const handleSubmit = e => {
    e.preventDefault()
    socket.emit('chat message', msg)
    setMsg('')
  }

  const handleChange = e => {
    setMsg(e.target.value)
  }

  const moveBox = e => {
    switch(e.keyCode) {
      case 87: //up
        socket.emit('move box', { x: 0, y: -1 })
      break
      case 83: //down
        socket.emit('move box', { x: 0, y: 1 })
      break
      case 65: //left
        socket.emit('move box', { x: -1, y: 0 })
      break
      case 68: //right
        socket.emit('move box', { x: 1, y: 0 })
      break
    }
  }

  useEffect(() => {
    if(socket) {

      socket.on('chat message', newMsg => {
        setMessages(prevMessages => ([ ...prevMessages, newMsg ]))
      })

      socket.on('move box', pos => {
        setPos(pos)
      })

      socket.on('set master', master => {
        setIsMaster(master)
      })

      socket.on('change color', color => {
        setCurrentColor(color)
      })

      window.addEventListener('keyup', moveBox)
    }

    return () => {
      window.removeEventListener('keyup', moveBox)
    }

  }, [ socket ])

  return (
    <div>
      <ul id="messages">
        { messages.map((msg, i) => <li style={{ ...currentColor }} key={ i }>{ msg }</li>) }
      </ul>
      <div className={`master ${ !isMaster ? 'minion' : '' }`}>{ isMaster ? 'K' : 'M' }</div>
      {
        isMaster ? (
          <ul id="colors">
            { colors.map((color, i) => (
              <li
                key={ i }
                style={{ background: color }}
                onClick={ _ => { handleColorChange(color) } }
              />
            )) }
          </ul>
        ) : null
      }
      <div id="someBox" style={{ left: pos.x * 50, top: (pos.y * 50) + 30 }}></div>
      <pre>
        { JSON.stringify(pos, null, 2) }
      </pre>
      <form onSubmit={ e => handleSubmit(e) }>
        <input
          type="text"
          value={ msg }
          onChange={ e => handleChange(e) }
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default ChatTest
