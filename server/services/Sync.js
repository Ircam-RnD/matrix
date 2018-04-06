'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _server = require('sync/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:sync';
/**
 * Interface for the server `'sync'` service.
 *
 * This service acts as the master clock provider for the client sync service,
 * in order to synchronize the clocks of the different clients to its own clock.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Sync}*__
 *
 * **Note:** the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.sync = this.require('sync');
 * // when the experience has started
 * const syncTime = this.sync.getSyncTime();
 */

var Sync = function (_Service) {
  (0, _inherits3.default)(Sync, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Sync.__proto__ || (0, _getPrototypeOf2.default)(Sync)).call(this, SERVICE_ID));

    var startTime = process.hrtime();

    var getTimeFunction = function getTimeFunction() {
      var now = process.hrtime(startTime);
      return now[0] + now[1] * 1e-9;
    };

    _this._sync = new _server2.default(getTimeFunction);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Sync, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);

      this.ready();
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'connect', this).call(this, client);

      var sendFunction = function sendFunction() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this2.send.apply(_this2, [client, 'pong'].concat(args));
      };
      var receiveFunction = function receiveFunction(callback) {
        return _this2.receive(client, 'ping', callback);
      };

      this._sync.start(sendFunction, receiveFunction);
    }

    /**
     * Returns the current time in the sync clock, derived from `process.hrtime()`.
     * @return {Number} - Current sync time (in _seconds_).
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this._sync.getSyncTime();
    }
  }]);
  return Sync;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Sync);

exports.default = Sync;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmMiLCJzdGFydFRpbWUiLCJwcm9jZXNzIiwiaHJ0aW1lIiwiZ2V0VGltZUZ1bmN0aW9uIiwibm93IiwiX3N5bmMiLCJyZWFkeSIsImNsaWVudCIsInNlbmRGdW5jdGlvbiIsImFyZ3MiLCJzZW5kIiwicmVjZWl2ZUZ1bmN0aW9uIiwicmVjZWl2ZSIsImNhbGxiYWNrIiwic3RhcnQiLCJnZXRTeW5jVGltZSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJNQyxJOzs7QUFDSjtBQUNBLGtCQUFjO0FBQUE7O0FBQUEsa0lBQ05ELFVBRE07O0FBR1osUUFBTUUsWUFBWUMsUUFBUUMsTUFBUixFQUFsQjs7QUFFQSxRQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCLEdBQU07QUFDNUIsVUFBTUMsTUFBTUgsUUFBUUMsTUFBUixDQUFlRixTQUFmLENBQVo7QUFDQSxhQUFPSSxJQUFJLENBQUosSUFBU0EsSUFBSSxDQUFKLElBQVMsSUFBekI7QUFDRCxLQUhEOztBQUtBLFVBQUtDLEtBQUwsR0FBYSxxQkFBZUYsZUFBZixDQUFiO0FBVlk7QUFXYjs7QUFFRDs7Ozs7NEJBQ1E7QUFDTjs7QUFFQSxXQUFLRyxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1FDLE0sRUFBUTtBQUFBOztBQUNkLGdJQUFjQSxNQUFkOztBQUVBLFVBQU1DLGVBQWUsU0FBZkEsWUFBZTtBQUFBLDBDQUFJQyxJQUFKO0FBQUlBLGNBQUo7QUFBQTs7QUFBQSxlQUFhLE9BQUtDLElBQUwsZ0JBQVVILE1BQVYsRUFBa0IsTUFBbEIsU0FBNkJFLElBQTdCLEVBQWI7QUFBQSxPQUFyQjtBQUNBLFVBQU1FLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxlQUFZLE9BQUtDLE9BQUwsQ0FBYUwsTUFBYixFQUFxQixNQUFyQixFQUE2Qk0sUUFBN0IsQ0FBWjtBQUFBLE9BQXhCOztBQUVBLFdBQUtSLEtBQUwsQ0FBV1MsS0FBWCxDQUFpQk4sWUFBakIsRUFBK0JHLGVBQS9CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7a0NBSWM7QUFDWixhQUFPLEtBQUtOLEtBQUwsQ0FBV1UsV0FBWCxFQUFQO0FBQ0Q7Ozs7O0FBR0gseUJBQWVDLFFBQWYsQ0FBd0JsQixVQUF4QixFQUFvQ0MsSUFBcEM7O2tCQUVlQSxJIiwiZmlsZSI6IlN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNTZXJ2ZXIgZnJvbSAnc3luYy9zZXJ2ZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ3N5bmMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhY3RzIGFzIHRoZSBtYXN0ZXIgY2xvY2sgcHJvdmlkZXIgZm9yIHRoZSBjbGllbnQgc3luYyBzZXJ2aWNlLFxuICogaW4gb3JkZXIgdG8gc3luY2hyb25pemUgdGhlIGNsb2NrcyBvZiB0aGUgZGlmZmVyZW50IGNsaWVudHMgdG8gaXRzIG93biBjbG9jay5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY30qX19cbiAqXG4gKiAqKk5vdGU6KiogdGhlIHNlcnZpY2UgaXMgYmFzZWQgb24gW2BnaXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jYF0oaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zeW5jKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG4gKi9cbmNsYXNzIFN5bmMgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHByb2Nlc3MuaHJ0aW1lKCk7XG5cbiAgICBjb25zdCBnZXRUaW1lRnVuY3Rpb24gPSAoKSA9PiB7XG4gICAgICBjb25zdCBub3cgPSBwcm9jZXNzLmhydGltZShzdGFydFRpbWUpO1xuICAgICAgcmV0dXJuIG5vd1swXSArIG5vd1sxXSAqIDFlLTk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jU2VydmVyKGdldFRpbWVGdW5jdGlvbik7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IHNlbmRGdW5jdGlvbiA9ICguLi5hcmdzKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAncG9uZycsIC4uLmFyZ3MpO1xuICAgIGNvbnN0IHJlY2VpdmVGdW5jdGlvbiA9IGNhbGxiYWNrID0+IHRoaXMucmVjZWl2ZShjbGllbnQsICdwaW5nJywgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fc3luYy5zdGFydChzZW5kRnVuY3Rpb24sIHJlY2VpdmVGdW5jdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLCBkZXJpdmVkIGZyb20gYHByb2Nlc3MuaHJ0aW1lKClgLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gQ3VycmVudCBzeW5jIHRpbWUgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRTeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jO1xuIl19