'use strict';

// var _require = require('node:process'),
//     send = _require.send;

var handleMessage = function handleMessage(e) {
	e.preventDefault(); // $('#domoMessage').animate({ window: 'hide' }, 350);

	if ($('#message').val() == '') {
		console.log('error');
		handleError('Message box cannot be empty');
		return false;
	}

	console.log('inside handle message');
	sendAjax('POST', $('#messageBox').attr('action'), $('#messageBox').serialize(), function () {
		// console.log('sendmessage()');
		sendMessage();
	});
	return false;
};

var MessageBox = function MessageBox(props) {
	return /*#__PURE__*/ React.createElement(
		'form',
		{
			id: 'messageBox',
			onSubmit: handleMessage,
			name: 'messageBox',
			action: '/chat',
			method: 'POST',
			className: 'messageBox',
		},
		/*#__PURE__*/ React.createElement(
			'label',
			{
				htmlFor: 'message',
			},
			'Message: '
		),
		/*#__PURE__*/ React.createElement('input', {
			id: 'message',
			type: 'text',
			name: 'message',
			placeholder: 'Your message here!',
		}),
		/*#__PURE__*/ React.createElement('input', {
			type: 'hidden',
			name: '_csrf',
			value: props.csrf,
		}),
		/*#__PURE__*/ React.createElement('input', {
			className: 'messageBoxSubmit',
			type: 'submit',
			value: 'Send Message',
		})
	);
};

var ChatBox = function ChatBox(props) {
	return /*#__PURE__*/ React.createElement('textarea', {
		type: 'text',
		id: 'chatTextArea',
		placeholder: 'This is where the messages will be displayed',
	});
};

var setup = function setup(csrf) {
	ReactDOM.render(/*#__PURE__*/ React.createElement(ChatBox, null), document.querySelector('#chat'));
	ReactDOM.render(
		/*#__PURE__*/ React.createElement(MessageBox, {
			csrf: csrf,
		}),
		document.querySelector('#messageBox')
	); // loadMessageFromServer();
}; // function to send message

var sendMessage = function sendMessage() {
	console.log('sendmesage()');
	sendAjax('GET', '/getMessages', null, function (data) {
		console.log('successful');
		ReactDOM.render(
			/*#__PURE__*/ React.createElement(ChatBox, {
				messages: data.messages,
			}),
			document.querySelector('#chat')
		);
	});
}; // function to load previous messages

var loadMessageFromServer = function loadMessageFromServer() {};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
('use strict');

var handleError = function handleError(message) {
	console.log(message);
	$('#errorMessage').text(message);
};

var redirect = function redirect(response) {
	window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
	console.log('sendAJAX not wokring');
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: 'json',
		success: success,
		error: function error(xhr, status, _error) {
			var messageObj = JSON.parse(xhr.responseText);
			console.log(messageObj.error);
			handleError(messageObj.error);
		},
	});
};
