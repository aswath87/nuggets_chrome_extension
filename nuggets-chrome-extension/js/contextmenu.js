function getCurrentUserToken() {
    return JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER))['token'];
}

function getCurrentUserId() {
    return JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER))['userId'];
}

function doesUserCurrentExist() {
    return localStorage.getItem(CURRENT_NUGGET_USER);
}

function contextMenuClicked(info, tab) {
	if (!doesUserCurrentExist())
	{
		alert('Login in the chrome extension above!');
	}
	else
	{
		if (info.selectionText.length > 200)
		{
			alert('Nuggets must be 200 characters or less!');
		}
		else
		{
			var currentUserId = getCurrentUserId();
			var currentUserToken = getCurrentUserToken();
			var dataMap = { text: info.selectionText, source: tab.title, url: tab.url };
			$.ajax({
				url: "https://nuggets-django.herokuapp.com/api/v0/user/" + currentUserId + "/",
				data: dataMap,
				type: 'POST',
				dataType: 'json',
				headers:{'Authorization':'Token ' + currentUserToken},
				success: function(nugget_user)
				{
					alert('Nugget saved!');
				}
			});
		}
	}
}

chrome.contextMenus.create({
	"title": "Add to Nuggets",
	"contexts": ['selection'],
	"onclick": contextMenuClicked
});