$(document).ready(function(){

var welcome_nuggets = [];
var welcome_nuggets_to_show = 3;
var next_welcome_nugget_index = 0;
var CURRENT_NUGGET_USER = 'currentNuggetUser';

function initialize() {
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function updateWelcomeNuggetsMarkup()
{
  var welcome_nuggets_markup = [];
  next_welcome_nugget_index = Math.min(welcome_nuggets_to_show, welcome_nuggets.length);
  for(i=0;i<next_welcome_nugget_index;i++)
  {
    var markup_to_push = '<tr><td><div id="' + welcome_nuggets[i].id + '" class="nugget-wrapper row-fluid"><div class="span11"><p>' + welcome_nuggets[i].get("text") + " ";
    var tags = welcome_nuggets[i].get("tags");
    if (tags)
    {
      for (j=0;j<tags.length;j++)
      {
        markup_to_push += '<span class="nugget-tag">#' + tags[j] + '</span> ';
      }
    }
    markup_to_push += '</p></div>';
    markup_to_push += '<span class="span1 pull-right nugget-action-icons" style="display: none;"><i class="icon-plus nugget-action-icon"></i></span>';
    markup_to_push += '</div></td></tr>';
    welcome_nuggets_markup.push(markup_to_push);
  }
  $('#welcome-nuggets-table').html(welcome_nuggets_markup.join(''));
  $('#welcome-nuggets-div').css("display", "block");
}

function loadSampleNuggets()
{
  welcome_nuggets = [{"owner":{"__type":"Pointer","className":"_User","objectId":"VDQ0z1vRVL"},"source":"To Find Happiness, Forget About Passion - Oliver Segovia - Harvard Business Review","text":"Happiness comes from the intersection of what you love, what you're good at, and what the world needs. We've been told time and again to keep finding the first. Our schools helped developed the second. It's time we put more thought on the third.","url":"http://blogs.hbr.org/2012/01/to-find-happiness-forget-about/","tags":["happiness"],"objectId":"lWIRT5hDto","createdAt":"2013-06-26T17:12:26.293Z","updatedAt":"2013-10-11T04:37:18.355Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"VDQ0z1vRVL"},"source":"Be lucky - it's an easy skill to learn - Telegraph","text":"Lucky people are more relaxed and open, and therefore see what is there rather than just what they are looking for.","url":"http://www.telegraph.co.uk/technology/3304496/Be-lucky-its-an-easy-skill-to-learn.html","tags":["luck"],"objectId":"2euhUzpEWr","createdAt":"2013-06-26T17:03:54.596Z","updatedAt":"2013-07-02T19:33:46.466Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"GAIdY9BElL"},"source":"Write less.","text":"Fewer words create a more powerful message. Write less. ","url":"http://getnashty.com/write-less","tags":["hack","career","life"],"objectId":"GuTc4Bfyzb","createdAt":"2013-10-01T20:24:34.146Z","updatedAt":"2013-10-01T20:24:34.146Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"VDQ0z1vRVL"},"source":"The Internet Just Made Microsoft Kill a Car for a Faster Horse — Adventures in Consumer Technology — Medium","text":"“If I had asked what my customers wanted, they would have said they wanted a faster horse.” - Henry Ford","url":"https://medium.com/adventures-in-consumer-technology/a849a9d4d530","tags":["customers"],"objectId":"Edi1t4BwwU","createdAt":"2013-06-21T16:59:12.909Z","updatedAt":"2013-07-02T19:33:46.182Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"VDQ0z1vRVL"},"source":"Think different: How an entrepreneur makes decisions to go camping - GeekWire","text":"An entrepreneur minimizes the number of regrets in his life by recognizing that there is a real cost to not doing something.","url":"http://www.geekwire.com/2012/entrepreneur-decisions-camping/","tags":["entrepreneur","regret"],"objectId":"9PoNmqX8m1","createdAt":"2013-06-26T17:22:31.775Z","updatedAt":"2013-07-02T19:33:47.094Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"GAIdY9BElL"},"source":"Woody Allen Interview - Woody Allen Blue Jasmine Quotes - Esquire","text":"If you don't have your health, you have nothing. Stay healthy, keep fit. ","url":"http://www.esquire.com/features/what-ive-learned/woody-allen-0913","tags":["life","health"],"objectId":"gqCk9vF3su","createdAt":"2013-08-10T07:48:17.704Z","updatedAt":"2013-08-10T07:48:17.704Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"GAIdY9BElL"},"source":"Ashton Kutcher reveals real name and gives great speech at 2013 Teen Choice Awards | Cultivated Influence","text":"Be smart, be thoughtful, be generous. Nothing else matters. ","url":"http://cultivatedinfluence.net/2013/08/12/ashton-kutcher-reveals-real-first-name-and-gives-great-speech-at-2013-teen-choice-awards/","tags":["life"],"objectId":"zErC2kGDE0","createdAt":"2013-08-14T18:32:55.419Z","updatedAt":"2013-08-14T18:32:55.419Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"fyudoOXYX2"},"source":"Steve Jobs: How to live before you die | Video on TED.com","text":"Stay Hungry. Stay Foolish.","url":"http://www.ted.com/talks/steve_jobs_how_to_live_before_you_die.html","tags":["life","stevejobs"],"objectId":"5y1l7Z04Nw","createdAt":"2013-10-11T04:50:08.225Z","updatedAt":"2013-10-11T04:53:12.158Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"fyudoOXYX2"},"source":"Steve Jobs: How to live before you die | Video on TED.com","text":"Find what you love. The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.","url":"http://www.ted.com/talks/steve_jobs_how_to_live_before_you_die.html","tags":["life","advice","passion","stevejobs"],"objectId":"H3gbckrsCM","createdAt":"2013-10-11T04:52:37.404Z","updatedAt":"2013-10-11T04:53:22.429Z"},{"owner":{"__type":"Pointer","className":"_User","objectId":"fyudoOXYX2"},"source":"Ashton Kutcher reveals real name and gives great speech at 2013 Teen Choice Awards | Cultivated Influence","text":"Opportunities look a lot like work.","url":"http://cultivatedinfluence.net/2013/08/12/ashton-kutcher-reveals-real-first-name-and-gives-great-speech-at-2013-teen-choice-awards/","tags":["life","opportunity"],"objectId":"MXYGvXP06G","createdAt":"2013-10-11T04:46:12.731Z","updatedAt":"2013-10-11T04:46:12.731Z"}]
  // var userId = "1"; // TODO once data is migrated, we need to make a call to find the token for this user. Until then, this won't work!! The old id was fyudoOXYX2
  // var token = 'GET FROM API using /api-token-auth with username and password';
  // $.ajax({
  //   url: "https://nuggets-django.herokuapp.com/api/v0/user/" + userId + "/nuggets",
  //   type: 'GET',
  //   dataType: 'json',
  //   headers:{'Authorization':'Token ' + token},
  //   success: function(results) {
  //     console.log('results: ' + results.length);
  //     if (results.length == 0) {
  //       $('#welcome-nuggets-div').css("display", "none");
  //     }
  //     else {
  //       results = results.sort(function () {
  //         return 0.5 - Math.random();
  //       }); // randomize array
  //
  //       welcome_nuggets = $.map(results, function (nugget) {
  //         return nugget;
  //       });
  //       updateWelcomeNuggetsMarkup();
  //     }
  //   }}
  // );
}

$('#welcome-nuggets-table').on('mouseenter', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','block');
});

$('#welcome-nuggets-table').on('mouseleave', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','none');
});

function getCurrentUserToken() {
  return JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER))['token'];
}

function getCurrentUserId() {
  return JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER))['userId'];
}

