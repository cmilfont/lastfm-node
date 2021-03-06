var EventEmitter = require('events').EventEmitter;

var LastFmInfo = function(lastfm, type, options) {
  options = options || {};
  var that = this;
  EventEmitter.call(this);

  if (options.error) {
    this.on("error", options.error);
  }

  if (options.success) {
    this.on("success", options.success);
  }

  if (!type) {
    this.emit("error", new Error("Item type not specified"));
    return;
  }

  var enhancedParams = {
    track: function() {
      var params = { };
      if (typeof(options.track) == "object") {
        params.artist = options.track.artist["#text"];
        params.track = options.track.name;
        params.mbid = options.track.mbid;
      }
      return params;
    }
  };

  var params = enhancedParams[type] ? enhancedParams[type]() : {};

  Object.keys(options).forEach(function(name) {
    if (name != "error" && name != "success" && !params[name]) params[name] = options[name];
  });
  params.method = type + ".getinfo";

  lastfm.readRequest(params, false, function(data) {
    try {
      var item = JSON.parse(data);
    }
    catch(e) {
      that.emit("error", new Error(e.message + ":" + data));
      return; 
    }

    if (item[type]) {
      that.emit("success", item[type]);
      return;
    };

    if (item.error) {
      that.emit("error", new Error(item.message));
      return;
    }

    that.emit("error", new Error("Unexpected error"));
  });
};

LastFmInfo.prototype = Object.create(EventEmitter.prototype);

exports.LastFmInfo = LastFmInfo;
