$(document).ready(function(){

function initialize() {
  chrome.tabs.getSelected(null, function(tab) {
    $('#nugget-source').val(tab.title);
  });
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function runQuery()
{
  chrome.tabs.getSelected(null, function(tab) {
    var Nugget = Parse.Object.extend("Nugget");
    var query = new Parse.Query(Nugget);
    query.equalTo("url", tab.url).descending("updatedAt");
    query.notEqualTo("deleted", true);
    query.limit(10);
    query.find({
      success: function(results) {
        if (results.length == 0)
        {
          $('#related-nuggets-table').html('<p>none</p>');
        }
        else
        {
          var related_nuggets = [];
          for(i=0;i<results.length;i++)
          {
            var markup_to_push = '<tr><td><div id="' + results[i].id + '" class="nugget-wrapper"><p>' + results[i].get("text") + " ";
            var tags = results[i].get("tags");
            for (j=0;j<tags.length;j++)
            {
              markup_to_push += '<span class="nugget-tag">#' + tags[j] + '</span> ';
            }
            var timeAgo = moment(results[i].updatedAt).fromNow();
            if (moment().diff(results[i].updatedAt) < 0)  // Parse seems to set updatedAt a couple seconds into the future, so preventing the time-ago tag from saying "in a few seconds"
            {
              timeAgo = moment().fromNow();
            }
            markup_to_push += '</p>';
            markup_to_push += '<div class="row-fluid"><span class="nugget-time-ago span10">' + timeAgo + '</span>';
            markup_to_push += '<span class="span1 pull-right nugget-action-icons" style="display: none;"><i class="icon-plus nugget-action-icon"></i></span>';
            markup_to_push += '</div></div></td></tr>';
            related_nuggets.push(markup_to_push);
          }
          $('#related-nuggets-table').html(related_nuggets.join(''));
        }
      }
    });
  });
}

var maxNuggetCharLength = 140;

$('#nugget-text').on('input', function() {
  var charsLeft = maxNuggetCharLength - $(this).val().length;
  $('#nugget-text-count').html(charsLeft);
  if (charsLeft < 0)
  {
    $('#nugget-text-count').css('color','red');
    $('#add-nugget-button').prop('disabled', true);
  }
  else
  {
    $('#nugget-text-count').css('color','gray');
    $('#add-nugget-button').prop('disabled', false);
  }
  $('#nugget-message').css('display','none');
});

$('#nugget-source-icon').click(function()
{
  chrome.tabs.getSelected(null, function(tab) {
    $('#nugget-source').val(tab.title);
  });
});

$('#nugget-source-clear').click(function()
{
  $('#nugget-source').val("");
  $('#nugget-source').focus();
});

$('#related-nuggets-table').on('mouseenter', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','block');
});

$('#related-nuggets-table').on('mouseleave', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','none');
});

$('#add-nugget-button').click(function()
{
  $('#add-nugget-button').prop('disabled', true);
  if ($('#nugget-text').val() == "")
  {
    $('#nugget-message').css('color','red');
    $('#nugget-message').html("Enter a nugget!");
    $('#nugget-message').css('display','block');
    $('#nugget-text').focus();
    $('#add-nugget-button').prop('disabled', false);
  }
  else if ($('#nugget-text').val().length > maxNuggetCharLength) // textarea bind to input should prevent this, but putting this in as backup to verify nugget text is not over maxNuggetCharLength characters.
  {
    $('#nugget-message').css('color','red');
    $('#nugget-message').html("Nugget can't be more than " + maxNuggetCharLength + " characters!");
    $('#nugget-message').css('display','block');
    $('#nugget-text').focus();
    $('#add-nugget-button').prop('disabled', false);
  }
  else
  {
    chrome.tabs.getSelected(null, function(tab) {
      var Nugget = Parse.Object.extend("Nugget");
      var nugget = new Nugget();
      var tabURL = "";
      if ($('#nugget-source').val() == tab.title) // only save url if nugget-source field is still tab's title - ie. user didn't change it
      {
        tabURL = tab.url;
      }
      var tagsToSave = [];
      var tagsText = $('#nugget-tags').attr("value"); // .val() AND .prop("value") returns "" after submitting the first time.  Should be checking for the HTML markup attribute instead.
      if (tagsText != null)
      {
        tagsToSave = tagsText.split(',');
      }
      nugget.set("text", $('#nugget-text').val());
      nugget.set("source", $('#nugget-source').val());
      nugget.set("url", tabURL);
      nugget.set("tags", tagsToSave);

      var Nugget_User = Parse.Object.extend("Nugget_User");
      var nugget_user = new Nugget_User();
      nugget_user.save({
        nugget: nugget,
        user: Parse.User.current(),
        isOwner: true
      }, {
        success: function(nugget_user)
        {
          $('#nugget-message').css('color','green');
          $('#nugget-message').html("Saved!");
          $('#nugget-message').css('display','block');
          $('#nugget-text').val("");
          $('#nugget-source').val(tab.title);
          $('#nugget-tags').val("");
          runQuery();
          $('.icon-remove-tag').each(function() {
            $(this).click();
          });
          $('#nugget-text').focus();
          $('#add-nugget-button').prop('disabled', false);
        },
        error: function(object, error)
        {
          $('#nugget-message').css('color','red');
          $('#nugget-message').html(error.message);
          $('#nugget-message').css('display','block');
          $('#nugget-text').focus();
          $('#add-nugget-button').prop('disabled', false);
        }
      });
    });
  }
});

$('#related-nuggets-table').on('click', '.icon-plus', function()
{
  var nugget_div = $(this).parents('.nugget-wrapper');
  var nugget_id = nugget_div.attr('id');
  var Nugget = Parse.Object.extend("Nugget");
  var nugget = new Nugget();
  nugget.id = nugget_id;
  var Nugget_User = Parse.Object.extend("Nugget_User");
  var query = new Parse.Query(Nugget_User);
  query.equalTo("user", Parse.User.current());
  query.equalTo("nugget", nugget);
  query.find().then(function(nugget_users) {
    if (!nugget_users || nugget_users.length == 0)
    {
      var nugget_user = new Nugget_User();
      nugget_user.save({
        nugget: nugget,
        user: Parse.User.current(),
        isOwner: false
      });
    }
    else if (nugget_users.length == 1 && nugget_users[0].get("isDeleted") == true)
    {
      var nugget_user = nugget_users[0];
      nugget_user.set("isDeleted", false);
      nugget_user.save();
    }
  });
});

function validateLogin() {
  var currentUser = Parse.User.current();
  if (!currentUser)
  {
    goToLoginPage();
  }
  else
  {
    $('#extension-container').css('display','block');
    runQuery();
  }
}

initialize();

$('#logout-button').click(function()
{
  Parse.User.logOut();
  goToLoginPage();
});

});
