const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { shuffle } = require('./utils');

const port = process.env.PORT || 8080;
let cardDeck = require('./deck.json')?.deck;

const userLimit = 2;

let gameCards = [];
const players = {};

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('play', function (data) {
    // if (Object.keys(players).length >= userLimit) {
    //   console.log('User limit reached. Cannot accept more connections.');
    //   socket.disconnect(true); // Disconnect the new user
    //   return;
    // }
    // console.log('on', data);
    const playerId = data.playerId;
    console.log(playerId);

    if (players.hasOwnProperty(playerId)) {
      players[playerId].socket = socket.id;
      console.log('user exists');
    } else {
      if (Object.keys(players).length >= userLimit) {
        console.log('User limit reached. Cannot accept more connections.');
        socket.disconnect(true); // Disconnect the new user
        return;
      }
      console.log('user does not exist');
      console.log(Object.keys(players));
      players[playerId] = {
        name: '1',
        socket: socket.id,
        cards: [],
      };
    }

    if (
      players[playerId].cards.length === 0 &&
      Object.keys(players).length == userLimit
    ) {
      gameCards = shuffle(cardDeck);

      for (const playerId in players) {
        if (players.hasOwnProperty(playerId)) {
          for (let i = 0; i < 7; i++) {
            if (gameCards.length > 0) {
              const card = gameCards.pop();
              players[playerId].cards.push(card);
            }
          }
        }
      }

    }
    io.emit('cardsDealt', players);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
    if (Object.keys(players).length == 0) return;
    // for (const playerId in players) {
    //     players[playerId].cards = [];
    //   if (players[playerId].socket == socket.id) {
    //     // delete players[playerId];
    //   }
    // }
    console.log('gamecards ', gameCards.length);
    gameCards = shuffle([...cardDeck]);
  });
});

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
