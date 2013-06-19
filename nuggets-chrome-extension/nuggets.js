$(document).ready(function(){
    
function initialize() {
  chrome.tabs.getSelected(null, function(tab) {
    $(".prepopulate").val(tab.title);
    });
  Parse.$ = jQuery;
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  runQuery();
}

var Nugget = Parse.Object.extend("Nugget"); // can probably enforce Nugget attribute restrictions in here - see https://github.com/ParsePlatform/Todo/blob/master/js/todos.js

var MyNuggetList = Parse.Collection.extend(
{
  model: Nugget,

  // // Filter down the list of all todo items that are finished.
  // done: function() {
  //   return this.filter(function(todo){ return todo.get('done'); });
  // },

  // // Filter down the list to only todo items that are still not finished.
  // remaining: function() {
  //   return this.without.apply(this, this.done());
  // },

  // // We keep the Todos in sequential order, despite being saved by unordered
  // // GUID in the database. This generates the next order number for new items.
  // nextOrder: function() {
  //   if (!this.length) return 1;
  //   return this.last().get('order') + 1;
  // },

  // // Todos are sorted by their original insertion order.
  // comparator: function(todo) {
  //   return todo.get('order');
  // }

});

var NuggetView = Parse.View.extend({

  //... is a list tag.
  tagName:  "li",

  // Cache the template function for a single item.
  template: _.template($('#nugget-template').html()),

  // The DOM events specific to an item.
  // events: {
  //   "click .toggle"              : "toggleDone",
  //   "dblclick label.todo-content" : "edit",
  //   "click .todo-destroy"   : "clear",
  //   "keypress .edit"      : "updateOnEnter",
  //   "blur .edit"          : "close"
  // },

  // The TodoView listens for changes to its model, re-rendering. Since there's
  // a one-to-one correspondence between a Todo and a TodoView in this
  // app, we set a direct reference on the model for convenience.
  initialize: function() {
  },

  // Re-render the contents of the todo item.
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    // this.input = this.$('.edit');
    return this;
  },
});

var MyNuggetsView = Parse.View.extend(
{
  // events: {
  //   "keypress #new-todo":  "createOnEnter",
  //   "click #clear-completed": "clearCompleted",
  //   "click #toggle-all": "toggleAllComplete",
  //   "click .log-out": "logOut",
  //   "click ul#filters a": "selectFilter"
  // },

  el: ".content",

  // At initialization we bind to the relevant events on the `Todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting todos that might be saved to Parse.
  initialize: function() {
    var self = this;

    // _.bindAll(this, 'addOne', 'addAll', 'addSome', 'render', 'toggleAllComplete', 'logOut', 'createOnEnter');

    // Main todo management template
    this.$el.html(_.template($("#nugget-template").html()));

    // Create our collection of Todos
    this.nuggets = new MyNuggetList;

    // Setup the query for the collection to look for todos from the current user
    this.nuggets.query = new Parse.Query(Nugget);
    this.nuggets.query.equalTo("user", Parse.User.current());
    this.nuggets.fetch();
    this.nuggets.each(this.addOne);
  },

  addOne: function(todo) {
    var view = new NuggetView({model: Nugget});
    this.$("#nugget-list").append(view.render().el);
  },

  // Logs out the user and shows the login view
  logOut: function(e) {
    Parse.User.logOut();
    new LogInView();
    this.undelegateEvents();
    delete this;
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
      this.input = this.$('.edit');
      return this;
  }
});

var LogInView = Parse.View.extend({
  events: {
    "submit form.login-form": "logIn",
    "submit form.signup-form": "signUp"
  },

  el: ".content",
  
  initialize: function() {
    _.bindAll(this, "logIn", "signUp");
    this.render();
  },

  logIn: function(e) {
    var self = this;
    var username = this.$("#login-username").val();
    var password = this.$("#login-password").val();
    
    Parse.User.logIn(username, password, {
      success: function(user) {
        new ManageTodosView();
        self.undelegateEvents();
        delete self;
      },

      error: function(user, error) {
        self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
        this.$(".login-form button").removeAttr("disabled");
      }
    });

    this.$(".login-form button").attr("disabled", "disabled");

    return false;
  },

  signUp: function(e) {
    var self = this;
    var username = this.$("#signup-username").val();
    var password = this.$("#signup-password").val();
    
    Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
      success: function(user) {
        new ManageTodosView();
        self.undelegateEvents();
        delete self;
      },

      error: function(user, error) {
        self.$(".signup-form .error").html(error.message).show();
        this.$(".signup-form button").removeAttr("disabled");
      }
    });

    this.$(".signup-form button").attr("disabled", "disabled");

    return false;
  },

  render: function() {
    this.$el.html(_.template($("#login-template").html()));
    this.delegateEvents();
  }
});

var AppView = Parse.View.extend({
  el: $("#nuggetapp"),

  initialize: function() {
    this.render();
  },

  render: function() {
    if (Parse.User.current())
    {
      new MyNuggetsView();
    }
    else
    {
      new LogInView();
    }
  }
});

initialize();
new AppView;
    
    $('#submit').click(function() {
    
        
        var formData = $("#form").serializeArray(),
            len = formData.length,
            dataObj = {};
        
        for (i=0; i<len; i++) {
            dataObj[formData[i].name] = formData[i].value;
            }
            
        if (dataObj['Nugget.Content'] == "") {
            return false;
            }

        var Nugget = Parse.Object.extend("Nugget");
        var nuggetObject = new Nugget();
          nuggetObject.save({Content: dataObj['Nugget.Content'], Source: dataObj['Nugget.Source'], Tag: dataObj['Nugget.Tag']}, {
          success: function(object) {
            $(".success").show();
          },
          error: function(model, error) {
            $(".error").show();
          }
        });
        
        runQuery();
        
        $('.nugget-field').val("");
        
        return false; 
    });
    
    $('.follow-image').click( function() {
        $(this).attr('src','img/check.png');
    });
});
