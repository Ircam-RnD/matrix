'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _events = require('events');

/** @private */

var _ControlItem = (function (_EventEmitter) {
  _inherits(_ControlItem, _EventEmitter);

  function _ControlItem(control, type, name, label) {
    var init = arguments.length <= 4 || arguments[4] === undefined ? undefined : arguments[4];
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, _ControlItem);

    _get(Object.getPrototypeOf(_ControlItem.prototype), 'constructor', this).call(this);

    this.control = control;
    this.clientTypes = clientTypes;

    this.data = {
      type: type,
      name: name,
      label: label,
      value: init
    };

    control.items[name] = this;
    control._itemData.push(this.data);
  }

  /** @private */

  _createClass(_ControlItem, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }, {
    key: 'update',
    value: function update() {
      var val = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
      var excludeClient = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var control = this.control;
      var data = this.data;

      this.set(val); // set value
      this.emit(data.name, data.value); // call item listeners
      control.broadcast(this.clientTypes, excludeClient, 'update', data.name, data.value); // send to clients
      control.emit('update', data.name, data.value); // call control listeners
    }
  }]);

  return _ControlItem;
})(_events.EventEmitter);

var _BooleanItem = (function (_ControlItem2) {
  _inherits(_BooleanItem, _ControlItem2);

  function _BooleanItem(control, name, label, init) {
    var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, _BooleanItem);

    _get(Object.getPrototypeOf(_BooleanItem.prototype), 'constructor', this).call(this, control, 'boolean', name, label, init, clientType);
  }

  /** @private */

  _createClass(_BooleanItem, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }]);

  return _BooleanItem;
})(_ControlItem);

var _EnumItem = (function (_ControlItem3) {
  _inherits(_EnumItem, _ControlItem3);

  function _EnumItem(control, name, label, options, init) {
    var clientTypes = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, _EnumItem);

    _get(Object.getPrototypeOf(_EnumItem.prototype), 'constructor', this).call(this, control, 'enum', name, label, init, clientTypes);

    this.data.options = options;
  }

  /** @private */

  _createClass(_EnumItem, [{
    key: 'set',
    value: function set(val) {
      var data = this.data;
      var index = data.options.indexOf(val);

      if (index >= 0) {
        data.value = val;
        data.index = index;
      }
    }
  }]);

  return _EnumItem;
})(_ControlItem);

var _NumberItem = (function (_ControlItem4) {
  _inherits(_NumberItem, _ControlItem4);

  function _NumberItem(control, name, label, min, max, step, init) {
    var clientTypes = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];

    _classCallCheck(this, _NumberItem);

    _get(Object.getPrototypeOf(_NumberItem.prototype), 'constructor', this).call(this, control, 'number', name, label, init, clientTypes);

    var data = this.data;
    data.min = min;
    data.max = max;
    data.step = step;
  }

  /** @private */

  _createClass(_NumberItem, [{
    key: 'set',
    value: function set(val) {
      this.data.value = Math.min(this.data.max, Math.max(this.data.min, val));
    }
  }]);

  return _NumberItem;
})(_ControlItem);

var _TextItem = (function (_ControlItem5) {
  _inherits(_TextItem, _ControlItem5);

  function _TextItem(control, name, label, init) {
    var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, _TextItem);

    _get(Object.getPrototypeOf(_TextItem.prototype), 'constructor', this).call(this, control, 'text', name, label, init, clientTypes);
  }

  /** @private */

  _createClass(_TextItem, [{
    key: 'set',
    value: function set(val) {
      this.data.value = val;
    }
  }]);

  return _TextItem;
})(_ControlItem);

var _TriggerItem = (function (_ControlItem6) {
  _inherits(_TriggerItem, _ControlItem6);

  function _TriggerItem(control, name, label) {
    var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    _classCallCheck(this, _TriggerItem);

    _get(Object.getPrototypeOf(_TriggerItem.prototype), 'constructor', this).call(this, control, 'trigger', name, label, undefined, clientTypes);
  }

  return _TriggerItem;
})(_ControlItem);

var SERVICE_ID = 'service:shared-params';

