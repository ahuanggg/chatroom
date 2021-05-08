"use strict";

// const { send } = require('node:process');
// everything is sent and displays properly
// i things to do
// - make it look better ***
// - make a password change ***
// - make the username display when message is sent *
// - make sure no bad words
//pass in username thru a hidden form?
var handleMessage = function handleMessage(e) {
  e.preventDefault();

  if ($('#message').val() == '') {
    console.log('error');
    handleError('Message box cannot be empty');
    return false;
  }

  console.log($('#messageBox').serialize());
  var csrf = document.querySelector("input[name='_csrf']").value;
  var message = document.querySelector('#message').value;
  var owner = localStorage.getItem('username');
  var body = "_csrf=".concat(csrf, "&message=").concat(message, "&owner=").concat(owner);
  console.log(body);
  sendAjax('POST', '/chat', body, function () {
    // console.log('sendmessage()');
    loadMessage();
  });
  return false;
};

var MessageBox = function MessageBox(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "messageBox",
    onSubmit: handleMessage,
    name: "messageBox",
    action: "/chat",
    method: "POST",
    className: "messageBox"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "message"
  }, "Message: "), /*#__PURE__*/React.createElement("input", {
    id: "message",
    type: "text",
    name: "message",
    placeholder: "Your message here!"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "messageBoxSubmit",
    type: "submit",
    value: "Send Message"
  }));
};

var ChatBox = function ChatBox(props) {
  // console.log(props);
  if (props.messages.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "messageList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyChat"
    }, "No messages yet"));
  }

  var messageNodes = props.messages.map(function (message) {
    // console.log(message);
    return /*#__PURE__*/React.createElement("div", {
      key: message._id,
      className: "messages"
    }, /*#__PURE__*/React.createElement("text", {
      className: "actualMessage"
    }, message.owner, ": ", message.message));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "messageList"
  }, messageNodes);
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChatBox, {
    messages: []
  }), document.querySelector('#chat'));
  ReactDOM.render( /*#__PURE__*/React.createElement(MessageBox, {
    csrf: csrf
  }), document.querySelector('#messageBox'));
  loadMessage();
}; // function to get back all messages


var loadMessage = function loadMessage() {
  // console.log('sendmesage()');
  sendAjax('GET', '/getMessages', null, function (data) {
    console.log('successful'); //data is all the messages from the database from the same person
    // console.log(data.messages[0]._id);
    // console.log(data.messages.length);

    ReactDOM.render( /*#__PURE__*/React.createElement(ChatBox, {
      messages: data.messages
    }), document.querySelector('#chat'));
  });
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
