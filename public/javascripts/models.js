// for template rendering in the views below
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var LogRecord = Backbone.Model.extend({
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

var LogRecords = Backbone.Collection.extend({
  model: LogRecord
});

var LogMonitor = Backbone.Model.extend({
});

var LogMonitorView = Backbone.View.extend({
  model: LogMonitor,
 
  el: '#log-monitor-application',

  initialize: function() {
    var self = this;
    now.addRecord = function(record) {
      self.addRecord(record);
    }
  },

  events: {
  },

  addRecord: function(record) {
    var model = new LogRecord(record);
    var view = new LogRecordView({model: model});
    $(this.el).append(view.render().el); 
  }
});
