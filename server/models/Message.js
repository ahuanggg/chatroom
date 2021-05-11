const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const _ = require('underscore');

let MessageModel = {};

const convertID = mongoose.Types.ObjectId;

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.statics.toAPI = (doc) => ({
  message: doc.message,
});

// maybe have a function where it will save all the chat from
// before and paste it here but dont know how I would implement it

MessageSchema.statics.findAllMessage = (callback) => MessageModel.find().select().lean().exec(callback);

MessageModel = mongoose.model('message', MessageSchema);

module.exports.MessageModel = MessageModel;
module.exports.MessageSchema = MessageSchema;
