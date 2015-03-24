/**
 * @fileoverview Soundworks client side seat map module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientModule = require('./ClientModule');
var client = require('./client');

class ClientSetup extends ClientModule {
  constructor(options = {}) {
    super('setup', false);

    this.width = 1;
    this.height = 1;
    this.spacing = 1;
    this.labels = [];
    this.positions = [];
  }

  start() {
    super.start();

    client.send('setup:request');

    client.receive('setup:init', (setup) => {
      this.width = setup.width;
      this.height = setup.height;
      this.spacing = setup.spacing;
      this.labels = setup.labels;
      this.positions = setup.positions;

      this.done();
    });
  }

  display(div) {
    div.classList.add('setup');

    var heightWidthRatio = this.height / this.width;
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;
    var screenRatio = screenHeight / screenWidth;
    var heightPx, widthPx;

    if (screenRatio > heightWidthRatio) { // TODO: refine sizes, with container, etc.
      heightPx = screenWidth * heightWidthRatio;
      widthPx = screenWidth;
    } else {
      heightPx = screenHeight;
      widthPx = screenHeight / heightWidthRatio;
    }

    var tileWidth = widthPx / this.width * this.spacing;
    var tileHeight = heightPx / this.height * this.spacing;
    var tileSize = Math.min(tileWidth, tileHeight);

    var tileMargin = tileSize / 10;

    div.style.height = heightPx + "px";
    div.style.width = widthPx + "px";

    var positions = this.positions;

    for (let i = 0; i < positions.length; i++) {
      let tile = document.createElement('div');
      tile.classList.add('tile');

      tile.setAttribute('data-index', i);
      tile.setAttribute('data-x', positions[i][0]);
      tile.setAttribute('data-y', positions[i][1]);
      tile.style.height = tileSize - 2 * tileMargin + "px";
      tile.style.width = tileSize - 2 * tileMargin + "px";
      tile.style.left = positions[i][0] * widthPx - (tileSize - 2 * tileMargin) / 2 + "px";
      tile.style.top = positions[i][1] * heightPx - (tileSize - 2 * tileMargin) / 2 + "px";

      div.appendChild(tile);
    }
  }

  addClassToTile(div, index, className) {
    var tiles = Array.prototype.slice.call(div.childNodes); // .childNode returns a NodeList
    var tileIndex = tiles.map((t) => parseInt(t.dataset.index)).indexOf(index);
    var tile = tiles[tileIndex];

    if (tile)
      tile.classList.add(className);
  }

  removeClassFromTile(div, index, className) {
    var tiles = Array.prototype.slice.call(div.childNodes); // .childNode returns a NodeList
    var tileIndex = tiles.map((t) => parseInt(t.dataset.index)).indexOf(index);
    var tile = tiles[tileIndex];

    if (tile)
      tile.classList.remove(className);
  }
}

module.exports = ClientSetup;