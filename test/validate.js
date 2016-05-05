'use strict';

const fs = require('fs');
const md5 = require('js-md5');
const assert = require('assert');

before(function(){

    // WebGL is not support on Travis, so let's check for it first
    // WebGL tests will only get run locally
    this.hasWebGL = PIXI.utils.isWebGLSupported();
    if (this.hasWebGL) {
        const webglView = this.webglView = document.createElement('canvas');
        webglView.id = "webgl";
        webglView.width = 32;
        webglView.height = 32;
        document.body.appendChild(webglView);
        this.webgl = new PIXI.WebGLRenderer(32, 32, {
            view: webglView,
            backgroundColor: 0xffffff,
            antialias: false,
            preserveDrawingBuffer: true
        });
    }

    // Create the canvas renderer
    const canvasView = this.canvasView = document.createElement('canvas');
    canvasView.id = "canvas";
    canvasView.width = 32;
    canvasView.height = 32;
    document.body.appendChild(canvasView);
    this.canvas = new PIXI.CanvasRenderer(32, 32, {
        view: canvasView,
        backgroundColor: 0xffffff,
        antialias: false,
        preserveDrawingBuffer: true,
        roundPixels: true
    });
    this.canvas.smoothProperty = null;

    // Container to render
    this.stage = new PIXI.Container();

    // Render function
    this.render = function() {
        if (this.hasWebGL) {
            this.webgl.render(this.stage);
        }
        this.canvas.render(this.stage);
    };

    // Provide a function to validate the render of a canvas
    // against the data
    const solutions = require(__dirname + '/solutions.json'); 

    this.validate = function(testId) {
        this.render();
        if (this.hasWebGL) {
            assert.equal(
                solutions[testId].webgl, 
                md5(this.webglView.toDataURL()), 
                'WebGL solution for "' + testId + '" failed ' + this.webglView.toDataURL()
            );
        }
        assert.equal(
            solutions[testId].canvas, 
            md5(this.canvasView.toDataURL()), 
            'Canvas solution for "' + testId + '" failed ' + this.canvasView.toDataURL()
        );
    };
});

// Delete and remove the canvas
after(function(){
    this.stage.destroy(true);
    if (this.hasWebGL) {
        this.webgl.destroy();
        this.webgl = null;
        this.webglView = null;
    }
    this.canvas.destroy();
    this.canvas = null;
    this.canvasView = null;
    this.stage = null;
    this.validate = null;
    this.render = null;
});

// Remove all children, cleanup
beforeEach(function(){
    this.stage.removeChildren();
});

afterEach(function(){
    this.stage.removeChildren();
    this.render();
});