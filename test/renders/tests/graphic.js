module.exports = function(stage) {
    stage.addChild(new PIXI.Graphics()
        .beginFill(0xFFCC00, 1)
        .drawRect(8, 8, 16, 16)
    );
};