const { PickupGame, Player } = require('../data/db');
const { NotFoundError, BadRequest, PickupGameExceedMaximumError, BasketballFieldClosedError } = require('../errors.js');
const fieldService = require('../services/basketballFieldService');

const findPlayerById = (id) => {
    return new Promise((resolve, reject) => {
        Player.findById(id, (err, player) => {
            if(err) { reject(new NotFoundError()); }
            else if (!player) { reject(new NotFoundError()); }
            resolve(player);
        });
    });
}

const playerExistsInGame = (player, playerList) => {
    playerList.forEach( (item) => {
        if(item === player) { return true; }
    });
    return false;
}

module.exports = {
    queries: {
        allPickupGames: () => {
            return new Promise((resolve, reject) => {
                PickupGame.find({}, (err, games) => {
                    if(err) { reject(new NotFoundError()); }
                    resolve(games);
                });
            });
        },
        pickupGame: (parent, args) => {
            return new Promise((resolve, reject) => {
                PickupGame.findById(args.id, (err, game) => {
                    if(err) { reject(new NotFoundError()); }
                    else if (game == null) { reject(new NotFoundError()); }

                    console.log(game);

                    let regPlayers = [];
                    game.registeredPlayers.forEach((pl) => {
                        regPlayers.push(findPlayerById(pl));
                    });

                    let viewGame = {
                        id: game.id,
                        start: game.start,
                        end: game.end,
                        location: fieldService.findById(game.location),
                        registeredPlayers: regPlayers,
                        host: findPlayerById(game.hostId)
                    }
                    resolve(viewGame);
                });
            });
        }
    },
    mutations: {
        createPickupGame: (parent, args) => {
            return new Promise((resolve, reject) => {
                let field = fieldService.findById(args.input.basketballFieldId);
                if(field == null) { reject(new BadRequest()); }
                else if (field.status == "CLOSED") { reject(new BasketballFieldClosedError()); }

                let newGamePlayers = new Array(args.input.hostId);
                let newGame = {
                    start: args.input.start.value,
                    end: args.input.end.value,
                    location: args.input.basketballFieldId,
                    registeredPlayers: newGamePlayers,
                    host: args.input.hostId
                };

                PickupGame.create(newGame, (err, game) => {
                    if(err) { reject(new BadRequest()); }

                    console.log(game);
                    resolve(game);
                });
            });
        },
        removePickupGame: (parent, args) => {
            return new Promise((resolve, reject) => {
                PickupGame.findByIdAndDelete(args.id, (err, game) => {
                    if(err) { reject(new BadRequest()); }
                    else if (!game) { reject(new BadRequest()); }
                    resolve(true);
                });
            });
        },
        addPlayerToPickupGame: (parent, args) => {
            return new Promise((resolve, reject) => {
                PickupGame.findById(args.input.pickupGameId, (err, game) => {
                    if(err) { reject(new NotFoundError()); }
                    else if (game == null) { reject(new NotFoundError()); }
                    else if (playerExistsInGame(args.input.playerId, game.registeredPlayers)) { reject(new PlayerInGameError()); }
                    else if (new Date(game.end).getTime() < new Date().getTime()) { reject(new PickupGameAlreadyPassedError()); }

                    fieldService.findById(game.location, (err, field) => {
                        if(err) { reject(new NotFoundError()); }
                        else if(game.registeredPlayers == null) { game.registeredPlayers = []; }
                        else if (game.registeredPlayers.length >= field.capacity) { reject(new PickupGameExceedMaximumError()); }
                    });

                    game.registeredPlayers.push(args.input.playerId);

                    PickupGame.findByIdAndUpdate(args.input.pickupGameId,
                        { registeredPlayers: game.registeredPlayers }, (err, game) => {
                            if(err) { reject(new BadRequest()); }
                            resolve(game);
                        });
                });
            });
        },
        removePlayerFromPickupGame: (parent, args) => {
            return new Promise((resolve, reject) => {
                PickupGame.findById(args.input.pickupGameId, (err, game) => {
                    if(err) { reject(new NotFoundError()); }
                    else if (game == null) { reject(new NotFoundError()); }
                    else if (new Date(game.end).getTime() < new Date().getTime()) { reject(new PickupGameAlreadyPassedError()); }

                    var index = game.registeredPlayers.indexOf(args.input.playerId);
                    if(index > -1) { game.registeredPlayers.splice(index, 1); }

                    PickupGame.findByIdAndUpdate(args.input.pickupGameId,
                        { registeredPlayers: game.registeredPlayers }, (err, game_2) => {
                            if(err) { reject(new BadRequest()); }
                            resolve(game_2);
                        });
                });
            });
        }
    }
};
