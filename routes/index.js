const api = require('express')();

const { getAverage, route } = require('../utils/helper');
const result = [0, 20, 80, 10, 80, 90];

api.get("/", (req, res) => res.render("index", { result, average: getAverage(result) }));
api.use('/auth', route('account'))
api.use('/', route('user'))

module.exports = api