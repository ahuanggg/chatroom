const handleError = (message) => {
	console.log(message);
	$('#errorMessage').text(message);
};

const redirect = (response) => {
	window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
	console.log('sendAJAX not wokring');
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: 'json',
		success: success,
		error: function (xhr, status, error) {
			var messageObj = JSON.parse(xhr.responseText);
			console.log(messageObj.error);
			handleError(messageObj.error);
		},
	});
};
