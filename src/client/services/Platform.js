import { audioContext } from 'waves-audio';
import client from '../core/client';
import MobileDetect from 'mobile-detect';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
// @todo - define if we keep this in defaults
import * as adapter from 'webrtc-adapter';
adapter.disableLog(true);

// @todo - to be added
// + “video-input”: needs video input
// + “video-audio-input”: needs video input
// + DeviceMotion/Orientation conditions generated by the motion-input module

/**
 * Structure of the definition of a feature to be tested.
 * @typedef {Object} module:soundworks/client.Platform~definition
 * @property {String} id - Id of the definition.
 * @property {Function} check - A function that should return `true` if the
 *  feature is available on the platform, `false` otherwise.
 * @property {Function} [interactionHook] - A function to be executed by the
 *  [`welcome` service]{@link module:soundworks/client.Welcome} on the first
 *  interaction (i.e. `click` or `touchstart`) of the user with application
 *  (for example, to initialize AudioContext on iOS devices).
 * @property {Function} [interactionHook] - A function to be executed by the
 *  [`welcome` service]{@link module:soundworks/client.Welcome} on start (for
 *  example to ask access to microphone or geolocation).
 */
const defaultDefinitions = [
  {
    id: 'web-audio',
    check: function() {
      return !!audioContext;
    },
    interactionHook: function() {
      if (!client.platform.isMobile)
        return;

      const g = audioContext.createGain();
      g.connect(audioContext.destination);
      g.gain.value = 0.000000001; // -180dB ?

      const o = audioContext.createOscillator();
      o.connect(g);
      o.frequency.value = 20;
      o.start(0);

      // prevent android to stop audio by keping the oscillator active
      if (client.platform.os !== 'android')
        o.stop(audioContext.currentTime + 0.01);
    }
  },
  {
    // @note: `touch` feature workaround
    // cf. http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
    id: 'mobile-device',
    check: function() {
      return client.platform.isMobile;
    }
  },
  {
    id: 'audio-input',
    check: function() {
      return !!navigator.getUserMedia;
    },
    startHook: function() {
      navigator.getUserMedia({ audio: true }, function(stream) {
        stream.getAudioTracks()[0].stop();
      }, function (err) {
        throw err;
      });
    }
  }
];


const SERVICE_ID = 'service:platform';

/**
 * Interface for the client `'platform'` service.
 *
 * This services is responsible to give general informations about the user's
 * device (cf. [`client.device`]{@link module:soundworks/client.client.platform})
 * as well as check availability and provide hooks to initialize the features
 * required by the application (audio, microphone, etc.).
 * If one of the required definition is not available, an view is created with
 * an error message and the [`client.compatible`]{@link module:soundworks/client.client.compatible}
 * attribute is set to `false`.
 *
 * Available built-in definitions are:
 * - 'web-audio'
 * - 'mobile-device'
 * - 'audio-input'
 *
 * Most of these feature requiring an interaction or a confirmation from the
 * user in order to be initialized correctly, this service should be used in
 * conjonction with the [`welcome`]{@link module:soundworks/client.Welcome}
 * service.
 *
 * @see {@link module:soundworks/client.Welcome}
 * @see {@link module:soundworks/client.client}
 *
 * @param {Object} options
 * @param {Array<String>|String} options.features - Id(s) of the feature(s)
 *  required by the application.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.platform = this.require('platform', { features: 'web-audio' });
 */
class Platform extends Service {
  /** __WARNING__ This class should never be instanciated manually */
  constructor() {
    super(SERVICE_ID, false);

    const defaults = {
      viewCtor: SegmentedView,
      viewPriority: 20,
    };

    this.configure(defaults);

    this._requiredFeatures = new Set();
    this._featureDefinitions = {};

    defaultDefinitions.forEach((def) => this.addFeatureDefinition(def));
  }

  /** @private */
  configure(options) {
    if (options.features) {
      let features = options.features;

      if (typeof features === 'string')
        features = [features];

      this.requireFeature(...features);
      delete options.features;
    }

    super.configure(options);
  }

  /** @private */
  init() {
    this._defineAudioFileExtention();
    this._definePlatform();
    // resolve required features from the application
    client.compatible = this.resolveRequiredFeatures();

    this.viewCtor = this.options.viewCtor;
    this.view = this.createView();
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    if (client.compatible)
      this.ready();
    else
      this.show();
  }

  /**
   * Add a new feature definition or override an existing one.
   * @param {module:soundworks/client.Platform~definition} obj - Definition of
   *  the feature to add to the existing ones.
   */
  addFeatureDefinition(obj) {
    this._featureDefinitions[obj.id] = obj;
  }

  /**
   * Require features avalability for the application.
   * @private
   * @param {...String} features - The id(s) of the feature(s) to be required.
   */
  requireFeature(...features) {
    features.forEach((id) => this._requiredFeatures.add(id));
  }

  /**
   * Execute all `check` functions from the definition of the required features.
   * @private
   * @return {Boolean} - true if all checks pass, false otherwise.
   *
   */
  resolveRequiredFeatures() {
    let result = true;

    this._requiredFeatures.forEach((feature) => {
      const checkFunction = this._featureDefinitions[feature].check;

      if (!(typeof checkFunction === 'function'))
        throw new Error(`No check function defined for ${feature} feature`);

      result = result && checkFunction();
    });

    return result;
  }

  /**
   * Returns the list of the functions to be executed on welcome `start` lifecycle.
   * @private
   * @return {Array}
   */
  getStartHooks() {
    return this._getHooks('startHook');
  }

  /**
   * Returns the list of the functions to be executed on welcome when the user
   * interacts with the application.
   * @private
   * @return {Array}
   */
  getInteractionHooks() {
    return this._getHooks('interactionHook');
  }

  /** @private */
  _getHooks(type) {
    const hooks = [];

    this._requiredFeatures.forEach((feature) => {
      const hook = this._featureDefinitions[feature][type];

      if (hook)
        hooks.push(hook);
    });

    return hooks;
  }

  /**
   * Populate `client.platform` with the prefered audio file extention for the platform.
   * @private
   */
  _defineAudioFileExtention() {
    const a = document.createElement('audio');
    // http://diveintohtml5.info/everything.html
    if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
      client.platform.audioFileExt = '.mp3';
    } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
      client.platform.audioFileExt = '.ogg';
    } else {
      client.platform.audioFileExt = '.wav';
    }
  }

  /**
   * Populate `client.platform` with the os name.
   * @private
   */
  _definePlatform() {
    const ua = window.navigator.userAgent
    const md = new MobileDetect(ua);

    client.platform.isMobile = (md.mobile() !== null); // true if phone or tablet
    client.platform.os = (function() {
      const os = md.os();

      if (os === 'AndroidOS')
        return 'android';
      else if (os === 'iOS')
        return 'ios';
      else
        return 'other';
    })();
  }
}

serviceManager.register(SERVICE_ID, Platform);

export default Platform;
