const playerSchema = require("../schema/mongodb/player");
const pickupGameSchema = require("../schema/mongodb/pickupGame");
const signupPlayerSchema = require("../schema/mongodb/signupPlayer");
const mongoose = require('mongoose');

var connection = mongoose.createConnection(
      "mongodb+srv://hoopdreamsdbuser:abc123...@mansiondesubastas-awvcw.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

module.exports = {
  Player: connection.model("Player", playerSchema),
  PickupGame: connection.model("PickupGame", pickupGameSchema),
  SignupPlayer: connection.model("SignupPlayer", signupPlayerSchema),
  connection
}
