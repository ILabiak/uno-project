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

const gameData = {
  player1: null,
  player2: null,
  players: {},
  gameCards: [],
};

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

    if (gameData.players.hasOwnProperty(playerId)) {
      gameData.players[playerId].socket = socket.id;
      console.log('user exists');
    } else {
      if (Object.keys(gameData.players).length >= userLimit) {
        console.log('User limit reached. Cannot accept more connections.');
        socket.disconnect(true); // Disconnect the new user
        return;
      }
      console.log('user does not exist');
      console.log(Object.keys(gameData.players));
      gameData.players[playerId] = {
        name: '1',
        socket: socket.id,
        cards: [],
        canMove: Object.keys(gameData.players).length == 1 ? true : false,
      };
      Object.keys(gameData.players).length == 1
        ? (gameData.player1 = playerId)
        : (gameData.player2 = playerId);
    }

    if (
      gameData.players[playerId].cards.length === 0 &&
      Object.keys(gameData.players).length == userLimit
    ) {
      gameData.gameCards = shuffle(cardDeck);

      for (const playerId in gameData.players) {
        if (gameData.players.hasOwnProperty(playerId)) {
          for (let i = 0; i < 7; i++) {
            if (gameData.gameCards.length > 0) {
              const card = gameData.gameCards.pop();
              gameData.players[playerId].cards.push(card);
            }
          }
        }
      }
    }

    socket.on('addCard', function (data) {
      const playerId = data.playerId;
      if (!gameData.players[playerId] || gameData.players[playerId]?.canMove === false)
        return;
      // console.log('user can move');
      if (gameData.gameCards.length > 0) {
        const card = gameData.gameCards.pop();
        gameData.players[playerId].cards.push(card);
        // console.log('cards', gameData.players[playerId].cards)
        for (const playerId in gameData.players) {
          gameData.players[playerId].canMove = !gameData.players[playerId].canMove
        }
        io.emit('cardAdded', gameData);

      }
    });

    io.emit('cardsDealt', gameData);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
    // if (Object.keys(gameData.players).length == 0) return;
    // console.log('gamecards ', gameData.gameCards.length);
  });
});

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
