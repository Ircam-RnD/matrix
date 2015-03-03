/**
 * @fileoverview Soundworks client side time syncronization module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var Sync = require('sync/client');
var client = require('./client');

class ClientSync extends ClientModule {
  constructor(options = {}) {
    super('sync', true, options.color || 'black');

    this.sync = new Sync();

    this.setViewText('Clock syncing, stand by…', 'soft-blink');
  }

  start() {
    super.start();

    debug('start');
    this.sync.start(client.socket);
    debug('started');
    
    let ready = false;
    if (!ready) {
      ready = true;
      debug('ready');
      this.done();
    }
    
  }

  getLocalTime(masterTime) {
    return this.sync.getLocalTime(masterTime);
  }

  getMasterTime(localTime) {
    return this.sync.getMasterTime(localTime);
  }
}

module.exports = ClientSync;