$('#welcome-nuggets-table').on('click', '.icon-plus', function()
{
  var nugget_div = $(this).parents('.nugget-wrapper');
  var nugget_id = nugget_div.attr('id');

  var userId = "fyudoOXYX2"; // TODO once data is migrated, we need to make a call to find the token for this user. Until then, this won't work!!
  var token = 'GET FROM API using /api-token-auth with username and password';
  $.ajax({
    url: "https://nuggets-django.herokuapp.com/api/v0/user/" + userId + "/nuggets/" + nugget_id + "/",
    type: 'GET',
    dataType: 'json',
    headers:{'Authorization':'Token ' + token},
    success: function(nugget_from_famous_person) {
      // copy nugget from famous person into current user:
      var currentUserId = getCurrentUserId();
      var currentUserToken = getCurrentUserToken();
      var dataMap = { text : nugget_from_famous_person.text, tags : nugget_from_famous_person.tags, source : nugget_from_famous_person.source };
      $.ajax({
        url: "https://nuggets-django.herokuapp.com/api/v0/user/" + currentUserId + "/",
        data: dataMap,
        type: 'POST',
        dataType: 'json',
        headers:{'Authorization':'Token ' + currentUserToken},
        });
    }
  });

  $(this).prop('class','icon-ok');
  nugget_div.fadeTo(1000, 0.2, function() {
    for(i=0;i<welcome_nuggets.length;i++)
    {
      if(welcome_nuggets[i].id == nugget_id)
      {
         welcome_nuggets.splice(i, 1);
         updateWelcomeNuggetsMarkup();
         break;
      }
    }
  });
});

function doesUserCurrentExist() {
  return localStorage.getItem(CURRENT_NUGGET_USER);
}

function validateLogin() {
  if (!doesUserCurrentExist())
  {
    goToLoginPage();
  }
  else
  {
    loadSampleNuggets();
  }
}

initialize();

});
