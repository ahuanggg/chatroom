// const { send } = require('node:process');

// everything is sent and displays properly
// i things to do
// - finish the settings form
// - make it look better ***
// - make a password change ***
// - make sure no bad words

// let ws = new WebSocket('ws://localhost:2220');

// ws.addEventListener('connect', function (event) {
// 	console.log('connected');
// });

// ws.addEventListener('message', function (event) {
// 	console.log('Message from server ', event.data);
// });

const handleMessage = (e) => {
	e.preventDefault();

	if ($('#message').val() == '') {
		console.log('error');
		handleError('Message box cannot be empty');
		return false;
	}

	const csrf = document.querySelector("input[name='_csrf']").value;
	const message = document.querySelector('#message').value;
	const owner = localStorage.getItem('username');
	const body = `_csrf=${csrf}&message=${message}&owner=${owner}`;
	// console.log(body);

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

	const chatButton = document.querySelector('#chatButton');

	chatButton.addEventListener('click', (e) => {
		e.preventDefault();
		//show the message box
		document.querySelector('#messageBox').style.display = 'block';
		ReactDOM.render(<ChatBox messages={[]} />, document.querySelector('#chat'));
		ReactDOM.render(<MessageBox csrf={csrf} />, document.querySelector('#messageBox'));
		loadMessage();
		return false;
	});

	const settingsButton = document.querySelector('#settingsButton');

	settingsButton.addEventListener('click', (e) => {
		// hide the message box
		document.querySelector('#messageBox').style.display = 'none';
		e.preventDefault();
		createSettingsWindow(csrf);
		return false;
	});
};

// function to get back all messages
const loadMessage = function () {
	// console.log('sendmesage()');
	sendAjax('GET', '/getMessages', null, (data) => {
		console.log('message sent and get');
		//data is all the messages from the database from the same person
		// console.log(data.messages[0]._id);
		// console.log(data.messages.length);

		ReactDOM.render(<ChatBox messages={data.messages} />, document.querySelector('#chat'));
	});
	// ws.send('test');
	// return false;
};

const handlePassword = (e) => {
	e.preventDefault();

	if ($('#changepass').val() == '' || $('#changepass2').val() == '') {
		console.log('error');
		handleError('passwords fields cannot empty');
		return false;
	}

	if ($('#changepass').val() != $('#changepass2').val()) {
		console.log('error');
		handleError('passwords do not match');
		return false;
	}

	const csrf = document.querySelector("input[name='_csrf']").value;
	const newPassword = document.querySelector('#changepass').value;
	const newPassword2 = document.querySelector('#changepass2').value;
	const owner = localStorage.getItem('username');
	const body = `_csrf=${csrf}&password=${newPassword}&password2=${newPassword2}&owner=${owner}`;
	// console.log('logging body');
	// console.log(body);
	sendAjax('POST', '/password', body, redirect);
	return false;
};

const SettingsWindow = (props) => {
	return (
		<div id='settings'>
			<form id='passwordForm' name='passwordForm' onSubmit={handlePassword} className='passwordPartOfTheForm'>
				<label htmlFor='pass'>New Password: </label>
				<input id='changepass' type='password' name='changePass' placeholder='new password' />
				<label htmlFor='pass2'>New Password: </label>
				<input id='changepass2' type='password' name='changePass2' placeholder='retype new password' />
				<input type='hidden' name='_csrf' value={props.csrf} />
				<input className='formSubmit' type='submit' value='Change Password' />
			</form>
		</div>
	);
};

const createSettingsWindow = (csrf) => {
	ReactDOM.render(<SettingsWindow csrf={csrf} />, document.querySelector('#chat'));
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
