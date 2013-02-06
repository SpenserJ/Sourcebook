$(document).ready(function() {
  function CommitModel(changeType, filename) {
    this.changeType = ko.observable(changeType);
    this.filename = ko.observable(filename);
  };

  function CommitLogModel() {
    var self = this;
    self.commits = ko.observableArray([
      new CommitModel("Add", "C:\\boom.txt")
    ]);
  }

  var commitLog = new CommitLogModel();

  ko.applyBindings(commitLog);

  var socket = io.connect();
  socket.on('change', function(data) {
    commitLog.commits.push(new CommitModel(data.type, data.path));
  }).on('initialize', function(data) {
    console.log(data);
  });
});