const models = require('../models');

const { Message } = models;

const chatPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

const sendMessage = (req, res) => {
	// console.log('inside send message top');
	if (!req.body.message) {
		return res.status(400).json({ error: 'Cannot send empty message' });
	}

	// console.log('inside send message');
	console.log(req.body);

	const messageData = {
		message: req.body.message,
		owner: req.body.owner,
		type: req.body.type,
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

	return Message.MessageModel.findAllMessage((err, docs) => {
		if (err) {
			// console.log(err);
			return res.status(400).json({ error: 'An error occurred' });
		}

		// console.log(docs);

		return res.json({ messages: docs });
	});
};

module.exports = {
	sendMessage,
	getMessages,
	chatPage,
};
