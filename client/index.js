'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _ClientModule = require('./ClientModule');

var _ClientModule2 = _interopRequireDefault(_ClientModule);

var _ClientCalibration = require('./ClientCalibration');

var _ClientCalibration2 = _interopRequireDefault(_ClientCalibration);

var _ClientCheckin = require('./ClientCheckin');

var _ClientCheckin2 = _interopRequireDefault(_ClientCheckin);

var _ClientControl = require('./ClientControl');

var _ClientControl2 = _interopRequireDefault(_ClientControl);

var _ClientFileList = require('./ClientFileList');

var _ClientFileList2 = _interopRequireDefault(_ClientFileList);

var _ClientLocator = require('./ClientLocator');

var _ClientLocator2 = _interopRequireDefault(_ClientLocator);

var _ClientPerformance = require('./ClientPerformance');

var _ClientPerformance2 = _interopRequireDefault(_ClientPerformance);

var _ClientPlacer = require('./ClientPlacer');

var _ClientPlacer2 = _interopRequireDefault(_ClientPlacer);

var _ClientSurvey = require('./ClientSurvey');

var _ClientSurvey2 = _interopRequireDefault(_ClientSurvey);

var _ClientSync = require('./ClientSync');

var _ClientSync2 = _interopRequireDefault(_ClientSync);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Orientation = require('./Orientation');

var _Orientation2 = _interopRequireDefault(_Orientation);

var _Welcome = require('./Welcome');

var _Welcome2 = _interopRequireDefault(_Welcome);

