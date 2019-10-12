const db = require('../data/db');
const { Player } = require('../data/db');
const { NotFoundError, BadRequest } = require('../errors.js');

module.exports = {
    queries: {
        allPlayers: () => {
            return new Promise((resolve, reject) => {
                Player.find({}, (err, players) => {
                    if(err) { reject(new NotFoundError()); }
                    resolve(players);
                });
            });
        },
        player: (parent, args) => {
            return new Promise((resolve, reject) => {
                Player.findById(args.id, (err, player) => {
                    if(err) { reject(new NotFoundError()); }
                    else if (!player) { reject(new NotFoundError()); }
                    resolve(player);
                });
            });
        }
    },
    mutations: {
        createPlayer: (parent, args) => {
            let player = new Player({
                name: args.input.name
            });
            return new Promise((resolve, reject) => {
                Player.create(player, (err, player) => {
                    if(err) { reject(new BadRequest()); }
                    resolve(player);
                });
            });
        },
        updatePlayer: (parent, args, context) => {
            return new Promise((resolve, reject) => {
                Player.findOneAndUpdate({ "_id": args.id }, { "name": args.name }, (err, player) => {
                    if(err) { reject(new BadRequest()); }
                    else if (!player) { reject(new BadRequest()); }
                    resolve(player)
                })
            });
        },
        removePlayer: (parent, args) => {
            return new Promise((resolve, reject) => {
                Player.findByIdAndDelete(args.id, (err, player) => {
                    if(err) { reject(new BadRequest()); }
                    else if (!player) { reject(new BadRequest()); }
                    resolve(true);
                });
            });
        }
    }
}
