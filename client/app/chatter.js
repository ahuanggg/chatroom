// const { send } = require('node:process');

// everything is sent and displays properly
// i things to do
// - make it look better ***
// - make a password change ***
// - make the username display when message is sent *
// - make sure no bad words

//pass in username thru a hidden form?

const handleMessage = (e) => {
	e.preventDefault();

	if ($('#message').val() == '') {
		console.log('error');
		handleError('Message box cannot be empty');
		return false;
	}

	console.log($('#messageBox').serialize());
	const csrf = document.querySelector("input[name='_csrf']").value;
	const message = document.querySelector('#message').value;
	const owner = localStorage.getItem('username');
	const body = `_csrf=${csrf}&message=${message}&owner=${owner}`;
	console.log(body);

	sendAjax('POST', '/chat', body, function () {
		// console.log('sendmessage()');
		loadMessage();
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

const ChatBox = function (props) {
	// console.log(props);
	if (props.messages.length === 0) {
		return (
			<div className='messageList'>
				<h3 className='emptyChat'>No messages yet</h3>
			</div>
		);
	}

	const messageNodes = props.messages.map(function (message) {
		// console.log(message);
		return (
			<div key={message._id} className='messages'>
				<text className='actualMessage'>
					{message.owner}: {message.message}
				</text>
			</div>
		);
	});

	return <div className='messageList'>{messageNodes}</div>;
};

const setup = function (csrf) {
	ReactDOM.render(<ChatBox messages={[]} />, document.querySelector('#chat'));
	ReactDOM.render(<MessageBox csrf={csrf} />, document.querySelector('#messageBox'));

	loadMessage();
};

// function to get back all messages
const loadMessage = function () {
	// console.log('sendmesage()');
	sendAjax('GET', '/getMessages', null, (data) => {
		console.log('successful');
		//data is all the messages from the database from the same person
		// console.log(data.messages[0]._id);
		// console.log(data.messages.length);

		ReactDOM.render(<ChatBox messages={data.messages} />, document.querySelector('#chat'));
	});
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
