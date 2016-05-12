"use strict";

const path = require('path');
const Renderer = require('./lib/renderer');

describe('Renders', function() {
    
    before(function(){
        const webgl = this.webgl = document.createElement('canvas');
        const canvas = this.canvas = document.createElement('canvas');
        document.body.appendChild(webgl);
        document.body.appendChild(canvas);
        this.renderer = new Renderer(webgl, canvas);

        // Validate against a pre-rendered solution
        this.validate = function(id) {
            const solution = path.join(__dirname, 'solutions', id + '.json');
            const test = path.join(__dirname, 'tests', id + '.js');
            try {
                this.renderer.compare(test, require(solution));
            }
            catch (err) {
                assert(false, err.message);
            }
        };

        // Run some code and pass in the stage and the renderers
        this.run = function(id) {
            const file = path.join(__dirname, 'tests', id + '.js');
            delete require.cache[path.resolve(file)];
            const code = require(file);
            code(this.renderer.stage, {
                webgl: this.renderer.webgl,
                canvas: this.renderer.canvas
            });
        };
    });

    beforeEach(function(){
        this.renderer.clear();
    });

    after(function(){
        this.webgl.parentNode.removeChild(this.webgl);
        this.canvas.parentNode.removeChild(this.canvas);
        this.webgl = null;
        this.canvas = null;
        this.renderer = null;
        this.run = null;
        this.validate = null;
    });

    /* --------------------- Test Go Here -------------------- */

    it('should render a graphic', function() {
        this.validate('graphic');
    });
});