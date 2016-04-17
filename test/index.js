'use strict';

// Include PIXI
require('../');

// Globals for testing
global.chai = require('chai');
global.expect = chai.expect;

describe('PIXI', function () {
    it('exists', function () {
        expect(PIXI).to.be.an('object');
    });
});

// Include tests
require('./core/display/Container');
require('./core/display/DisplayObject');
require('./core/sprites/Sprite');
require('./core/utils/util');
require('./interaction/InteractionData');