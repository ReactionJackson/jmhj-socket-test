import React, { useState, useEffect } from 'react'

const MouseTest = ({ socket, uid }) => {

  const [ dots, setDots ] = useState([])
  const [ canMove, setCanMove ] = useState(false)

  const moveDot = e => {
    if(document.hasFocus() && canMove) {
      socket.emit('move_dot', {
        uid: socket.id,
        pos: { x: e.clientX, y: e.clientY },
      })
    }
  }

  const toggleCanMove = () => setCanMove(!canMove)

  useEffect(() => {

    if(socket) {

      socket.on('add_dot', dot => {
        setDots(prevDots => ([ ...prevDots, dot ]))
      })

      socket.on('update_dots', setDots)

      window.addEventListener('mousemove', moveDot)
      window.addEventListener('click', toggleCanMove)
    }

    return () => {
      window.removeEventListener('mousemove', moveDot)
      window.removeEventListener('click', toggleCanMove)
    }

  }, [ socket, moveDot, toggleCanMove ])

  return (
    <div>
      { dots.map(({ uid, pos, color }) => (
        <div
          key={ uid }
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: color
          }}
        />
      )) }
    </div>
  )
}

export default MouseTest