/**
 * [server] Manage the global `parameters`, `infos`, and `commands` across the whole scenario.
 *
 * The module keeps track of:
 * - `parameters`: values that can be updated by the actions of the clients (*e.g.* the gain of a synth);
 * - `infos`: information about the state of the scenario (*e.g.* number of clients in the performance);
 * - `commands`: can trigger an action (*e.g.* reload the page),
 * and propagates these to different client types.
 *
 * To set up controls in a scenario, you should extend this class on the server side and declare the controls specific to that scenario with the appropriate methods.
 *
 * (See also {@link src/client/ClientSharedParams.js~ClientSharedParams} on the client side.)
 *
 * @example // Example 1: make a `'conductor'` client to manage the controls
 * class MyControl extends ServerSharedParams {
 *   constructor() {
 *     super();
 *
 *     // Parameter shared by all the client types
 *     this.addNumber('synth:gain', 'Synth gain', 0, 1, 0.1, 1);
 *     // Command propagated only to the `'player'` clients
 *     this.addCommand('reload', 'Reload the page', ['player']);
 *   }
 * }
 *
 * @example // Example 2: keep track of the number of `'player'` clients
 * class MyControl extends Control {
 *   constructor() {
 *     super();
 *     this.addInfo('numPlayers', 'Number of players', 0);
 *   }
 * }
 *
 * class MyPerformance extends Performance {
 *   constructor(control) {
 *     this._control = control;
 *   }
 *
 *   enter(client) {
 *     super.enter(client);
 *
 *     this._control.update('numPlayers', this.clients.length);
 *   }
 * }
 *
 * const control = new MyControl();
 * const performance = new MyPerformance(control);
 */

var ServerSharedParams = (function (_ServerActivity) {
  _inherits(ServerSharedParams, _ServerActivity);

  function ServerSharedParams() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerSharedParams);

    _get(Object.getPrototypeOf(ServerSharedParams.prototype), 'constructor', this).call(this, SERVICE_ID);

    /**
     * Dictionary of all control items.
     * @type {Object}
     */
    this.items = {};

    /**
     * Array of item data cells.
     * @type {Array}
     */
    this._itemData = [];
  }

  _createClass(ServerSharedParams, [{
    key: 'addItem',
    value: function addItem() {
      var args = _Array$from(arguments);
      var type = args.shift();
      var item = undefined;

      switch (type) {
        case 'boolean':
          item = this.addBool.apply(this, _toConsumableArray(args));
          break;
        case 'enum':
          item = this.addEnum.apply(this, _toConsumableArray(args));
          break;
        case 'number':
          item = this.addNumber.apply(this, _toConsumableArray(args));
          break;
        case 'text':
          item = this.addText.apply(this, _toConsumableArray(args));
          break;
        case 'trigger':
          item = this.addTrigger.apply(this, _toConsumableArray(args));
          break;
      }

      return item;
    }

    /**
     * Adds a `boolean` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} init - Initial value of the parameter (`true` or `false`).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addBoolean',
    value: function addBoolean(name, label, init) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      return new _BooleanItem(this, name, label, init, clientTypes);
    }

    /**
     * Adds an `enum` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
     * @param {String[]} options - Array of the different values the parameter can take.
     * @param {Number} init - Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addEnum',
    value: function addEnum(name, label, options, init) {
      var clientTypes = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      return new _EnumItem(this, name, label, options, init, clientTypes);
    }

    /**
     * Adds a `number` parameter.
     * @param {String} name Name of the parameter.
     * @param {String} label Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} min - Minimum value of the parameter.
     * @param {Number} max - Maximum value of the parameter.
     * @param {Number} step - Step to increase or decrease the parameter value.
     * @param {Number} init - Initial value of the parameter.
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addNumber',
    value: function addNumber(name, label, min, max, step, init) {
      var clientTypes = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

      return new _NumberItem(this, name, label, min, max, step, init, clientTypes);
    }

    /**
     * Adds a `text` parameter.
     * @param {String} name - Name of the parameter.
     * @param {String} label - Label of the parameter (displayed on the control GUI on the client side).
     * @param {Number} init - Initial value of the parameter (has to be in the `options` array).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addText',
    value: function addText(name, label, init) {
      var clientTypes = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      return new _TextItem(this, name, label, init, clientTypes);
    }

    /**
     * Adds a trigger.
     * @param {String} name - Name of the command.
     * @param {String} label - Label of the command (displayed on the control GUI on the client side).
     * @param {String[]} [clientTypes=null] - Array of the client types to send the parameter to. If not set, the parameter is sent to all the client types.
     */
  }, {
    key: 'addTrigger',
    value: function addTrigger(name, label) {
      var clientTypes = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      return new _TriggerItem(this, name, label, undefined, clientTypes);
    }

    /**
     * Add listener to a control item (i.e. parameter, info or command).
     * The given listener is fired immediately with the item current value.
     * @param {String} name - Name of the item.
     * @param {Function} listener - Listener callback.
     */
  }, {
    key: 'addItemListener',
    value: function addItemListener(name, listener) {
      var item = this.items[name];

      if (item) {
        item.addListener(item.data.name, listener);
        listener(item.data.value);
      } else {
        console.log('unknown shared parameter "' + name + '"');
      }
    }

    /**
     * Remove listener from a control item (i.e. parameter, info or command).
     * @param {String} name - Name of the item.
     * @param {Function} listener - Listener callback.
     */
  }, {
    key: 'removeItemListener',
    value: function removeItemListener(name, listener) {
      var item = this.items[name];

      if (item) item.removeListener(item.data.name, listener);else console.log('unknown shared parameter "' + name + '"');
    }

    /**
     * Updates the value of a parameter and sends it to the clients.
     * @param {String} name - Name of the parameter to update.
     * @param {(String|Number|Boolean)} value - New value of the parameter.
     */
  }, {
    key: 'update',
    value: function update(name, value) {
      var excludeClient = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var item = this.items[name];

      if (item) item.update(value, excludeClient);else console.log('unknown shared parameter  "' + name + '"');
    }

    /** @private */
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerSharedParams.prototype), 'connect', this).call(this, client);

      // init control parameters, infos, and commands at client
      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'update', this._onUpdate(client));
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this = this;

      return function () {
        return _this.send(client, 'init', _this._itemData);
      };
    }
  }, {
    key: '_onUpdate',
    value: function _onUpdate(client) {
      var _this2 = this;

      // update, but exclude client from broadcasting to other clients
      return function (name, value) {
        return _this2.update(name, value, client);
      };
    }
  }]);

  return ServerSharedParams;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerSharedParams);

