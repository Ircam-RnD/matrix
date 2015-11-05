'use strict';

const ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

const maxRandomClients = 9999;

/**
 * The {@link ServerCheckin} takes care of the check-in on the server side.
 */
class ServerCheckin extends ServerModule {
// export default class ServerCheckin extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='checkin'] Name of the module.
   * @param {Object} [options.setup] Setup used in the scenario, if any (cf. {@link ServerSetup}).
   * @param {Object} [options.maxClients=Infinity] maximum number of clients supported by the scenario through this checkin module (if a `options.setup` is provided, the maximum number of clients the number of predefined positions of that `setup`).
   * @param {Object} [options.order='ascending'] Order in which indices are assigned. Currently spported values are:
   * - `'ascending'`: indices are assigned in ascending order;
   * - `'random'`: indices are assigned in random order.
   */
  constructor(options = {}) {
    super(options.name || 'checkin');

    this.setup = options.setup || null;
    this.maxClients = options.maxClients || Infinity;
    this.order = options.order || 'ascending'; // 'ascending' | 'random'

    if (this.maxClients > Number.MAX_SAFE_INTEGER)
      this.maxClients = Number.MAX_SAFE_INTEGER;

    if (this.setup) {
      var numPlaces = this.setup.getNumPositions();

      if (this.maxClients > numPlaces && numPlaces > 0)
        this.maxClients = numPlaces;
    }

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    if (this.maxClients > maxRandomClients)
      this.order = 'ascending';
    else if (this.order === 'random') {
      this._nextAscendingIndex = this.maxClients;

      for (let i = 0; i < this.maxClients; i++)
        this._availableIndices.push(i);
    }
  }

  _getRandomIndex() {
    var numAvailable = this._availableIndices.length;

    if (numAvailable > 0) {
      let random = Math.floor(Math.random() * numAvailable);
      return this._availableIndices.splice(random, 1)[0];
    }

    return -1;
  }

  _getAscendingIndex() {
    if (this._availableIndices.length > 0) {
      this._availableIndices.sort(function(a, b) {
        return a - b;
      });

      return this._availableIndices.splice(0, 1)[0];
    } else if (this._nextAscendingIndex < this.maxClients) {
      return this._nextAscendingIndex++;
    }

    return -1;
  }

  _releaseIndex(index) {
    this._availableIndices.push(index);
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    client.receive(this.name + ':request', () => {
      var index = -1;
      var order = this.order;

      if (this.order === 'random')
        index = this._getRandomIndex();
      else // if (order === 'acsending')
        index = this._getAscendingIndex();

      if (index >= 0) {
        client.modules[this.name].index = index;

        var label = null;
        var coordinates = null;

        if (this.setup) {
          label = this.setup.getLabel(index);
          coordinates = this.setup.getCoordinates(index);
        }

        client.modules[this.name].label = label;
        client.coordinates = coordinates;

        client.send(this.name + ':acknowledge', index, label, coordinates);
      } else {
        client.send(this.name + ':unavailable');
      }
    });

    client.receive(this.name + ':restart', (index, label, coordinates) => {
      // TODO: check if that's ok on random mode
      if (index > this._nextAscendingIndex) {
        for (let i = this._nextAscendingIndex; i < index; i++)
          this._availableIndices.push(i);

        this._nextAscendingIndex = index + 1;
      } else if (index === this._nextAscendingIndex) {
        this._nextAscendingIndex++;
      } else {
        let i = this._availableIndices.indexOf(index);

        if (i > -1)
          this._availableIndices.splice(i, 1);
      }

      client.modules[this.name].index = index;

      if (this.setup) {
        client.modules[this.name].label = label;
        client.coordinates = coordinates;
      }
    })
  }

  /**
   * @private
   */
  disconnect(client) {
    super.disconnect(client);

    var index = client.modules[this.name].index;

    if (index >= 0)
      this._releaseIndex(index);
  }
}

module.exports = ServerCheckin;