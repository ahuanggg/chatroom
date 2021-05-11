"use strict";

// const { signup } = require('../../server/controllers/Account');
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($('#user').val() == '' || $('#pass').val() == '') {
    // $('#errorMessage').css('display', 'inline');
    // handleError('Username or password is empty');
    $('#user').attr('placeholder', 'Username cannot be empty! ೕ(Ò⺫ Ó )೨ ');
    $('#pass').attr('placeholder', 'Password cannot be empty! ೕ(Ò⺫ Ó )೨ ');
    $('#user').addClass('is-danger');
    $('#pass').addClass('is-danger');
    $('#user').val('');
    $('#pass').val('');
    return false;
  } // console.log($('input[name=_csrf]').val());
  // console.log($('#user').val());


  var username = $('#user').val();
  localStorage.setItem('username', username);
  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    // handleError('All fields are required');
    $('#user').attr('placeholder', 'Username cannot be empty! ೕ(Ò⺫ Ó )೨ ');
    $('#pass').attr('placeholder', 'Password cannot be empty! ೕ(Ò⺫ Ó )೨ ');
    $('#pass2').attr('placeholder', 'Password cannot be empty! ೕ(Ò⺫ Ó )೨ ');
    $('#user').addClass('is-danger');
    $('#pass').addClass('is-danger');
    $('#pass2').addClass('is-danger');
    $('#user').val('');
    $('#pass').val('');
    $('#pass2').val('');
    return false;
  }

  if ($('#pass').val() !== $('#pass2').val()) {
    // handleError('Passwords do not match');
    $('#pass').attr('placeholder', 'Passwords do not match! ೕ(Ò⺫ Ó )೨ ');
    $('#pass2').attr('placeholder', 'Passwords do not match! ೕ(Ò⺫ Ó )೨ ');
    $('#pass').addClass('is-danger');
    $('#pass2').addClass('is-danger');
    $('#pass').val('');
    $('#pass2').val('');
    return false;
  }

  var username = $('#user').val();
  localStorage.setItem('username', username);
  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container is-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "form mainForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label",
    htmlFor: "username"
  }, "Username:"), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    id: "user",
    type: "text",
    name: "username",
    placeholder: "type in your username! ( \u141B )\u0648"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label",
    htmlFor: "pass"
  }, "Password:"), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "shhh make sure no one is looking (\u2283\u203F\u2282)"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("input", {
    className: "button is-dark is-rounded is-pulled-right formSubmit",
    type: "submit",
    value: "Sign in"
  }))));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container is-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "form mainForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label",
    htmlFor: "username"
  }, "Username:"), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    id: "user",
    type: "text",
    name: "username",
    placeholder: "has to be unique! ( \u141B )\u0648"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label",
    htmlFor: "pass"
  }, "New password:"), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "something secretive (\u2299\u2026\u2299 )"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label",
    htmlFor: "pass2"
  }, "Retype your password:"), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "type it again (\u2299\u2026\u2299 )"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("input", {
    className: "button is-dark is-rounded formSubmit is-pulled-right",
    type: "submit",
    value: "Sign Up"
  }))));
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector('#loginButton');
  var signupButton = document.querySelector('#signupButton');
  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  createLoginWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  console.log(message);
  $('article').css('display', 'block');
  $('#errorMessage').text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  // console.log('sendAJAX not wokring');
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
    }
  });
}; // const sendPOSTAjax = (type, action, data, success) => {
// 	console.log('sendPOSTAJAX not wokring');
// 	$.ajax({
// 		cache: false,
// 		type: type,
// 		url: action,
// 		data: data,
// 		dataType: 'json',
// 		success: success,
// 		error: function (xhr, status, error) {
// 			var messageObj = JSON.parse(xhr.responseText);
// 			console.log(messageObj.error);
// 			handleError(messageObj.error);
// 		},
// 	});
// };
