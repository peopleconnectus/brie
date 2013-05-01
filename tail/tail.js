var Tail, environment, events, fs;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
events = require("events");
fs = require('fs');
environment = process.env['NODE_ENV'] || 'development';
Tail = (function() {
  __extends(Tail, events.EventEmitter);
  Tail.prototype.readBlock = function() {
    var block, stream;
    if (this.queue.length >= 1) {
      block = this.queue[0];
      if (block.end > block.start) {
        stream = fs.createReadStream(this.filename, {
          start: block.start,
          end: block.end - 1,
          encoding: "utf-8"
        });
        stream.on('error', __bind(function(error) {
          console.log("Tail error:" + error);
          return this.emit('error', error);
        }, this));
        stream.on('end', __bind(function() {
          this.queue.shift();
          if (this.queue.length >= 1) {
            return this.internalDispatcher.emit("next");
          }
        }, this));
        return stream.on('data', __bind(function(data) {
          var chunk, parts, _i, _len, _results;
          this.buffer += data;
          parts = this.buffer.split(this.separator);
          this.buffer = parts.pop();
          _results = [];
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            chunk = parts[_i];
            _results.push(this.emit("line", chunk));
          }
          return _results;
        }, this));
      }
    }
  };
  function Tail(filename, separator) {
    this.filename = filename;
    this.separator = separator != null ? separator : '\n';
    this.readBlock = __bind(this.readBlock, this);
    this.buffer = '';
    this.internalDispatcher = new events.EventEmitter();
    this.queue = [];
    this.internalDispatcher.on('next', __bind(function() {
      return this.readBlock();
    }, this));
    fs.watchFile(this.filename, __bind(function(curr, prev) {
      if (curr.size > prev.size) {
        this.queue.push({
          start: prev.size,
          end: curr.size
        });
        if (this.queue.length === 1) {
          return this.internalDispatcher.emit("next");
        }
      }
    }, this));
  }
  Tail.prototype.unwatch = function() {
    fs.unwatchFile(this.filename);
    return this.queue = [];
  };
  return Tail;
})();
exports.Tail = Tail;