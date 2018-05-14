'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _klaw = require('klaw');

var _klaw2 = _interopRequireDefault(_klaw);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:file-system';
var cwd = process.cwd();
var isString = function isString(value) {
  return typeof value === 'string' || value instanceof String;
};

/**
 * Interface for the server `'file-system'` service.
 *
 * This service allow to retrieve a list of files or directories from a given path.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.FileSystem}*__
 *
 * @memberof module:soundworks/server
 * @example
 * this.fileSystem = this.require('file-system');
 */

var FileSystem = function (_Service) {
  (0, _inherits3.default)(FileSystem, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function FileSystem() {
    (0, _classCallCheck3.default)(this, FileSystem);

    var _this = (0, _possibleConstructorReturn3.default)(this, (FileSystem.__proto__ || (0, _getPrototypeOf2.default)(FileSystem)).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'publicDirectory',
      enableCache: true
    };

    _this.configure(defaults);

    _this._cache = []; // keep results in cache to avoid too much I/O calls
    _this._sharedConfig = _this.require('shared-config');
    return _this;
  }

  (0, _createClass3.default)(FileSystem, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(FileSystem.prototype.__proto__ || (0, _getPrototypeOf2.default)(FileSystem.prototype), 'start', this).call(this);

      var configItem = this.options.configItem;
      this._publicDir = this._sharedConfig.get(configItem);

      if (!this._publicDir) throw new Error('"' + SERVICE_ID + '": server.config.' + configItem + ' is not defined');

      this._enableCache = !!this.options.enableCache;

      this.ready();
    }
  }, {
    key: 'connect',
    value: function connect(client) {
      this.receive(client, 'request', this._onRequest(client));
    }

    /**
     * @typedef {Object} module:soundworks/server.FileSystem~ListConfig
     * @property {String} path - Name of the folder to search into.
     * @property {RegExp} [match='*'] - RegExp used to filter the results.
     * @property {Boolean} [recursive=false] - Define if the search should be
     *  recursive.
     * @property {Boolean} [directories=false] - If true only return directories,
     *  files otherwise.
     */
    /**
     * Return a list of files according to the given configuration.
     *
     * @param {String|module:soundworks/server.FileSystem~ListConfig|Array<String>|Array<module:soundworks/server.FileSystem~ListConfig>} config -
     *  Details of the requested file list(s).
     * @return {Promise<Array>|Promise<Array<Array>>} - Promise resolving with an
     *  an array containing the absolute paths of the files / directories.
     *  If `config` is an array, the results will be an array of arrays
     *  containing the result of each different request.
     *
     * @example:
     * // 1. Single list
     * // retrieve all the file in a folder
     * fileSystem.getList('my-directory').then((files) => ... );
     * // or, retrieve all the `.wav` files inside a given folder, search recursively
     * fileSystem.getList({
     *   path: 'my-directory',
     *   match: /\.wav/,
     *   recursive: true,
     * }).then((files) => ... );
     *
     * // 2. Multiple Requests
     * // retrieve all the file in 2 different folders, the returned value will be
     * // an array containing the 2 file lists
     * fileSystem.getList(['my-directory1', 'my-directory2'])
     *   .then((arrayList) => ... );
     * // or
     * fileSystem.getList([{ ... }, { ... }])
     *   .then((arrayList) => ... );
     */

  }, {
    key: 'getList',
    value: function getList(config) {
      var _this2 = this;

      var returnAll = true;

      if (!Array.isArray(config)) {
        config = [config];
        returnAll = false;
      }

      var stack = config.map(function (item) {
        if (isString(item)) item = { path: item };

        var _item = item,
            path = _item.path,
            match = _item.match,
            recursive = _item.recursive,
            directories = _item.directories;

        return _this2._getList(path, match, recursive, directories);
      });

      if (returnAll === false) return stack[0]; // a single promise
      else return _promise2.default.all(stack);
    }

    /**
     * Return a list of files inside a given directory.
     *
     * @param {String} path - The directory to search into.
     * @param {RegExp} [match='*'] - A RegExp to filter the results (the
     *  wildcard '*' is accepted).
     * @param {Boolean} [recursive=false] - Define if the search should be
     *  recursive or not
     * @param {Boolean} [directories=false] - Define if the result should contain
     *  a list of files or a list of directories.
     * @return {Array}
     * @private
     */

  }, {
    key: '_getList',
    value: function _getList() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';

      var _this3 = this;

      var recursive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var directories = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (path === null) throw new Error(SERVICE_ID + ' - path not defined');

      // wilcard
      if (match === '*') match = /.*/;

      var key = path + ':' + match + ':' + recursive + ':' + directories;

      if (this._enableCache && this._cache[key]) return _promise2.default.resolve(this._cache[key]);

      var testCwd = new RegExp('^' + cwd);
      var dir = _path3.default.normalize(path);
      var results = [];

      // make the given path absolute if not
      if (!dir.startsWith(cwd) && !testCwd.test(dir)) dir = _path3.default.join(cwd, dir);

      // console.log(dir);
      var promise = new _promise2.default(function (resolve, reject) {
        (0, _klaw2.default)(dir).on('data', function (item) {
          var basename = _path3.default.basename(item.path);
          var dirname = _path3.default.dirname(item.path);

          if (
          // ignore current directory
          item.path === dir ||
          // ignore common hidden system file patterns
          basename === 'thumbs.db' || /^\./.test(basename) === true) {
            return;
          }

          if (directories && item.stats.isDirectory() || !directories && item.stats.isFile()) {
            if (recursive || !recursive && dirname === dir) results.push(item.path);
          }
        }).on('end', function () {
          // remove `dir` from the paths and test against the regExp
          results = results.filter(function (entry) {
            entry = entry.replace(_path3.default.join(dir, _path3.default.sep), '');
            return match.test(entry);
          });

          // keep in cache and resolve promise
          if (_this3._enableCache) _this3._cache[key] = results;

          resolve(results);
        }).on('error', function (err) {
          console.error(SERVICE_ID, '-', err.message);
        });
      });

      return promise;
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this4 = this;

      return function (id, config) {
        // unserialize the json config to return proper RegExp, adapted from:
        // http://stackoverflow.com/questions/12075927/serialization-of-regexp#answer-33416684
        config = JSON.parse(config, function (key, value) {
          if (key === 'match' && value.toString().indexOf('__REGEXP ') === 0) {
            var fragments = value.split('__REGEXP ')[1].match(/\/(.*?)\/([gimy])?$/);
            var pattern = fragments[1].replace('\\\\', '\\');
            var flag = fragments[2] || '';
            return new RegExp(pattern, flag);
          } else {
            return value;
          }
        });

        var testCwd = new RegExp('^' + cwd);
        var publicDir = _this4._publicDir;

        if (!publicDir.startsWith(cwd) && !testCwd.test(publicDir)) publicDir = _path3.default.join(cwd, publicDir);

        // force the search in the public directory
        function prependPath(item) {
          if (Array.isArray(item)) return item.map(prependPath);

          if (isString(item)) item = _path3.default.join(publicDir, item);else item.path = _path3.default.join(publicDir, item.path);

          return item;
        }

        config = prependPath(config);

        // get results
        _this4.getList(config).then(function (results) {
          function formatToUrl(entry) {
            if (Array.isArray(entry)) return entry.map(formatToUrl);

            entry = entry.replace(publicDir, '');
            entry = entry.replace('\\', '/'); // window paths to url

            if (!/^\//.test(entry)) entry = '/' + entry;

            return entry;
          }

          // remove all file system informations and create an absolute url
          results = formatToUrl(results);

          _this4.send(client, 'list:' + id, results);
        }).catch(function (err) {
          return console.error(err.stack);
        });
      };
    }
  }]);
  return FileSystem;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, FileSystem);

