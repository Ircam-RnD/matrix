/**
 * @fileoverview Soundworks server side check-in module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');

class ServerLocator extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'locator');

    this.setup = options.setup || null;
  }

  connect(client) {
    super.connect(client);

    client.receive('locator:request', () => {
      if (this.setup) {
        let surface = this.setup.getSurface();
        client.send('locator:surface', surface);
      } else {
        throw new Error("Locator requires a setup.");
      }
    });

    client.receive('locator:coordinates', (coordinates) => {
      client.coordinates = coordinates;
    });    

    client.receive('locator:restart', (coordinates) => {
      client.coordinates = coordinates;
    });
  }

  disconnect(client) {
    super.disconnect(client);
  }
}

module.exports = ServerLocator;