var _displayView = require('./display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _displaySelectorView = require('./display/SelectorView');

var _displaySelectorView2 = _interopRequireDefault(_displaySelectorView);

var _displaySpaceView = require('./display/SpaceView');

var _displaySpaceView2 = _interopRequireDefault(_displaySpaceView);

var _displaySquaredView = require('./display/SquaredView');

var _displaySquaredView2 = _interopRequireDefault(_displaySquaredView);

exports['default'] = {
  audioContext: _wavesAudio.audioContext,
  client: _client2['default'],
  input: _input2['default'],
  ClientCalibration: _ClientCalibration2['default'],
  ClientCheckin: _ClientCheckin2['default'],
  ClientControl: _ClientControl2['default'],
  ClientFileList: _ClientFileList2['default'],
  ClientLocator: _ClientLocator2['default'],
  ClientPerformance: _ClientPerformance2['default'],
  ClientPlacer: _ClientPlacer2['default'],
  ClientSurvey: _ClientSurvey2['default'],
  ClientSync: _ClientSync2['default'],
  Loader: _Loader2['default'],
  ClientModule: _ClientModule2['default'],
  Orientation: _Orientation2['default'],
  Welcome: _Welcome2['default'],

  display: {
    View: _displayView2['default'],
    SegmentedView: _displaySegmentedView2['default'],
    SelectorView: _displaySelectorView2['default'],
    SpaceView: _displaySpaceView2['default'],
    SquaredView: _displaySquaredView2['default']
  }
};
module.exports = exports['default'];
// defaultTemplates,
// defaultTextContents,
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7O3FCQUNYLFNBQVM7Ozs7NEJBRUYsZ0JBQWdCOzs7O2lDQUNYLHFCQUFxQjs7Ozs2QkFDekIsaUJBQWlCOzs7OzZCQUNqQixpQkFBaUI7Ozs7OEJBQ2hCLGtCQUFrQjs7Ozs2QkFDbkIsaUJBQWlCOzs7O2lDQUNiLHFCQUFxQjs7Ozs0QkFDMUIsZ0JBQWdCOzs7OzRCQUNoQixnQkFBZ0I7Ozs7MEJBQ2xCLGNBQWM7Ozs7c0JBRWxCLFVBQVU7Ozs7MkJBQ0wsZUFBZTs7Ozt1QkFDbkIsV0FBVzs7OzsyQkFFZCxnQkFBZ0I7Ozs7b0NBQ1AseUJBQXlCOzs7O21DQUMxQix3QkFBd0I7Ozs7Z0NBQzNCLHFCQUFxQjs7OztrQ0FDbkIsdUJBQXVCOzs7O3FCQUdoQztBQUNiLGNBQVksMEJBQUE7QUFDWixRQUFNLHFCQUFBO0FBQ04sT0FBSyxvQkFBQTtBQUNMLG1CQUFpQixnQ0FBQTtBQUNqQixlQUFhLDRCQUFBO0FBQ2IsZUFBYSw0QkFBQTtBQUNiLGdCQUFjLDZCQUFBO0FBQ2QsZUFBYSw0QkFBQTtBQUNiLG1CQUFpQixnQ0FBQTtBQUNqQixjQUFZLDJCQUFBO0FBQ1osY0FBWSwyQkFBQTtBQUNaLFlBQVUseUJBQUE7QUFDVixRQUFNLHFCQUFBO0FBQ04sY0FBWSwyQkFBQTtBQUNaLGFBQVcsMEJBQUE7QUFDWCxTQUFPLHNCQUFBOztBQUVQLFNBQU8sRUFBRTtBQUNQLFFBQUksMEJBQUE7QUFDSixpQkFBYSxtQ0FBQTtBQUNiLGdCQUFZLGtDQUFBO0FBQ1osYUFBUywrQkFBQTtBQUNULGVBQVcsaUNBQUE7R0FHWjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBpbnB1dCBmcm9tICcuL2lucHV0JztcblxuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgQ2xpZW50Q2FsaWJyYXRpb24gZnJvbSAnLi9DbGllbnRDYWxpYnJhdGlvbic7XG5pbXBvcnQgQ2xpZW50Q2hlY2tpbiBmcm9tICcuL0NsaWVudENoZWNraW4nO1xuaW1wb3J0IENsaWVudENvbnRyb2wgZnJvbSAnLi9DbGllbnRDb250cm9sJztcbmltcG9ydCBDbGllbnRGaWxlTGlzdCBmcm9tICcuL0NsaWVudEZpbGVMaXN0JztcbmltcG9ydCBDbGllbnRMb2NhdG9yIGZyb20gJy4vQ2xpZW50TG9jYXRvcic7XG5pbXBvcnQgQ2xpZW50UGVyZm9ybWFuY2UgZnJvbSAnLi9DbGllbnRQZXJmb3JtYW5jZSc7XG5pbXBvcnQgQ2xpZW50UGxhY2VyIGZyb20gJy4vQ2xpZW50UGxhY2VyJztcbmltcG9ydCBDbGllbnRTdXJ2ZXkgZnJvbSAnLi9DbGllbnRTdXJ2ZXknO1xuaW1wb3J0IENsaWVudFN5bmMgZnJvbSAnLi9DbGllbnRTeW5jJztcblxuaW1wb3J0IExvYWRlciBmcm9tICcuL0xvYWRlcic7XG5pbXBvcnQgT3JpZW50YXRpb24gZnJvbSAnLi9PcmllbnRhdGlvbic7XG5pbXBvcnQgV2VsY29tZSBmcm9tICcuL1dlbGNvbWUnO1xuXG5pbXBvcnQgVmlldyBmcm9tICcuL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VsZWN0b3JWaWV3IGZyb20gJy4vZGlzcGxheS9TZWxlY3RvclZpZXcnO1xuaW1wb3J0IFNwYWNlVmlldyBmcm9tICcuL2Rpc3BsYXkvU3BhY2VWaWV3JztcbmltcG9ydCBTcXVhcmVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU3F1YXJlZFZpZXcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXVkaW9Db250ZXh0LFxuICBjbGllbnQsXG4gIGlucHV0LFxuICBDbGllbnRDYWxpYnJhdGlvbixcbiAgQ2xpZW50Q2hlY2tpbixcbiAgQ2xpZW50Q29udHJvbCxcbiAgQ2xpZW50RmlsZUxpc3QsXG4gIENsaWVudExvY2F0b3IsXG4gIENsaWVudFBlcmZvcm1hbmNlLFxuICBDbGllbnRQbGFjZXIsXG4gIENsaWVudFN1cnZleSxcbiAgQ2xpZW50U3luYyxcbiAgTG9hZGVyLFxuICBDbGllbnRNb2R1bGUsXG4gIE9yaWVudGF0aW9uLFxuICBXZWxjb21lLFxuXG4gIGRpc3BsYXk6IHtcbiAgICBWaWV3LFxuICAgIFNlZ21lbnRlZFZpZXcsXG4gICAgU2VsZWN0b3JWaWV3LFxuICAgIFNwYWNlVmlldyxcbiAgICBTcXVhcmVkVmlldyxcbiAgICAvLyBkZWZhdWx0VGVtcGxhdGVzLFxuICAgIC8vIGRlZmF1bHRUZXh0Q29udGVudHMsXG4gIH1cbn07XG4iXX0=