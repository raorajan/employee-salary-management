const mongoose = require('mongoose');

module.exports = function connect(uri) {
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};
