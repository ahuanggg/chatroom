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

	$('#message').removeClass('is-danger');
	$('#message').attr('placeholder', 'Your message here! ʕ •́؈•̀ ₎');

	if ($('#message').val() == '') {
		console.log('error message cannot be empty');
		// make the messagebox red when empty
		$('#message').addClass('is-danger');
		$('#message').attr('placeholder', 'message cannot be empty! ೕ(Ò⺫ Ó )೨ ');
		$('#message').val('');
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

	$('#message').val('');

	return false;
};

const MessageBox = (props) => {
	return (
		<div className='container is-fluid' id='message-form'>
			<form id='messageBox' onSubmit={handleMessage} name='messageBox' action='/chat' method='POST' className='form messageBox'>
				<div className='field'>
					<label className='label' htmlFor='message'>
						Message:
					</label>
					<div className='control'>
						<input className='input' id='message' type='text' name='message' placeholder='Your message here! ʕ •́؈•̀ ₎' />
					</div>
					<input type='hidden' name='_csrf' value={props.csrf} />
				</div>
				<div className='field'>
					<span id='message-info' className='has-text-right is-size-6 has-text-grey-light '>
						press the chat tab to check for new messages!
					</span>
				</div>
				<div className='field'>
					<input className='button is-link is-rounded is-pulled-right messageBoxSubmit' type='submit' value='Send Message' />
				</div>
			</form>
		</div>
	);
};

const ChatBox = function (props) {
	// console.log(props);
	if (props.messages.length === 0) {
		return false;
	}

	const owner = localStorage.getItem('username');

	const messageNodes = props.messages.map(function (message) {
		if (message.owner === owner) {
			return (
				<article key={message._id} className='message is-success'>
					<div className='message-header header-right'>
						<p className='has-text-right'>{message.owner}</p>
					</div>
					<div className='message-body'>
						<p className='has-text-right'>{message.message}</p>
					</div>
				</article>
			);
		}
		// console.log(message);
		else {
			return (
				// <p key={message._id}>
				// 	{message.owner}: {message.message}
				// </p>

				<article key={message._id} className='message is-info'>
					<div className='message-header'>
						<p className='has-text-left'>{message.owner}</p>
					</div>
					<div className='message-body'>
						<p className='has-text-left'>{message.message}</p>
					</div>
				</article>
			);
		}
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

	// $('#chat').scrollTop($('#chat')[0].scrollHeight);
	$('#chat').scrollTop($('#chat')[0].scrollHeight - $('#chat')[0].clientHeight);
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
	setInterval(function () {
		console.log('doing it');
		loadMessage();
	}, 30000);
};

const handlePassword = (e) => {
	e.preventDefault();

	if ($('#changepass').val() == '' || $('#changepass2').val() == '') {
		console.log('error');
		// handleError('passwords fields cannot empty');
		$('#changepass').attr('placeholder', 'Password cannot be empty! ೕ(Ò⺫ Ó )೨ ');
		$('#changepass2').attr('placeholder', 'Password cannot be empty! ೕ(Ò⺫ Ó )೨ ');

		$('#changepass').addClass('is-danger');
		$('#changepass2').addClass('is-danger');

		$('#changepass').val('');
		$('#changepass2').val('');
		return false;
	}

	if ($('#changepass').val() != $('#changepass2').val()) {
		console.log('error');
		// handleError('passwords do not match');
		$('#changepass').attr('placeholder', 'Passwords do not match! ೕ(Ò⺫ Ó )೨ ');
		$('#changepass2').attr('placeholder', 'Password do not match! ೕ(Ò⺫ Ó )೨ ');

		$('#changepass').addClass('is-danger');
		$('#changepass2').addClass('is-danger');

		$('#changepass').val('');
		$('#changepass2').val('');
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
		<div id='settings' className='container is-fluid'>
			<form id='passwordForm' name='passwordForm' onSubmit={handlePassword} className='form '>
				<div className='field'>
					<label htmlFor='pass'>New Password: </label>
					<div className='control'>
						<input className='input' id='changepass' type='password' name='changePass' placeholder='type your new password! (⊙…⊙ )' />
					</div>
				</div>
				<div className='field'>
					<label htmlFor='pass2'>New Password: </label>
					<div className='control'>
						<input className='input' id='changepass2' type='password' name='changePass2' placeholder='retype new password! (°∀°)ゞ' />
					</div>
					<input type='hidden' name='_csrf' value={props.csrf} />
				</div>
				<div className='field'>
					<input className='button is-dark is-rounded is-pulled-right formSubmit' type='submit' value='Change Password' />
				</div>
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