exports.default = FileSystem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbGVTeXN0ZW0uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsImN3ZCIsInByb2Nlc3MiLCJpc1N0cmluZyIsInZhbHVlIiwiU3RyaW5nIiwiRmlsZVN5c3RlbSIsImRlZmF1bHRzIiwiY29uZmlnSXRlbSIsImVuYWJsZUNhY2hlIiwiY29uZmlndXJlIiwiX2NhY2hlIiwiX3NoYXJlZENvbmZpZyIsInJlcXVpcmUiLCJvcHRpb25zIiwiX3B1YmxpY0RpciIsImdldCIsIkVycm9yIiwiX2VuYWJsZUNhY2hlIiwicmVhZHkiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsImNvbmZpZyIsInJldHVybkFsbCIsIkFycmF5IiwiaXNBcnJheSIsInN0YWNrIiwibWFwIiwiaXRlbSIsInBhdGgiLCJtYXRjaCIsInJlY3Vyc2l2ZSIsImRpcmVjdG9yaWVzIiwiX2dldExpc3QiLCJhbGwiLCJrZXkiLCJyZXNvbHZlIiwidGVzdEN3ZCIsIlJlZ0V4cCIsImRpciIsIm5vcm1hbGl6ZSIsInJlc3VsdHMiLCJzdGFydHNXaXRoIiwidGVzdCIsImpvaW4iLCJwcm9taXNlIiwicmVqZWN0Iiwib24iLCJiYXNlbmFtZSIsImRpcm5hbWUiLCJzdGF0cyIsImlzRGlyZWN0b3J5IiwiaXNGaWxlIiwicHVzaCIsImZpbHRlciIsImVudHJ5IiwicmVwbGFjZSIsInNlcCIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsIm1lc3NhZ2UiLCJpZCIsIkpTT04iLCJwYXJzZSIsInRvU3RyaW5nIiwiaW5kZXhPZiIsImZyYWdtZW50cyIsInNwbGl0IiwicGF0dGVybiIsImZsYWciLCJwdWJsaWNEaXIiLCJwcmVwZW5kUGF0aCIsImdldExpc3QiLCJ0aGVuIiwiZm9ybWF0VG9VcmwiLCJzZW5kIiwiY2F0Y2giLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7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eUIsRUFBekIsQ0FBUjtBQUNBaEIsb0JBQVFBLE1BQU1DLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLEdBQXBCLENBQVIsQ0FMMEIsQ0FLUTs7QUFFbEMsZ0JBQUksQ0FBQyxNQUFNYixJQUFOLENBQVdZLEtBQVgsQ0FBTCxFQUNFQSxRQUFRLE1BQU1BLEtBQWQ7O0FBRUYsbUJBQU9BLEtBQVA7QUFDRDs7QUFFRDtBQUNBZCxvQkFBVWtDLFlBQVlsQyxPQUFaLENBQVY7O0FBRUEsaUJBQUttQyxJQUFMLENBQVV6RCxNQUFWLFlBQTBCMkMsRUFBMUIsRUFBZ0NyQixPQUFoQztBQUNELFNBbkJILEVBb0JHb0MsS0FwQkgsQ0FvQlMsVUFBQ25CLEdBQUQ7QUFBQSxpQkFBU0MsUUFBUUMsS0FBUixDQUFjRixJQUFJaEMsS0FBbEIsQ0FBVDtBQUFBLFNBcEJUO0FBcUJELE9BekREO0FBMEREOzs7OztBQUdILHlCQUFlb0QsUUFBZixDQUF3Qi9FLFVBQXhCLEVBQW9DTSxVQUFwQzs7a0JBRWVBLFUiLCJmaWxlIjoiRmlsZVN5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgZnNlIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBrbGF3IGZyb20gJ2tsYXcnO1xuaW1wb3J0IF9wYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6ZmlsZS1zeXN0ZW0nO1xuY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKTtcbmNvbnN0IGlzU3RyaW5nID0gKHZhbHVlKSA9PiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZyk7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdmaWxlLXN5c3RlbSdgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93IHRvIHJldHJpZXZlIGEgbGlzdCBvZiBmaWxlcyBvciBkaXJlY3RvcmllcyBmcm9tIGEgZ2l2ZW4gcGF0aC5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuRmlsZVN5c3RlbX0qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogdGhpcy5maWxlU3lzdGVtID0gdGhpcy5yZXF1aXJlKCdmaWxlLXN5c3RlbScpO1xuICovXG5jbGFzcyBGaWxlU3lzdGVtIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdwdWJsaWNEaXJlY3RvcnknLFxuICAgICAgZW5hYmxlQ2FjaGU6IHRydWUsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2NhY2hlID0gW107IC8vIGtlZXAgcmVzdWx0cyBpbiBjYWNoZSB0byBhdm9pZCB0b28gbXVjaCBJL08gY2FsbHNcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjb25zdCBjb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW07XG4gICAgdGhpcy5fcHVibGljRGlyID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldChjb25maWdJdGVtKTtcblxuICAgIGlmICghdGhpcy5fcHVibGljRGlyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7U0VSVklDRV9JRH1cIjogc2VydmVyLmNvbmZpZy4ke2NvbmZpZ0l0ZW19IGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICB0aGlzLl9lbmFibGVDYWNoZSA9ICEhdGhpcy5vcHRpb25zLmVuYWJsZUNhY2hlO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuRmlsZVN5c3RlbX5MaXN0Q29uZmlnXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwYXRoIC0gTmFtZSBvZiB0aGUgZm9sZGVyIHRvIHNlYXJjaCBpbnRvLlxuICAgKiBAcHJvcGVydHkge1JlZ0V4cH0gW21hdGNoPScqJ10gLSBSZWdFeHAgdXNlZCB0byBmaWx0ZXIgdGhlIHJlc3VsdHMuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHNlYXJjaCBzaG91bGQgYmVcbiAgICogIHJlY3Vyc2l2ZS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbZGlyZWN0b3JpZXM9ZmFsc2VdIC0gSWYgdHJ1ZSBvbmx5IHJldHVybiBkaXJlY3RvcmllcyxcbiAgICogIGZpbGVzIG90aGVyd2lzZS5cbiAgICovXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBsaXN0IG9mIGZpbGVzIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkZpbGVTeXN0ZW1+TGlzdENvbmZpZ3xBcnJheTxTdHJpbmc+fEFycmF5PG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5GaWxlU3lzdGVtfkxpc3RDb25maWc+fSBjb25maWcgLVxuICAgKiAgRGV0YWlscyBvZiB0aGUgcmVxdWVzdGVkIGZpbGUgbGlzdChzKS5cbiAgICogQHJldHVybiB7UHJvbWlzZTxBcnJheT58UHJvbWlzZTxBcnJheTxBcnJheT4+fSAtIFByb21pc2UgcmVzb2x2aW5nIHdpdGggYW5cbiAgICogIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGFic29sdXRlIHBhdGhzIG9mIHRoZSBmaWxlcyAvIGRpcmVjdG9yaWVzLlxuICAgKiAgSWYgYGNvbmZpZ2AgaXMgYW4gYXJyYXksIHRoZSByZXN1bHRzIHdpbGwgYmUgYW4gYXJyYXkgb2YgYXJyYXlzXG4gICAqICBjb250YWluaW5nIHRoZSByZXN1bHQgb2YgZWFjaCBkaWZmZXJlbnQgcmVxdWVzdC5cbiAgICpcbiAgICogQGV4YW1wbGU6XG4gICAqIC8vIDEuIFNpbmdsZSBsaXN0XG4gICAqIC8vIHJldHJpZXZlIGFsbCB0aGUgZmlsZSBpbiBhIGZvbGRlclxuICAgKiBmaWxlU3lzdGVtLmdldExpc3QoJ215LWRpcmVjdG9yeScpLnRoZW4oKGZpbGVzKSA9PiAuLi4gKTtcbiAgICogLy8gb3IsIHJldHJpZXZlIGFsbCB0aGUgYC53YXZgIGZpbGVzIGluc2lkZSBhIGdpdmVuIGZvbGRlciwgc2VhcmNoIHJlY3Vyc2l2ZWx5XG4gICAqIGZpbGVTeXN0ZW0uZ2V0TGlzdCh7XG4gICAqICAgcGF0aDogJ215LWRpcmVjdG9yeScsXG4gICAqICAgbWF0Y2g6IC9cXC53YXYvLFxuICAgKiAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAgICogfSkudGhlbigoZmlsZXMpID0+IC4uLiApO1xuICAgKlxuICAgKiAvLyAyLiBNdWx0aXBsZSBSZXF1ZXN0c1xuICAgKiAvLyByZXRyaWV2ZSBhbGwgdGhlIGZpbGUgaW4gMiBkaWZmZXJlbnQgZm9sZGVycywgdGhlIHJldHVybmVkIHZhbHVlIHdpbGwgYmVcbiAgICogLy8gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgMiBmaWxlIGxpc3RzXG4gICAqIGZpbGVTeXN0ZW0uZ2V0TGlzdChbJ215LWRpcmVjdG9yeTEnLCAnbXktZGlyZWN0b3J5MiddKVxuICAgKiAgIC50aGVuKChhcnJheUxpc3QpID0+IC4uLiApO1xuICAgKiAvLyBvclxuICAgKiBmaWxlU3lzdGVtLmdldExpc3QoW3sgLi4uIH0sIHsgLi4uIH1dKVxuICAgKiAgIC50aGVuKChhcnJheUxpc3QpID0+IC4uLiApO1xuICAgKi9cbiAgZ2V0TGlzdChjb25maWcpIHtcbiAgICBsZXQgcmV0dXJuQWxsID0gdHJ1ZTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShjb25maWcpKSB7XG4gICAgICBjb25maWcgPSBbY29uZmlnXTtcbiAgICAgIHJldHVybkFsbCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gY29uZmlnLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGlzU3RyaW5nKGl0ZW0pKVxuICAgICAgICBpdGVtID0geyBwYXRoOiBpdGVtIH07XG5cbiAgICAgIGNvbnN0IHsgcGF0aCwgbWF0Y2gsIHJlY3Vyc2l2ZSwgZGlyZWN0b3JpZXMgfSA9IGl0ZW07XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0TGlzdChwYXRoLCBtYXRjaCwgcmVjdXJzaXZlLCBkaXJlY3Rvcmllcyk7XG4gICAgfSk7XG5cbiAgICBpZiAocmV0dXJuQWxsID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBzdGFja1swXTsgLy8gYSBzaW5nbGUgcHJvbWlzZVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChzdGFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgbGlzdCBvZiBmaWxlcyBpbnNpZGUgYSBnaXZlbiBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gVGhlIGRpcmVjdG9yeSB0byBzZWFyY2ggaW50by5cbiAgICogQHBhcmFtIHtSZWdFeHB9IFttYXRjaD0nKiddIC0gQSBSZWdFeHAgdG8gZmlsdGVyIHRoZSByZXN1bHRzICh0aGVcbiAgICogIHdpbGRjYXJkICcqJyBpcyBhY2NlcHRlZCkuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHNlYXJjaCBzaG91bGQgYmVcbiAgICogIHJlY3Vyc2l2ZSBvciBub3RcbiAgICogQHBhcmFtIHtCb29sZWFufSBbZGlyZWN0b3JpZXM9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSByZXN1bHQgc2hvdWxkIGNvbnRhaW5cbiAgICogIGEgbGlzdCBvZiBmaWxlcyBvciBhIGxpc3Qgb2YgZGlyZWN0b3JpZXMuXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldExpc3QocGF0aCA9IG51bGwsIG1hdGNoID0gJyonLCByZWN1cnNpdmUgPSBmYWxzZSwgZGlyZWN0b3JpZXMgPSBmYWxzZSkge1xuICAgIGlmIChwYXRoID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke1NFUlZJQ0VfSUR9IC0gcGF0aCBub3QgZGVmaW5lZGApO1xuXG4gICAgLy8gd2lsY2FyZFxuICAgIGlmIChtYXRjaCA9PT0gJyonKVxuICAgICAgbWF0Y2ggPSAvLiovO1xuXG4gICAgY29uc3Qga2V5ID0gYCR7cGF0aH06JHttYXRjaH06JHtyZWN1cnNpdmV9OiR7ZGlyZWN0b3JpZXN9YDtcblxuICAgIGlmICh0aGlzLl9lbmFibGVDYWNoZSAmJiB0aGlzLl9jYWNoZVtrZXldKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9jYWNoZVtrZXldKTtcblxuICAgIGNvbnN0IHRlc3RDd2QgPSBuZXcgUmVnRXhwKGBeJHtjd2R9YCk7XG4gICAgbGV0IGRpciA9IF9wYXRoLm5vcm1hbGl6ZShwYXRoKTtcbiAgICBsZXQgcmVzdWx0cyA9IFtdO1xuXG4gICAgLy8gbWFrZSB0aGUgZ2l2ZW4gcGF0aCBhYnNvbHV0ZSBpZiBub3RcbiAgICBpZiAoIWRpci5zdGFydHNXaXRoKGN3ZCkgJiYgIXRlc3RDd2QudGVzdChkaXIpKVxuICAgICAgZGlyID0gX3BhdGguam9pbihjd2QsIGRpcik7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhkaXIpO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBrbGF3KGRpcilcbiAgICAgICAgLm9uKCdkYXRhJywgKGl0ZW0pID0+IHtcbiAgICAgICAgICBjb25zdCBiYXNlbmFtZSA9IF9wYXRoLmJhc2VuYW1lKGl0ZW0ucGF0aCk7XG4gICAgICAgICAgY29uc3QgZGlybmFtZSA9IF9wYXRoLmRpcm5hbWUoaXRlbS5wYXRoKTtcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIC8vIGlnbm9yZSBjdXJyZW50IGRpcmVjdG9yeVxuICAgICAgICAgICAgaXRlbS5wYXRoID09PSBkaXIgfHzCoFxuICAgICAgICAgICAgLy8gaWdub3JlIGNvbW1vbiBoaWRkZW4gc3lzdGVtIGZpbGUgcGF0dGVybnNcbiAgICAgICAgICAgIGJhc2VuYW1lID09PSAndGh1bWJzLmRiJyB8fFxuICAgICAgICAgICAgL15cXC4vLnRlc3QoYmFzZW5hbWUpID09PSB0cnVlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGRpcmVjdG9yaWVzICYmIGl0ZW0uc3RhdHMuaXNEaXJlY3RvcnkoKSkgfHzCoFxuICAgICAgICAgICAgKCFkaXJlY3RvcmllcyAmJiBpdGVtLnN0YXRzLmlzRmlsZSgpKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaWYgKHJlY3Vyc2l2ZSB8fMKgKCFyZWN1cnNpdmUgJiYgZGlybmFtZSA9PT0gZGlyKSlcbiAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGl0ZW0ucGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgIC8vIHJlbW92ZSBgZGlyYCBmcm9tIHRoZSBwYXRocyBhbmQgdGVzdCBhZ2FpbnN0IHRoZSByZWdFeHBcbiAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICBlbnRyeSA9IGVudHJ5LnJlcGxhY2UoX3BhdGguam9pbihkaXIsIF9wYXRoLnNlcCksICcnKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaC50ZXN0KGVudHJ5KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIGtlZXAgaW4gY2FjaGUgYW5kIHJlc29sdmUgcHJvbWlzZVxuICAgICAgICAgIGlmICh0aGlzLl9lbmFibGVDYWNoZSlcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlW2tleV0gPSByZXN1bHRzO1xuXG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgfSkub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihTRVJWSUNFX0lELCAnLScsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuIChpZCwgY29uZmlnKSA9PiB7XG4gICAgICAvLyB1bnNlcmlhbGl6ZSB0aGUganNvbiBjb25maWcgdG8gcmV0dXJuIHByb3BlciBSZWdFeHAsIGFkYXB0ZWQgZnJvbTpcbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTIwNzU5Mjcvc2VyaWFsaXphdGlvbi1vZi1yZWdleHAjYW5zd2VyLTMzNDE2Njg0XG4gICAgICBjb25maWcgPSBKU09OLnBhcnNlKGNvbmZpZywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoa2V5ID09PSAnbWF0Y2gnICYmIHZhbHVlLnRvU3RyaW5nKCkuaW5kZXhPZignX19SRUdFWFAgJykgPT09IDApIHtcbiAgICAgICAgICBjb25zdCBmcmFnbWVudHMgPSB2YWx1ZS5zcGxpdCgnX19SRUdFWFAgJylbMV0ubWF0Y2goL1xcLyguKj8pXFwvKFtnaW15XSk/JC8pO1xuICAgICAgICAgIGNvbnN0IHBhdHRlcm4gPSBmcmFnbWVudHNbMV0ucmVwbGFjZSgnXFxcXFxcXFwnLCAnXFxcXCcpO1xuICAgICAgICAgIGNvbnN0IGZsYWcgPSBmcmFnbWVudHNbMl0gfHzCoCcnO1xuICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHBhdHRlcm4sIGZsYWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRlc3RDd2QgPSBuZXcgUmVnRXhwKGBeJHtjd2R9YCk7XG4gICAgICBsZXQgcHVibGljRGlyID0gdGhpcy5fcHVibGljRGlyO1xuXG4gICAgICBpZiAoIXB1YmxpY0Rpci5zdGFydHNXaXRoKGN3ZCkgJiYgIXRlc3RDd2QudGVzdChwdWJsaWNEaXIpKVxuICAgICAgICBwdWJsaWNEaXIgPSBfcGF0aC5qb2luKGN3ZCwgcHVibGljRGlyKTtcblxuICAgICAgLy8gZm9yY2UgdGhlIHNlYXJjaCBpbiB0aGUgcHVibGljIGRpcmVjdG9yeVxuICAgICAgZnVuY3Rpb24gcHJlcGVuZFBhdGgoaXRlbSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSlcbiAgICAgICAgICByZXR1cm4gaXRlbS5tYXAocHJlcGVuZFBhdGgpO1xuXG4gICAgICAgIGlmIChpc1N0cmluZyhpdGVtKSlcbiAgICAgICAgICBpdGVtID0gX3BhdGguam9pbihwdWJsaWNEaXIsIGl0ZW0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgaXRlbS5wYXRoID0gX3BhdGguam9pbihwdWJsaWNEaXIsIGl0ZW0ucGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG5cbiAgICAgIGNvbmZpZyA9IHByZXBlbmRQYXRoKGNvbmZpZyk7XG5cbiAgICAgIC8vIGdldCByZXN1bHRzXG4gICAgICB0aGlzLmdldExpc3QoY29uZmlnKVxuICAgICAgICAudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdFRvVXJsKGVudHJ5KSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRyeSkpXG4gICAgICAgICAgICAgIHJldHVybiBlbnRyeS5tYXAoZm9ybWF0VG9VcmwpO1xuXG4gICAgICAgICAgICBlbnRyeSA9IGVudHJ5LnJlcGxhY2UocHVibGljRGlyLCAnJyk7XG4gICAgICAgICAgICBlbnRyeSA9IGVudHJ5LnJlcGxhY2UoJ1xcXFwnLCAnLycpOyAvLyB3aW5kb3cgcGF0aHMgdG8gdXJsXG5cbiAgICAgICAgICAgIGlmICghL15cXC8vLnRlc3QoZW50cnkpKVxuICAgICAgICAgICAgICBlbnRyeSA9ICcvJyArIGVudHJ5O1xuXG4gICAgICAgICAgICByZXR1cm4gZW50cnk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcmVtb3ZlIGFsbCBmaWxlIHN5c3RlbSBpbmZvcm1hdGlvbnMgYW5kIGNyZWF0ZSBhbiBhYnNvbHV0ZSB1cmxcbiAgICAgICAgICByZXN1bHRzID0gZm9ybWF0VG9VcmwocmVzdWx0cyk7XG5cbiAgICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCBgbGlzdDoke2lkfWAsIHJlc3VsdHMpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICB9O1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEZpbGVTeXN0ZW0pO1xuXG5leHBvcnQgZGVmYXVsdCBGaWxlU3lzdGVtO1xuIl19