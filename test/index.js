'use strict';

// Include PIXI
require('../bin/pixi');

describe('PIXI', function () {
    it('should exist as a global object', function () {
        expect(PIXI).to.be.an('object');
    });

    // API tests
    require('./core/display/Container');
    require('./core/display/DisplayObject');
    require('./core/sprites/Sprite');
    require('./core/utils/util');
    require('./interaction/InteractionData');

    // Rendering tests
    require('./renders');
});