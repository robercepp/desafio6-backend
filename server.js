//librerías requeridas
const express = require('express');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const {engine} = require('express-handlebars');
const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//engine handlebars
app.engine('hbs', engine({
    defaultLayout: false
}))

//middlewares
app.set("view engine", "hbs");
app.set("views", "./views")
app.use(express.static('public'))

//servidor
const PORT = 8080
const connectServer = httpServer.listen(PORT, () => console.log(`Servidor http con WebSocket escuchando el puerto ${connectServer.address().port}`))
connectServer.on("error", error => console.log(`Error en servidor ${error}`))

//class
const Chat = require("./classes/classes.js")
const chat1 = new Chat("./chat.txt")

const productos = [
    {
        title: "Libreta de Chicas Gamer",
        price: 12.5,
        thumbnail: "https://cdn2.iconfinder.com/data/icons/cafe-46/512/reading-coffee-chill-cafe-coffee_shop-64.png"
    },
      {
        title: "Sticker de Six Fanarts",
        price: 10.5,
        thumbnail: "https://cdn4.iconfinder.com/data/icons/fox-1/512/sticker_emoji_emoticon_smiley_fox-64.png"
      },
      {
        title: "Poster de Lulu Martins",
        price: 11,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/pirate-flat/340/pirate_wanted_poster_outlaw_vintage_reward_criminal-64.png"
      }
]

//"connection" se ejecuta la primera vez que se abre una nueva conexion
io.on('connection', async(socket) => {
    console.log('Nuevo cliente conectado')
    //Envio de los mensajes al cliente que se conecto
    socket.emit('mensajes', await chat1.getAll())
    socket.emit('mensaje', await chat1.getAll())
    socket.emit('productos', productos)
    socket.emit('producto', productos)
    //Escucho los mensajes enviados por el cliente
    socket.on('new-message', async(data) => {
        await chat1.save(data)
        io.sockets.emit('mensaje', await chat1.getAll())
    })
    socket.on('new-producto', data => {
        productos.push(data)
        io.sockets.emit('producto', productos)
    })
})

app.get('/', async(req, res) =>{
    res.render('main', {titulo: 'Engine Handlebars con Websocket', lista: productos, mensajes: chat1.getAll()})
})

