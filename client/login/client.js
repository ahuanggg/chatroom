// const { signup } = require('../../server/controllers/Account');

const handleLogin = (e) => {
	e.preventDefault();

	if ($('#user').val() == '' || $('#pass').val() == '') {
		$('#errorMessage').css('display', 'inline');
		handleError('Username or password is empty');
		return false;
	}

	// console.log($('input[name=_csrf]').val());
	// console.log($('#user').val());
	var username = $('#user').val();
	localStorage.setItem('username', username);

	sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

	return false;
};

const handleSignup = (e) => {
	e.preventDefault();

	if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
		handleError('All fields are required');
		return false;
	}

	if ($('#pass').val() !== $('#pass2').val()) {
		handleError('Passwords do not match');
		return false;
	}

	sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

	return false;
};

const LoginWindow = (props) => {
	return (
		<div className='container is-fluid'>
			<form id='loginForm' name='loginForm' onSubmit={handleLogin} action='/login' method='POST' className='form mainForm'>
				<div className='field'>
					<label className='label' htmlFor='username'>
						Username:
					</label>
					<div className='control'>
						<input className='input' id='user' type='text' name='username' placeholder='username' />
					</div>
				</div>
				<div className='field'>
					<label className='label' htmlFor='pass'>
						Password:
					</label>
					<div className='control'>
						<input className='input' id='pass' type='password' name='pass' placeholder='password' />
					</div>
					<input type='hidden' name='_csrf' value={props.csrf} />
				</div>
				<div className='field is-dark is-rounded'>
					<input className='button formSubmit' type='submit' value='Sign in' />
				</div>
			</form>
		</div>
	);
};

const SignupWindow = (props) => {
	return (
		<form id='signupForm' name='signupForm' onSubmit={handleSignup} action='/signup' method='POST' className='mainForm'>
			<label htmlFor='username'>Username:</label>
			<input id='user' type='text' name='username' placeholder='username' />
			<label htmlFor='pass'>Password: </label>
			<input id='pass' type='password' name='pass' placeholder='password' />
			<label htmlFor='pass2'>Password: </label>
			<input id='pass2' type='password' name='pass2' placeholder='retype password' />
			<input type='hidden' name='_csrf' value={props.csrf} />
			<input className='formSubmit' type='submit' value='Sign Up' />
		</form>
	);
};

const createLoginWindow = (csrf) => {
	ReactDOM.render(<LoginWindow csrf={csrf} />, document.querySelector('#content'));
};

const createSignupWindow = (csrf) => {
	ReactDOM.render(<SignupWindow csrf={csrf} />, document.querySelector('#content'));
};

const setup = (csrf) => {
	const loginButton = document.querySelector('#loginButton');
	const signupButton = document.querySelector('#signupButton');

	signupButton.addEventListener('click', (e) => {
		e.preventDefault();
		createSignupWindow(csrf);
		return false;
	});

	loginButton.addEventListener('click', (e) => {
		e.preventDefault();
		createLoginWindow(csrf);
		return false;
	});

	createLoginWindow(csrf);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
