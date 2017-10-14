const io = require('socket.io')(8000)

const CELL_SIZE = 30

const LEFT = 0
const RIGHT = 1
const UP = 2
const DOWN = 3

const state = {
    matrix: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    players: {}
}

io.on('connection', function (socket) {
    console.log(`socket with id ${socket.id} has connected`)
    state.players[socket.id] = {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        dir: RIGHT,
        rekt: false,
        input: {
            LEFT_ARROW: false,
            RIGHT_ARROW: false,
            UP_ARROW: false,
            DOWN_ARROW: false
        }
    }

    socket.on('input', function (input) {
        const player = state.players[socket.id]
        player.input = input
    })
})

function logic () {
    for (let playerId in state.players) {
        const player = state.players[playerId]
        if (player.input.LEFT_ARROW) player.dir = LEFT
        if (player.input.RIGHT_ARROW) player.dir = RIGHT
        if (player.input.UP_ARROW) player.dir = UP
        if (player.input.DOWN_ARROW) player.dir = DOWN

        if (!player.rekt) {
            switch (player.dir) {
                case LEFT: player.x--; break
                case RIGHT: player.x++; break
                case UP: player.y--; break
                case DOWN: player.y++; break
            }

            const cell = (state.matrix[player.y] || {})[player.x]
            if (cell !== 0) {
                player.rekt = true
            } else {
                state.matrix[player.y][player.x] = 1
            }
        }
    }
    io.sockets.emit('state', state)
}

setInterval(logic, 500)