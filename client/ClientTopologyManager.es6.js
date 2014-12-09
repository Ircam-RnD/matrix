'use strict';

var EventEmitter = require('events').EventEmitter;

class ClientTopologyManager extends EventEmitter {
  constructor(params) {
    this.topology = null;
    this.parentDiv = null;

    if (params && params.display) {
      var div = document.createElement('div');
      
      div.setAttribute('id', 'topology');
      div.classList.add('topology');
      div.classList.add('hidden');

      this.parentDiv = div;
    }
  }
}

module.exports = ClientTopologyManager;