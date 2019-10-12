const basketballFieldResolver = require('./basketballFieldResolver');
const playerResolver = require('./playerResolver');
const pickupGameResolver = require('./pickupGameResolver');
const moment = require('moment');
const { GraphQLScalarType } = require('graphql');

module.exports = {
    Query: {
        ...basketballFieldResolver.queries,
        ...playerResolver.queries,
        ...pickupGameResolver.queries
    },
    Mutation: {
        ...playerResolver.mutations,
        ...pickupGameResolver.mutations
    },
    Moment: new GraphQLScalarType({
        name: 'Moment',
        description: 'Provides the Icelandic locale in the llll format',
        parseValue: (value) => { return value; },
        parseLiteral: (value) => { return value; },
        serialize: (value) => {
            return moment(value).locale('is').format('llll');
        }
    })
}
