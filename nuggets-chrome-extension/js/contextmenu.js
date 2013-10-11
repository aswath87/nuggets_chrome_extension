function contextMenuClicked(info, tab) {
	Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
	var currentUser = Parse.User.current();
	if (!currentUser)
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
			var Nugget = Parse.Object.extend("Nugget");
      		var nugget = new Nugget();
      		nugget.set("text", info.selectionText);
			nugget.set("source", tab.title);
			nugget.set("url", tab.url);

			var Nugget_User = Parse.Object.extend("Nugget_User");
			var nugget_user = new Nugget_User();
			nugget_user.set("nugget", nugget);
			nugget_user.set("user", Parse.User.current());
			nugget_user.set("isOwner", true);
			nugget_user.save().then(function() {
				alert('Nugget saved!');
			});
		}
	}
}

chrome.contextMenus.create({
	"title": "Add to Nuggets",
	"contexts": ['selection'],
	"onclick": contextMenuClicked
});