const _db = require('../services/basketballFieldService');

module.exports = {
    queries: {
        allBasketballFields: () => {
            return _db.basketballFields_Db.response.body;
        },
        basketballField: (parent, args) => {
            return _db.findById(args.id);
        }
    }
};
