const { send } = require('node:process');

const handleMessage = (e) => {
	e.preventDefault();

	// $('#domoMessage').animate({ window: 'hide' }, 350);

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

const MessageBox = (props) => {
	return (
		<form id='messageBox' onSubmit={handleMessage} name='messageBox' action='/chat' method='POST' className='messageBox'>
			<label htmlFor='message'>Message: </label>
			<input id='message' type='text' name='message' placeholder='Your message here!' />
			<input type='hidden' name='_csrf' value={props.csrf} />
			<input className='messageBoxSubmit' type='submit' value='Send Message' />
		</form>
	);
};

const ChatBox = (props) => {
	return <textarea type='text' id='chatTextArea' placeholder='This is where the messages will be displayed'></textarea>;
};

const setup = function (csrf) {
	ReactDOM.render(<ChatBox />, document.querySelector('#chat'));
	ReactDOM.render(<MessageBox csrf={csrf} />, document.querySelector('#messageBox'));

	// loadMessageFromServer();
};

// function to send message
const sendMessage = function () {
	console.log('sendmesage()');
	sendAjax('GET', '/getMessages', null, (data) => {
		console.log('successful');
		ReactDOM.render(<ChatBox messages={data.messages} />, document.querySelector('#chat'));
	});
};

// function to load previous messages
const loadMessageFromServer = function () {};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
