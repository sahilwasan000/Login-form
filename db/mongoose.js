const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const db = mongoose.connect('mongodb://localhost:27017/Node-Form', { useNewUrlParser: true });

module.exports = {mongoose};
