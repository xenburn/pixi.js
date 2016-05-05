'use strict';

// Include PIXI
require('../bin/pixi');

describe('PIXI', function () {

    it('should exist as a global object', function () {
        expect(PIXI).to.be.an('object');
    });

    require('./validate');

    it('should render a PIXI.Graphics rectangle', function() {
        this.stage.addChild(new PIXI.Graphics()
            .beginFill(0xFF0000, 1)
            .drawRect(8, 8, 16, 16)
        );
        this.validate('drawRect');
    });

    it('should render a rotated PIXI.Graphics rectangle', function(){
        var graphic = this.stage.addChild(new PIXI.Graphics()
            .beginFill(0xCCCC00, 1)
            .drawRect(8, 8, 16, 16)
        );
        graphic.rotation = 0.1;
        this.validate('drawRectRotated');
    });
});