exports['default'] = ServerSharedParams;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU2hhcmVkUGFyYW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OztzQkFDbEMsUUFBUTs7OztJQUcvQixZQUFZO1lBQVosWUFBWTs7QUFDTCxXQURQLFlBQVksQ0FDSixPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQXdDO1FBQXRDLElBQUkseURBQUcsU0FBUztRQUFFLFdBQVcseURBQUcsSUFBSTs7MEJBRHhFLFlBQVk7O0FBRWQsK0JBRkUsWUFBWSw2Q0FFTjs7QUFFUixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLElBQUksR0FBRztBQUNWLFVBQUksRUFBRSxJQUFJO0FBQ1YsVUFBSSxFQUFFLElBQUk7QUFDVixXQUFLLEVBQUUsS0FBSztBQUNaLFdBQUssRUFBRSxJQUFJO0tBQ1osQ0FBQzs7QUFFRixXQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQixXQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbkM7Ozs7ZUFoQkcsWUFBWTs7V0FrQmIsYUFBQyxHQUFHLEVBQUU7QUFDUCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDdkI7OztXQUVLLGtCQUF3QztVQUF2QyxHQUFHLHlEQUFHLFNBQVM7VUFBRSxhQUFhLHlEQUFHLElBQUk7O0FBQzFDLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDM0IsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFFckIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNkLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsYUFBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEYsYUFBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDL0M7OztTQTlCRyxZQUFZOzs7SUFrQ1osWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFzQjtRQUFwQixXQUFXLHlEQUFHLElBQUk7OzBCQUR0RCxZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRVIsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7R0FDMUQ7Ozs7ZUFIRyxZQUFZOztXQUtiLGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQ3ZCOzs7U0FQRyxZQUFZO0dBQVMsWUFBWTs7SUFXakMsU0FBUztZQUFULFNBQVM7O0FBQ0YsV0FEUCxTQUFTLENBQ0QsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBc0I7UUFBcEIsV0FBVyx5REFBRyxJQUFJOzswQkFEL0QsU0FBUzs7QUFFWCwrQkFGRSxTQUFTLDZDQUVMLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFOztBQUV2RCxRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7R0FDN0I7Ozs7ZUFMRyxTQUFTOztXQU9WLGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNyQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdEMsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsWUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7T0FDcEI7S0FDRjs7O1NBZkcsU0FBUztHQUFTLFlBQVk7O0lBbUI5QixXQUFXO1lBQVgsV0FBVzs7QUFDSixXQURQLFdBQVcsQ0FDSCxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQXNCO1FBQXBCLFdBQVcseURBQUcsSUFBSTs7MEJBRHRFLFdBQVc7O0FBRWIsK0JBRkUsV0FBVyw2Q0FFUCxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTs7QUFFekQsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNyQixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7R0FDbEI7Ozs7ZUFSRyxXQUFXOztXQVVaLGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDekU7OztTQVpHLFdBQVc7R0FBUyxZQUFZOztJQWdCaEMsU0FBUztZQUFULFNBQVM7O0FBQ0YsV0FEUCxTQUFTLENBQ0QsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFzQjtRQUFwQixXQUFXLHlEQUFHLElBQUk7OzBCQUR0RCxTQUFTOztBQUVYLCtCQUZFLFNBQVMsNkNBRUwsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7R0FDeEQ7Ozs7ZUFIRyxTQUFTOztXQUtWLGFBQUMsR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQ3ZCOzs7U0FQRyxTQUFTO0dBQVMsWUFBWTs7SUFXOUIsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLENBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQXNCO1FBQXBCLFdBQVcseURBQUcsSUFBSTs7MEJBRGhELFlBQVk7O0FBRWQsK0JBRkUsWUFBWSw2Q0FFUixPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRTtHQUNoRTs7U0FIRyxZQUFZO0dBQVMsWUFBWTs7QUFPdkMsSUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtEckMsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDWCxXQURQLGtCQUFrQixHQUNJO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFEcEIsa0JBQWtCOztBQUVwQiwrQkFGRSxrQkFBa0IsNkNBRWQsVUFBVSxFQUFFOzs7Ozs7QUFNbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7Ozs7OztBQU1oQixRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztHQUNyQjs7ZUFmRyxrQkFBa0I7O1dBaUJmLG1CQUFHO0FBQ1IsVUFBTSxJQUFJLEdBQUcsWUFBVyxTQUFTLENBQUMsQ0FBQztBQUNuQyxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDMUIsVUFBSSxJQUFJLFlBQUEsQ0FBQzs7QUFFVCxjQUFPLElBQUk7QUFDVCxhQUFLLFNBQVM7QUFDWixjQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sTUFBQSxDQUFaLElBQUkscUJBQVksSUFBSSxFQUFDLENBQUM7QUFDN0IsZ0JBQU07QUFBQSxBQUNSLGFBQUssTUFBTTtBQUNULGNBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxNQUFBLENBQVosSUFBSSxxQkFBWSxJQUFJLEVBQUMsQ0FBQztBQUM3QixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxRQUFRO0FBQ1gsY0FBSSxHQUFHLElBQUksQ0FBQyxTQUFTLE1BQUEsQ0FBZCxJQUFJLHFCQUFjLElBQUksRUFBQyxDQUFDO0FBQy9CLGdCQUFNO0FBQUEsQUFDUixhQUFLLE1BQU07QUFDVCxjQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sTUFBQSxDQUFaLElBQUkscUJBQVksSUFBSSxFQUFDLENBQUM7QUFDN0IsZ0JBQU07QUFBQSxBQUNSLGFBQUssU0FBUztBQUNaLGNBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxNQUFBLENBQWYsSUFBSSxxQkFBZSxJQUFJLEVBQUMsQ0FBQztBQUNoQyxnQkFBTTtBQUFBLE9BQ1Q7O0FBRUQsYUFBTyxJQUFJLENBQUM7S0FDYjs7Ozs7Ozs7Ozs7V0FTUyxvQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUM5QyxhQUFPLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztLQUMvRDs7Ozs7Ozs7Ozs7O1dBVU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQ3BELGFBQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztLQUNyRTs7Ozs7Ozs7Ozs7Ozs7V0FZUSxtQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUM3RCxhQUFPLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztLQUM5RTs7Ozs7Ozs7Ozs7V0FTTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUMzQyxhQUFPLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztLQUM1RDs7Ozs7Ozs7OztXQVFTLG9CQUFDLElBQUksRUFBRSxLQUFLLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDeEMsYUFBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDcEU7Ozs7Ozs7Ozs7V0FRYyx5QkFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQzlCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLFVBQUksSUFBSSxFQUFFO0FBQ1IsWUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzQyxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDM0IsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO09BQ3hEO0tBQ0Y7Ozs7Ozs7OztXQU9pQiw0QkFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlCLFVBQUksSUFBSSxFQUNOLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FFOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDMUQ7Ozs7Ozs7OztXQU9LLGdCQUFDLElBQUksRUFBRSxLQUFLLEVBQXdCO1VBQXRCLGFBQWEseURBQUcsSUFBSTs7QUFDdEMsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUIsVUFBSSxJQUFJLEVBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUMsS0FFbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDM0Q7Ozs7O1dBR00saUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBcEpFLGtCQUFrQix5Q0FvSk4sTUFBTSxFQUFFOzs7QUFHdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ3hEOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7OztBQUNqQixhQUFPO2VBQU0sTUFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFLLFNBQVMsQ0FBQztPQUFBLENBQUM7S0FDeEQ7OztXQUVRLG1CQUFDLE1BQU0sRUFBRTs7OztBQUVoQixhQUFPLFVBQUMsSUFBSSxFQUFFLEtBQUs7ZUFBSyxPQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztPQUFBLENBQUM7S0FDMUQ7OztTQWxLRyxrQkFBa0I7OztBQXFLeEIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7cUJBRS9DLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclNoYXJlZFBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0NvbnRyb2xJdGVtIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgdHlwZSwgbmFtZSwgbGFiZWwsIGluaXQgPSB1bmRlZmluZWQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuICAgIHRoaXMuY2xpZW50VHlwZXMgPSBjbGllbnRUeXBlcztcblxuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdmFsdWU6IGluaXQsXG4gICAgfTtcblxuICAgIGNvbnRyb2wuaXRlbXNbbmFtZV0gPSB0aGlzO1xuICAgIGNvbnRyb2wuX2l0ZW1EYXRhLnB1c2godGhpcy5kYXRhKTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSB2YWw7XG4gIH1cblxuICB1cGRhdGUodmFsID0gdW5kZWZpbmVkLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGxldCBjb250cm9sID0gdGhpcy5jb250cm9sO1xuICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuXG4gICAgdGhpcy5zZXQodmFsKTsgLy8gc2V0IHZhbHVlXG4gICAgdGhpcy5lbWl0KGRhdGEubmFtZSwgZGF0YS52YWx1ZSk7IC8vIGNhbGwgaXRlbSBsaXN0ZW5lcnNcbiAgICBjb250cm9sLmJyb2FkY2FzdCh0aGlzLmNsaWVudFR5cGVzLCBleGNsdWRlQ2xpZW50LCAndXBkYXRlJywgZGF0YS5uYW1lLCBkYXRhLnZhbHVlKTsgLy8gc2VuZCB0byBjbGllbnRzXG4gICAgY29udHJvbC5lbWl0KCd1cGRhdGUnLCBkYXRhLm5hbWUsIGRhdGEudmFsdWUpOyAvLyBjYWxsIGNvbnRyb2wgbGlzdGVuZXJzXG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhbkl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgc3VwZXIoY29udHJvbCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0VudW1JdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIG9wdGlvbnMsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdlbnVtJywgbmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzKTtcblxuICAgIHRoaXMuZGF0YS5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBsZXQgaW5kZXggPSBkYXRhLm9wdGlvbnMuaW5kZXhPZih2YWwpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGRhdGEudmFsdWUgPSB2YWw7XG4gICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX051bWJlckl0ZW0gZXh0ZW5kcyBfQ29udHJvbEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICdudW1iZXInLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuXG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgZGF0YS5taW4gPSBtaW47XG4gICAgZGF0YS5tYXggPSBtYXg7XG4gICAgZGF0YS5zdGVwID0gc3RlcDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmRhdGEudmFsdWUgPSBNYXRoLm1pbih0aGlzLmRhdGEubWF4LCBNYXRoLm1heCh0aGlzLmRhdGEubWluLCB2YWwpKTtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UZXh0SXRlbSBleHRlbmRzIF9Db250cm9sSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICBzdXBlcihjb250cm9sLCAndGV4dCcsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5kYXRhLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RyaWdnZXJJdGVtIGV4dGVuZHMgX0NvbnRyb2xJdGVtIHtcbiAgY29uc3RydWN0b3IoY29udHJvbCwgbmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHN1cGVyKGNvbnRyb2wsICd0cmlnZ2VyJywgbmFtZSwgbGFiZWwsIHVuZGVmaW5lZCwgY2xpZW50VHlwZXMpO1xuICB9XG59XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1wYXJhbXMnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIE1hbmFnZSB0aGUgZ2xvYmFsIGBwYXJhbWV0ZXJzYCwgYGluZm9zYCwgYW5kIGBjb21tYW5kc2AgYWNyb3NzIHRoZSB3aG9sZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGtlZXBzIHRyYWNrIG9mOlxuICogLSBgcGFyYW1ldGVyc2A6IHZhbHVlcyB0aGF0IGNhbiBiZSB1cGRhdGVkIGJ5IHRoZSBhY3Rpb25zIG9mIHRoZSBjbGllbnRzICgqZS5nLiogdGhlIGdhaW4gb2YgYSBzeW50aCk7XG4gKiAtIGBpbmZvc2A6IGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdGF0ZSBvZiB0aGUgc2NlbmFyaW8gKCplLmcuKiBudW1iZXIgb2YgY2xpZW50cyBpbiB0aGUgcGVyZm9ybWFuY2UpO1xuICogLSBgY29tbWFuZHNgOiBjYW4gdHJpZ2dlciBhbiBhY3Rpb24gKCplLmcuKiByZWxvYWQgdGhlIHBhZ2UpLFxuICogYW5kIHByb3BhZ2F0ZXMgdGhlc2UgdG8gZGlmZmVyZW50IGNsaWVudCB0eXBlcy5cbiAqXG4gKiBUbyBzZXQgdXAgY29udHJvbHMgaW4gYSBzY2VuYXJpbywgeW91IHNob3VsZCBleHRlbmQgdGhpcyBjbGFzcyBvbiB0aGUgc2VydmVyIHNpZGUgYW5kIGRlY2xhcmUgdGhlIGNvbnRyb2xzIHNwZWNpZmljIHRvIHRoYXQgc2NlbmFyaW8gd2l0aCB0aGUgYXBwcm9wcmlhdGUgbWV0aG9kcy5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50U2hhcmVkUGFyYW1zLmpzfkNsaWVudFNoYXJlZFBhcmFtc30gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSAvLyBFeGFtcGxlIDE6IG1ha2UgYSBgJ2NvbmR1Y3RvcidgIGNsaWVudCB0byBtYW5hZ2UgdGhlIGNvbnRyb2xzXG4gKiBjbGFzcyBNeUNvbnRyb2wgZXh0ZW5kcyBTZXJ2ZXJTaGFyZWRQYXJhbXMge1xuICogICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICBzdXBlcigpO1xuICpcbiAqICAgICAvLyBQYXJhbWV0ZXIgc2hhcmVkIGJ5IGFsbCB0aGUgY2xpZW50IHR5cGVzXG4gKiAgICAgdGhpcy5hZGROdW1iZXIoJ3N5bnRoOmdhaW4nLCAnU3ludGggZ2FpbicsIDAsIDEsIDAuMSwgMSk7XG4gKiAgICAgLy8gQ29tbWFuZCBwcm9wYWdhdGVkIG9ubHkgdG8gdGhlIGAncGxheWVyJ2AgY2xpZW50c1xuICogICAgIHRoaXMuYWRkQ29tbWFuZCgncmVsb2FkJywgJ1JlbG9hZCB0aGUgcGFnZScsIFsncGxheWVyJ10pO1xuICogICB9XG4gKiB9XG4gKlxuICogQGV4YW1wbGUgLy8gRXhhbXBsZSAyOiBrZWVwIHRyYWNrIG9mIHRoZSBudW1iZXIgb2YgYCdwbGF5ZXInYCBjbGllbnRzXG4gKiBjbGFzcyBNeUNvbnRyb2wgZXh0ZW5kcyBDb250cm9sIHtcbiAqICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgc3VwZXIoKTtcbiAqICAgICB0aGlzLmFkZEluZm8oJ251bVBsYXllcnMnLCAnTnVtYmVyIG9mIHBsYXllcnMnLCAwKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGNsYXNzIE15UGVyZm9ybWFuY2UgZXh0ZW5kcyBQZXJmb3JtYW5jZSB7XG4gKiAgIGNvbnN0cnVjdG9yKGNvbnRyb2wpIHtcbiAqICAgICB0aGlzLl9jb250cm9sID0gY29udHJvbDtcbiAqICAgfVxuICpcbiAqICAgZW50ZXIoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuZW50ZXIoY2xpZW50KTtcbiAqXG4gKiAgICAgdGhpcy5fY29udHJvbC51cGRhdGUoJ251bVBsYXllcnMnLCB0aGlzLmNsaWVudHMubGVuZ3RoKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgTXlDb250cm9sKCk7XG4gKiBjb25zdCBwZXJmb3JtYW5jZSA9IG5ldyBNeVBlcmZvcm1hbmNlKGNvbnRyb2wpO1xuICovXG5jbGFzcyBTZXJ2ZXJTaGFyZWRQYXJhbXMgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgLyoqXG4gICAgICogRGljdGlvbmFyeSBvZiBhbGwgY29udHJvbCBpdGVtcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuaXRlbXMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGl0ZW0gZGF0YSBjZWxscy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5faXRlbURhdGEgPSBbXTtcbiAgfVxuXG4gIGFkZEl0ZW0oKSB7XG4gICAgY29uc3QgYXJncyA9IEFycmF5LmZyb20oYXJndW1lbnRzKTtcbiAgICBjb25zdCB0eXBlID0gYXJncy5zaGlmdCgpO1xuICAgIGxldCBpdGVtO1xuXG4gICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBpdGVtID0gdGhpcy5hZGRCb29sKC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICBpdGVtID0gdGhpcy5hZGRFbnVtKC4uLmFyZ3MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGl0ZW0gPSB0aGlzLmFkZE51bWJlciguLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgaXRlbSA9IHRoaXMuYWRkVGV4dCguLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0cmlnZ2VyJzpcbiAgICAgICAgaXRlbSA9IHRoaXMuYWRkVHJpZ2dlciguLi5hcmdzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGBib29sZWFuYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgcGFyYW1ldGVyIChkaXNwbGF5ZWQgb24gdGhlIGNvbnRyb2wgR1VJIG9uIHRoZSBjbGllbnQgc2lkZSkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChgdHJ1ZWAgb3IgYGZhbHNlYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRCb29sZWFuKG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9Cb29sZWFuSXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gYGVudW1gIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gb3B0aW9ucyAtIEFycmF5IG9mIHRoZSBkaWZmZXJlbnQgdmFsdWVzIHRoZSBwYXJhbWV0ZXIgY2FuIHRha2UuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIChoYXMgdG8gYmUgaW4gdGhlIGBvcHRpb25zYCBhcnJheSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtjbGllbnRUeXBlcz1udWxsXSAtIEFycmF5IG9mIHRoZSBjbGllbnQgdHlwZXMgdG8gc2VuZCB0aGUgcGFyYW1ldGVyIHRvLiBJZiBub3Qgc2V0LCB0aGUgcGFyYW1ldGVyIGlzIHNlbnQgdG8gYWxsIHRoZSBjbGllbnQgdHlwZXMuXG4gICAqL1xuICBhZGRFbnVtKG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0LCBjbGllbnRUeXBlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IF9FbnVtSXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgb3B0aW9ucywgaW5pdCwgY2xpZW50VHlwZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgbnVtYmVyYCBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1pbiAtIE1pbmltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1heCAtIE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0ZXAgLSBTdGVwIHRvIGluY3JlYXNlIG9yIGRlY3JlYXNlIHRoZSBwYXJhbWV0ZXIgdmFsdWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbml0IC0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbY2xpZW50VHlwZXM9bnVsbF0gLSBBcnJheSBvZiB0aGUgY2xpZW50IHR5cGVzIHRvIHNlbmQgdGhlIHBhcmFtZXRlciB0by4gSWYgbm90IHNldCwgdGhlIHBhcmFtZXRlciBpcyBzZW50IHRvIGFsbCB0aGUgY2xpZW50IHR5cGVzLlxuICAgKi9cbiAgYWRkTnVtYmVyKG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCwgY2xpZW50VHlwZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBfTnVtYmVySXRlbSh0aGlzLCBuYW1lLCBsYWJlbCwgbWluLCBtYXgsIHN0ZXAsIGluaXQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYHRleHRgIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSBwYXJhbWV0ZXIgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluaXQgLSBJbml0aWFsIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgKGhhcyB0byBiZSBpbiB0aGUgYG9wdGlvbnNgIGFycmF5KS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFRleHQobmFtZSwgbGFiZWwsIGluaXQsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX1RleHRJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCBpbml0LCBjbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRyaWdnZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgY29tbWFuZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgb2YgdGhlIGNvbW1hbmQgKGRpc3BsYXllZCBvbiB0aGUgY29udHJvbCBHVUkgb24gdGhlIGNsaWVudCBzaWRlKS5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW2NsaWVudFR5cGVzPW51bGxdIC0gQXJyYXkgb2YgdGhlIGNsaWVudCB0eXBlcyB0byBzZW5kIHRoZSBwYXJhbWV0ZXIgdG8uIElmIG5vdCBzZXQsIHRoZSBwYXJhbWV0ZXIgaXMgc2VudCB0byBhbGwgdGhlIGNsaWVudCB0eXBlcy5cbiAgICovXG4gIGFkZFRyaWdnZXIobmFtZSwgbGFiZWwsIGNsaWVudFR5cGVzID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgX1RyaWdnZXJJdGVtKHRoaXMsIG5hbWUsIGxhYmVsLCB1bmRlZmluZWQsIGNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbGlzdGVuZXIgdG8gYSBjb250cm9sIGl0ZW0gKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBUaGUgZ2l2ZW4gbGlzdGVuZXIgaXMgZmlyZWQgaW1tZWRpYXRlbHkgd2l0aCB0aGUgaXRlbSBjdXJyZW50IHZhbHVlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGl0ZW0uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICBhZGRJdGVtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tuYW1lXTtcblxuICAgIGlmIChpdGVtKSB7XG4gICAgICBpdGVtLmFkZExpc3RlbmVyKGl0ZW0uZGF0YS5uYW1lLCBsaXN0ZW5lcik7XG4gICAgICBsaXN0ZW5lcihpdGVtLmRhdGEudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygndW5rbm93biBzaGFyZWQgcGFyYW1ldGVyIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVyIGZyb20gYSBjb250cm9sIGl0ZW0gKGkuZS4gcGFyYW1ldGVyLCBpbmZvIG9yIGNvbW1hbmQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGl0ZW0uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIC0gTGlzdGVuZXIgY2FsbGJhY2suXG4gICAqL1xuICByZW1vdmVJdGVtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tuYW1lXTtcblxuICAgIGlmIChpdGVtKVxuICAgICAgaXRlbS5yZW1vdmVMaXN0ZW5lcihpdGVtLmRhdGEubmFtZSwgbGlzdGVuZXIpO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHNoYXJlZCBwYXJhbWV0ZXIgXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFuZCBzZW5kcyBpdCB0byB0aGUgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0geyhTdHJpbmd8TnVtYmVyfEJvb2xlYW4pfSB2YWx1ZSAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgdXBkYXRlKG5hbWUsIHZhbHVlLCBleGNsdWRlQ2xpZW50ID0gbnVsbCkge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW25hbWVdO1xuXG4gICAgaWYgKGl0ZW0pXG4gICAgICBpdGVtLnVwZGF0ZSh2YWx1ZSwgZXhjbHVkZUNsaWVudCk7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciAgXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gaW5pdCBjb250cm9sIHBhcmFtZXRlcnMsIGluZm9zLCBhbmQgY29tbWFuZHMgYXQgY2xpZW50XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3VwZGF0ZScsIHRoaXMuX29uVXBkYXRlKGNsaWVudCkpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2luaXQnLCB0aGlzLl9pdGVtRGF0YSk7XG4gIH1cblxuICBfb25VcGRhdGUoY2xpZW50KSB7XG4gICAgLy8gdXBkYXRlLCBidXQgZXhjbHVkZSBjbGllbnQgZnJvbSBicm9hZGNhc3RpbmcgdG8gb3RoZXIgY2xpZW50c1xuICAgIHJldHVybiAobmFtZSwgdmFsdWUpID0+IHRoaXMudXBkYXRlKG5hbWUsIHZhbHVlLCBjbGllbnQpO1xuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlclNoYXJlZFBhcmFtcyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlclNoYXJlZFBhcmFtcztcbiJdfQ==