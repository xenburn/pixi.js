'use strict';

const md5 = require('js-md5');
const path = require('path');
const ImageDiff = require('./imagediff');

/**
 * Class to create solutions
 * @class Renderer
 * @constructor
 */
const Renderer = function(viewWebGL, viewContext2d) {
    this.stage = new PIXI.Container();
    this.hasWebGL = PIXI.utils.isWebGLSupported();
    if (this.hasWebGL) {
        this.webgl = new PIXI.WebGLRenderer(Renderer.WIDTH, Renderer.HEIGHT, {
            view: viewWebGL,
            backgroundColor: 0xffffff,
            antialias: false,
            preserveDrawingBuffer: true
        });
    }
    this.canvas = new PIXI.CanvasRenderer(Renderer.WIDTH, Renderer.HEIGHT, {
        view: viewContext2d,
        backgroundColor: 0xffffff,
        antialias: false,
        preserveDrawingBuffer: true,
        roundPixels: true
    });
    this.canvas.smoothProperty = null;
    this.render();

    this.instance = null;
    this.imagediff = new ImageDiff(Renderer.WIDTH, Renderer.HEIGHT, Renderer.TOLERANCE);
};

// Reference to the prototype
const p = Renderer.prototype;

Renderer.WIDTH = 32;
Renderer.HEIGHT = 32;
Renderer.TOLERANCE = 0.01;

/**
 * Rerender the stage
 * @method render
 */
p.render = function() {
    if (this.hasWebGL) {
        this.webgl.render(this.stage);
    }
    this.canvas.render(this.stage);
};

/**
 * Clear the stage
 * @method clear
 */
p.clear = function() {
    this.stage.removeChildren();
    if (this.instance) {
        this.instance.destroy(true);
        this.instance = null;
    }
    this.render();
};

/**
 * Run the solution renderer
 * @method run
 * @param {String} file Fully resolved path
 * @param {Function} callback Takes error and result as arguments
 */
p.run = function(file) {
    delete require.cache[path.resolve(file)];
    let data, code = require(file);
    if (typeof code !== "function") {
        throw new Error('Invalid JS format, make sure file is CommonJS compatible, e.g. "module.exports = function(stage){};"');
    }
    this.clear();

    // Execute the module
    code(this.stage, {
        webgl: this.webgl,
        canvas: this.canvas
    });

    if (!this.stage.children.length) {
        throw new Error('Stage has no children, make sure to add children in your test, e.g. "module.exports = function(stage){};"');
    }

    // Generate the result
    const result = {
        webgl: {},
        canvas: {}
    };
    this.render();
    if (this.hasWebGL) {
        data = this.webgl.view.toDataURL();
        result.webgl.image = data;
        result.webgl.hash = md5(data);
    }
    data = this.canvas.view.toDataURL();
    result.canvas.image = data;
    result.canvas.hash = md5(data);
    return result;
};

/**
 * Compare a file with a solution.
 * @method compare
 * @param {String} file The file to load.
 * @param {Object} solution
 * @param {Array<String>} solution.webgl
 * @param {Array<String>} solution.canvas
 */
p.compare = function(file, solution) {
    let result = this.run(file);
    if (this.hasWebGL) {
        if (!this.compareResult(solution.webgl, result.webgl)) {
            throw new Error('WebGL results do not match.');    
        }
    }
    if (!this.compareResult(solution.canvas, result.canvas)) {
        throw new Error('Canvas results do not match.');
    }
};

/**
 * Compare two arrays of frames
 * @method compareResult
 * @private
 * @param {Array} a
 * @param {Array} b
 * @return {Boolean} If we're equal
 */
p.compareResult = function(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null || b === null) {
        return false;
    }
    if (a.hash !== b.hash) {
        if (!this.imagediff.compare(a.image, b.image)) {
            return false;
        }
    }
    return true;
};

module.exports = Renderer;