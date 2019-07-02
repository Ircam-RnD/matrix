import Activity from './Activity';
import serviceManager from './serviceManager';

/**
 * Base class used to build a experience on the server side.
 *
 * Along with the classic {@link src/server/core/Activity#connect} and
 * {@link src/server/core/Activity#disconnect} methods, the base class has two
 * additional methods:
 * - {@link Experience#enter}: called when the client enters the `Experience`
 * (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the
 * client side calls its {@link src/client/scene/Experience.js~Experience#start} method);
 * - {@link Experience#exit}: called when the client leaves the `Experience`
 * (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the
 * client side calls its {@link src/client/scene/Experience.js~Experience#done}
 * method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the
 * performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/scene/Experience.js~Experience} on the client side.)
 *
 * @memberof module:soundworks/server
 */
class Experience extends Activity {
  constructor(clientTypes) {
    super('experience');

    /**
     * List of the clients who are currently in the performance.
     * @type {Client[]}
     */
    this.clients = new Set();
    this._addClientTypes(clientTypes);
  }

  /**
   * Shortcut for
   * ```
   *
   * ````
   */
  require(name, options = {}, dependencies = []) {
    return serviceManager.get(name, options, dependencies, this);
  }

  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   * @private
   */
  connect(client) {
    super.connect(client);
    // listen for the `'enter' socket message from the client, the message is
    // sent when the client `enters` the Experience client side, i.e. when all
    // required services are ready
    return new Promise((resolve, reject) => {
      client.socket.addListener('s:exp:enter', () => {
        this.clients.add(client);
        this.enter(client);
      });
    });
  }

  /**
   * Called when the client disconnects from the server.
   * @param {Client} client Disconnected client.
   * @private
   */
  disconnect(client) {
    super.disconnect(client);

    // only call exit if the client has fully entered
    // (i.e. has finished the its initialization phase)
    if (this.clients.has(client)) {
      this.clients.delete(client);
      this.exit(client);
    }
  }

  enter(client) {
    throw new Error(`Experience "${this.constructor.name}.enter()" not implemented`);
  }

  exit(client) {
    throw new Error(`Experience "${this.constructor.name}.exit()" not implemented`);
  }
}

export default Experience;
