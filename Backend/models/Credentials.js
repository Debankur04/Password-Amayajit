const mongoose = require('mongoose');

const CredentialsSchema = new mongoose.Schema({
  parentid: {
    type: String,
  },
  url: {
    type: String,
    required: true
  },
  username: {
    type: String,
  },
  password: {
    type: String
  }
});





const CredentialsModel = mongoose.model('Credentials', CredentialsSchema);
module.exports = CredentialsModel;