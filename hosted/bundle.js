"use strict";

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
var handleMessage = function handleMessage(e) {
  e.preventDefault();
  $('#message').removeClass('is-danger');
  $('#message').attr('placeholder', 'Your message here! ʕ •́؈•̀ ₎');

  if ($('#message').val() == '') {
    console.log('error message cannot be empty'); // make the messagebox red when empty

    $('#message').addClass('is-danger');
    $('#message').attr('placeholder', 'message cannot be empty! ೕ(Ò⺫ Ó )೨ ');
    $('#message').val('');
    return false;
  }

  var csrf = document.querySelector("input[name='_csrf']").value;
  var message = document.querySelector('#message').value;
  var owner = localStorage.getItem('username');
  var body = "_csrf=".concat(csrf, "&message=").concat(message, "&owner=").concat(owner); // console.log(body);

  sendAjax('POST', '/chat', body, function () {
    // console.log('sendmessage()');
    loadMessage();
  });
  $('#message').val('');
  return false;
};

var MessageBox = function MessageBox(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container is-fluid",
    id: "message-form"
  }, /*#__PURE__*/React.createElement("form", {
    id: "messageBox",
    onSubmit: handleMessage,
    name: "messageBox",
    action: "/chat",
    method: "POST",
    className: "form messageBox"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "label",
    htmlFor: "message"
  }, "Message:"), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    id: "message",
    type: "text",
    name: "message",
    placeholder: "Your message here! \u0295 \u2022\u0301\u0608\u2022\u0300 \u208E"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("span", {
    id: "message-info",
    className: "has-text-right is-size-6 has-text-grey-light "
  }, "press the chat tab to check for new messages!")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("input", {
    className: "button is-link is-rounded is-pulled-right messageBoxSubmit",
    type: "submit",
    value: "Send Message"
  }))));
};

var ChatBox = function ChatBox(props) {
  // console.log(props);
  if (props.messages.length === 0) {
    return false;
  }

  var owner = localStorage.getItem('username');
  var messageNodes = props.messages.map(function (message) {
    if (message.owner === owner) {
      return /*#__PURE__*/React.createElement("article", {
        key: message._id,
        className: "message is-success"
      }, /*#__PURE__*/React.createElement("div", {
        className: "message-header header-right"
      }, /*#__PURE__*/React.createElement("p", {
        className: "has-text-right"
      }, message.owner)), /*#__PURE__*/React.createElement("div", {
        className: "message-body"
      }, /*#__PURE__*/React.createElement("p", {
        className: "has-text-right"
      }, message.message)));
    } // console.log(message);
    else {
        return (
          /*#__PURE__*/
          // <p key={message._id}>
          // 	{message.owner}: {message.message}
          // </p>
          React.createElement("article", {
            key: message._id,
            className: "message is-info"
          }, /*#__PURE__*/React.createElement("div", {
            className: "message-header"
          }, /*#__PURE__*/React.createElement("p", {
            className: "has-text-left"
          }, message.owner)), /*#__PURE__*/React.createElement("div", {
            className: "message-body"
          }, /*#__PURE__*/React.createElement("p", {
            className: "has-text-left"
          }, message.message)))
        );
      }
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
  var chatButton = document.querySelector('#chatButton');
  chatButton.addEventListener('click', function (e) {
    e.preventDefault(); //show the message box

    document.querySelector('#messageBox').style.display = 'block';
    ReactDOM.render( /*#__PURE__*/React.createElement(ChatBox, {
      messages: []
    }), document.querySelector('#chat'));
    ReactDOM.render( /*#__PURE__*/React.createElement(MessageBox, {
      csrf: csrf
    }), document.querySelector('#messageBox'));
    loadMessage();
    return false;
  });
  var settingsButton = document.querySelector('#settingsButton');
  settingsButton.addEventListener('click', function (e) {
    // hide the message box
    document.querySelector('#messageBox').style.display = 'none';
    e.preventDefault();
    createSettingsWindow(csrf);
    return false;
  }); // $('#chat').scrollTop($('#chat')[0].scrollHeight);

  $('#chat').scrollTop($('#chat')[0].scrollHeight - $('#chat')[0].clientHeight);
  setInterval(function () {
    console.log('doing it');
    loadMessage();
  }, 10000);
}; // function to get back all messages


var loadMessage = function loadMessage() {
  // console.log('sendmesage()');
  sendAjax('GET', '/getMessages', null, function (data) {
    console.log('message sent and get'); //data is all the messages from the database from the same person
    // console.log(data.messages[0]._id);
    // console.log(data.messages.length);

    ReactDOM.render( /*#__PURE__*/React.createElement(ChatBox, {
      messages: data.messages
    }), document.querySelector('#chat'));
  }); // ws.send('test');
  // return false;
};

var handlePassword = function handlePassword(e) {
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

  var csrf = document.querySelector("input[name='_csrf']").value;
  var newPassword = document.querySelector('#changepass').value;
  var newPassword2 = document.querySelector('#changepass2').value;
  var owner = localStorage.getItem('username');
  var body = "_csrf=".concat(csrf, "&password=").concat(newPassword, "&password2=").concat(newPassword2, "&owner=").concat(owner); // console.log('logging body');
  // console.log(body);

  sendAjax('POST', '/password', body, redirect);
  return false;
};

var SettingsWindow = function SettingsWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "settings",
    className: "container is-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    id: "passwordForm",
    name: "passwordForm",
    onSubmit: handlePassword,
    className: "form "
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    id: "changepass",
    type: "password",
    name: "changePass",
    placeholder: "type your new password! (\u2299\u2026\u2299 )"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "New Password: "), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    id: "changepass2",
    type: "password",
    name: "changePass2",
    placeholder: "retype new password! (\xB0\u2200\xB0)\u309E"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("input", {
    className: "button is-dark is-rounded is-pulled-right formSubmit",
    type: "submit",
    value: "Change Password"
  }))));
};

var createSettingsWindow = function createSettingsWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SettingsWindow, {
    csrf: csrf
  }), document.querySelector('#chat'));
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
