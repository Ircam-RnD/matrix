'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  /**
   * Initialize the module which socket.io
   * @private
   */
  initialize: function initialize(io) {
    this.io = io;
  },

  /**
   * Listen a WebSocket message.
   * @param {Client} client - The client that must listen to the message.
   * @param {String} channel - The channel of the message
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive: function receive(client, channel, callback) {
    client.socket.on(channel, callback);
  },

  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send: function send(client, channel) {
    var _client$socket;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_client$socket = client.socket).emit.apply(_client$socket, [channel].concat(args));
  },

  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
   * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast: function broadcast(clientType, excludeClient, channel) {
    for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    var _this = this;

    var namespaces = undefined;

    if (typeof clientType === 'string') {
      namespaces = ['/' + clientType];
    } else if (Array.isArray(clientType)) {
      namespaces = clientType.map(function (type) {
        return '/' + type;
      });
    } else {
      namespaces = _Object$keys(this.io.nsps);
    }

    if (excludeClient) {
      var index = namespaces.indexOf('/' + excludeClient.clientType);

      if (index !== -1) {
        var _client$socket$broadcast;

        namespaces.splice(index, 1);
        (_client$socket$broadcast = client.socket.broadcast).emit.apply(_client$socket$broadcast, [channel].concat(args));
      }
    }

    namespaces.forEach(function (nsp) {
      var _io$of;

      (_io$of = _this.io.of(nsp)).emit.apply(_io$of, [channel].concat(args));
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O3FCQUFlOzs7Ozs7QUFNYixZQUFVLEVBQUEsb0JBQUMsRUFBRSxFQUFFO0FBQ2IsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7R0FDZDs7Ozs7Ozs7QUFRRCxTQUFPLEVBQUEsaUJBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDakMsVUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDOzs7Ozs7OztBQVFELE1BQUksRUFBQSxjQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7OztzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQzNCLHNCQUFBLE1BQU0sQ0FBQyxNQUFNLEVBQUMsSUFBSSxNQUFBLGtCQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUN0Qzs7Ozs7Ozs7QUFRRCxXQUFTLEVBQUEsbUJBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQVc7dUNBQU4sSUFBSTtBQUFKLFVBQUk7Ozs7O0FBQ25ELFFBQUksVUFBVSxZQUFBLENBQUM7O0FBRWYsUUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7QUFDbEMsZ0JBQVUsR0FBRyxPQUFLLFVBQVUsQ0FBRyxDQUFDO0tBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3BDLGdCQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7cUJBQVEsSUFBSTtPQUFFLENBQUMsQ0FBQztLQUNqRCxNQUFNO0FBQ0wsZ0JBQVUsR0FBRyxhQUFZLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEM7O0FBRUQsUUFBSSxhQUFhLEVBQUU7QUFDakIsVUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVqRSxVQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTs7O0FBQ2hCLGtCQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixvQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBQyxJQUFJLE1BQUEsNEJBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO09BQ2hEO0tBQ0Y7O0FBRUQsY0FBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSzs7O0FBQzFCLGdCQUFBLE1BQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxJQUFJLE1BQUEsVUFBQyxPQUFPLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDeEMsQ0FBQyxDQUFDO0dBQ0o7Q0FDRiIsImZpbGUiOiJzcmMvc2VydmVyL2NvbW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIG1vZHVsZSB3aGljaCBzb2NrZXQuaW9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGluaXRpYWxpemUoaW8pIHtcbiAgICB0aGlzLmlvID0gaW87XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5zb2NrZXQub24oY2hhbm5lbCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjbGllbnQuc29ja2V0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYCBvciBgY2xpZW50VHlwZWBzLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSBpcyBzZW50IHRvIGFsbCBjbGllbnRzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IG11c3QgcmVjZWl2ZSB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGxldCBuYW1lc3BhY2VzO1xuXG4gICAgaWYgKHR5cGVvZiBjbGllbnRUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXNwYWNlcyA9IFtgLyR7Y2xpZW50VHlwZX1gXTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY2xpZW50VHlwZSkpIHtcbiAgICAgIG5hbWVzcGFjZXMgPSBjbGllbnRUeXBlLm1hcCh0eXBlID0+IGAvJHt0eXBlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gT2JqZWN0LmtleXModGhpcy5pby5uc3BzKTtcbiAgICB9XG5cbiAgICBpZiAoZXhjbHVkZUNsaWVudCkge1xuICAgICAgY29uc3QgaW5kZXggPSBuYW1lc3BhY2VzLmluZGV4T2YoJy8nICsgZXhjbHVkZUNsaWVudC5jbGllbnRUeXBlKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGNsaWVudC5zb2NrZXQuYnJvYWRjYXN0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmFtZXNwYWNlcy5mb3JFYWNoKChuc3ApID0+IHtcbiAgICAgIHRoaXMuaW8ub2YobnNwKS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIH0pO1xuICB9LFxufTtcbiJdfQ==