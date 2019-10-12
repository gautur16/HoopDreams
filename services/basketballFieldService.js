
var request = require('request');

var data = request.get('https://basketball-fields.herokuapp.com/api/basketball-fields', {json: true}, (err, res, body) => {
  if(err) { return console.log(err); }
  return body;
});

const findById = (id) => {
    return data.response.body.find(s => s.id === id);
}

module.exports = {
  basketballFields: data,
  findById
};
