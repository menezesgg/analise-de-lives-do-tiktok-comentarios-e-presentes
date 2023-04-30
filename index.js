const express = require('express')
const app = express()

// Define rota para servir arquivos estáticos
app.use(express.static('public'))

// Rota para a página inicial
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

// Inicia o servidor na porta 3000
const server = app.listen(3000, function() {
  console.log('Servidor rodando em http://localhost:3000')
})

// Cria um socket.io para o servidor
const io = require('socket.io')(server)

// Importa a biblioteca para conexão com o TikTok
const { WebcastPushConnection } = require('tiktok-live-connector');

// Nome do usuário que está transmitindo ao vivo
let tiktokUsername = "popol977";

// Cria uma nova conexão e passa o nome do usuário
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

// Conecta ao chat
tiktokLiveConnection.connect().then(state => {
  console.info(`Conectado à sala com ID ${state.roomId}`);
}).catch(err => {
  console.error('Falha ao conectar', err);
})

// Define os eventos a serem tratados na conexão
tiktokLiveConnection.on('chat', data => {
  console.log(`${data.uniqueId} (userId:${data.userId}) escreve: ${data.comment}`);

  // Emite o evento de comentário para a página HTML
  io.emit('comment', data)
})

tiktokLiveConnection.on('gift', data => {
  console.log(`${data.uniqueId} (userId:${data.userId}) envia presente ${data.giftId}`);

  // Emite o evento de presente para a página HTML
  io.emit('gift', data)
})
