// for template rendering in the views below
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var LogRecord = Backbone.Model.extend({
});

var LogRecordCollection = Backbone.Collection.extend({
  model: LogRecord
});

var LogRecordView = Backbone.View.extend({
  model: LogRecord,

  tagName: "div",

  className: "record",

  template: _.template( $('#log-record-template').html() ),

  initialize: function() {
    _.bindAll(this, 'render');
  },

  render: function() {
    this.model.set({
      'msg': this.model.escape('msg'),
      'traceback': this.model.escape('traceback'),
      'funcname': this.model.escape('funcname'),
      'filename': this.model.escape('filename')
    });
    var viewHtml = this.template(this.model.toJSON());
    $(this.el).html(viewHtml);
    $(this.el).addClass(this.model.get('level'));

    // escape some fields
    this.$('abbr.date').timeago();
    return this;
  }
});

var LogMonitor = Backbone.Model.extend({
});

var LogMonitorView = Backbone.View.extend({
  model: LogMonitor,
 
  el: $('#log-monitor-application'),

  initialize: function() {
    var self = this;
    _.bindAll(this, 'addRecord', 'render');
    
    // rpc method for server to add log data to me
    now.addRecord = function(record) {
      self.addRecord(record);
    }

  },

  events: {
  },

  // insert a new record at the top of the list
  addRecord: function(record) {
    var model = new LogRecord(record);
    var view = new LogRecordView({model: model});
    $(this.el).prepend(view.render().el); 
  }
});
