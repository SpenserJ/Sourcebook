$(document).ready(function() {
  function CommitModel(timestamp, changeType, filename) {
    this.timestamp = ko.observable(timestamp);
    this.changeType = ko.observable(changeType);
    this.filename = ko.observable(filename);
  };

  function CommitLogModel() {
    var self = this;
    self.commits = ko.observableArray([]);
  }

  var commitLog = new CommitLogModel();

  ko.applyBindings(commitLog);

  var socket = io.connect();
  socket.on('change', function(data) {
    commitLog.commits.push(new CommitModel(new Date(), data.type, data.path));
  }).on('initialize', function(data) {
    console.log(data);
  });
});