const models = require('../models');

const { Message } = models;

const chatPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

const sendMessage = (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'Cannot send empty message' });
  }

  console.log('inside send message');

  const messageData = {
    message: req.body.message,
    type: req.body.type,
    owner: req.session.account._id,
  };

  const newMessage = new Message.MessageModel(messageData);

  const messagePromise = newMessage.save();

  messagePromise.then(() => res.json({ redirect: '/chat' }));

  messagePromise.catch((err) => {
    // console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Message already exist' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return messagePromise;
};

const getMessages = (request, response) => {
  const req = request;
  const res = response;

  return Message.MessageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      // console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ messages: docs });
  });
};

module.exports = {
  sendMessage,
  getMessages,
  chatPage,
};
