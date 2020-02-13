const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000

const colors = ['dodgerblue', 'tomato', 'mediumseagreen', 'rebeccapurple', 'gold']

let clients = []
let dots = []
let pos = { x: 0, y: 0 }

app.use(express.static(__dirname + '/client/build'));

app.get('/', (req, res) => {
  res.sendFile(`${ __dirname }/client/build/index.html`)
})

io.on('connection', socket => {

  console.log(`user ${ socket.id } conneted`)

  // on connection:

  io.to(`${ socket.id }`).emit('set_uid', socket.id)

  clients.push(socket.id)

  io.emit('update_clients', clients)

  dots.push({
    uid: socket.id,
    pos: { x: 0, y: 0 },
    color: colors[dots.length]
  })

  io.to(`${ socket.id }`).emit('add_dot', dots[socket.server.engine.clientsCount - 1])

  io.to(`${ socket.id }`).emit('move box', pos)

  if(socket.server.engine.clientsCount === 1) {
    console.log(`setting ${ socket.id } as master`)
    io.to(`${ socket.id }`).emit('set master', true)
  }

  io.emit('update total users', socket.server.engine.clientsCount)

  // handlers:

  socket.on('move_dot', ({ uid, pos }) => {
    dots = dots.map(d => d.uid === uid ? ({ ...d, pos }) : d)
    io.emit('update_dots', dots)
  })

  socket.on('chat message', msg => {
    io.emit('chat message', msg)
  })

  socket.on('change color', (bgc = '#f2f2f2', tc = '#fff') => {
    io.emit('change color', { backgroundColor: bgc, color: tc })
  })

  socket.on('disconnect', _ => {
    console.log(`user ${ socket.id } disconneted`)
    clients = clients.filter(client => client !== socket.id)
    io.emit('update_clients', clients)
    dots = dots.filter(d => d.uid !== socket.id)
    io.emit('update_dots', dots)
  })

  socket.on('move box', newPos => {
    pos = {
      x: pos.x + newPos.x,
      y: pos.y + newPos.y,
    }
    console.log('server pos', pos)
    io.emit('move box', pos)
  })

})

http.listen(port, () => {
  console.log(`listening on *:${ port }`)
})
