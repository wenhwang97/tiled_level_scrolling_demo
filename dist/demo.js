(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * TiledScrollingDemo.ts - demonstrates how tiled layers can be rendered
 * and scrolled using a viewport.
 */
var Game_1 = require("../wolfie2d/Game");
var AnimatedSprite_1 = require("../wolfie2d/scene/sprite/AnimatedSprite");
var TextRenderer_1 = require("../wolfie2d/rendering/TextRenderer");
// THIS IS THE ENTRY POINT INTO OUR APPLICATION, WE MAKE
// THE Game OBJECT AND INITIALIZE IT WITH THE CANVASES
var game = new Game_1.Game("game_canvas", "text_canvas");
// WE THEN LOAD OUR GAME SCENE, WHICH WILL FIRST LOAD
// ALL GAME RESOURCES, THEN CREATE ALL SHADERS FOR
// RENDERING, AND THEN PLACE ALL GAME OBJECTS IN THE SCENE.
// ONCE IT IS COMPLETED WE CAN START THE GAME
var DESERT_SCENE_PATH = "resources/scenes/ScrollableDesert.json";
game.getResourceManager().loadScene(DESERT_SCENE_PATH, game.getSceneGraph(), game.getRenderingSystem(), function () {
    // ADD ANY CUSTOM STUFF WE NEED HERE, LIKE TEXT RENDERING
    // LET'S ADD A BUNCH OF RANDOM SPRITES
    var world = game.getSceneGraph().getTiledLayers();
    var worldWidth = world[0].getColumns() * world[0].getTileSet().getTileWidth();
    var worldHeight = world[0].getRows() * world[0].getTileSet().getTileHeight();
    for (var i = 0; i < 100; i++) {
        var _type = game.getResourceManager().getAnimatedSpriteType("ANT");
        if (i >= 50) {
            _type = game.getResourceManager().getAnimatedSpriteType("COCKROACH");
        }
        var randomSprite = new AnimatedSprite_1.AnimatedSprite(_type, "IDLE");
        var randomX = Math.random() * worldWidth;
        var randomY = Math.random() * worldHeight;
        randomSprite.getPosition().set(randomX, randomY, 0, 1);
        game.getSceneGraph().addAnimatedSprite(randomSprite);
    }
    var type = game.getResourceManager().getAnimatedSpriteType("SPIDER");
    var characterSprite = new AnimatedSprite_1.AnimatedSprite(type, "IDLE");
    var charX = game.getSceneGraph().getViewport().getWidth() / 2;
    var charY = game.getSceneGraph().getViewport().getHeight() / 2;
    characterSprite.getPosition().set(charX, charY, 0, 1);
    game.getSceneGraph().addAnimatedSprite(characterSprite);
    game.getSceneGraph().setCharacter(characterSprite);
    // NOW ADD TEXT RENDERING. WE ARE GOING TO RENDER 3 THINGS:
    // NUMBER OF SPRITES IN THE SCENE
    // LOCATION IN GAME WORLD OF VIEWPORT
    // NUMBER OF SPRITES IN VISIBLE SET (i.e. IN THE VIEWPORT)
    var sceneGraph = game.getSceneGraph();
    var spritesInSceneText = new TextRenderer_1.TextToRender("Sprites in Scene", "", 20, 50, function () {
        spritesInSceneText.text = "Sprites in Scene: " + sceneGraph.getNumSprites();
    });
    var viewportText = new TextRenderer_1.TextToRender("Viewport", "", 20, 70, function () {
        var viewport = sceneGraph.getViewport();
        viewportText.text = "Viewport (w, h, x, y): (" + viewport.getWidth() + ", " + viewport.getHeight() + ", " + viewport.getX() + ", " + viewport.getY() + ")";
    });
    var spritesInViewportText = new TextRenderer_1.TextToRender("Sprites in Viewport", "", 20, 90, function () {
        spritesInViewportText.text = "Sprites in Viewport: " + sceneGraph.scope().length;
    });
    var worldDimensionsText = new TextRenderer_1.TextToRender("World Dimensions", "", 20, 110, function () {
        worldDimensionsText.text = "World Dimensions (w, h): (" + worldWidth + ", " + worldHeight + ")";
    });
    var textRenderer = game.getRenderingSystem().getTextRenderer();
    textRenderer.addTextToRender(spritesInSceneText);
    textRenderer.addTextToRender(viewportText);
    textRenderer.addTextToRender(spritesInViewportText);
    textRenderer.addTextToRender(worldDimensionsText);
    // AND START THE GAME LOOP
    game.start();
});

},{"../wolfie2d/Game":2,"../wolfie2d/rendering/TextRenderer":8,"../wolfie2d/scene/sprite/AnimatedSprite":18}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Game is the focal point of the application, it has 4 subsystems,
 * the resource manager, the scene graph, the rendering system, and
 * the UI controller. In addition it serves as the game loop, providing
 * both an update and draw function that is called on a schedule.
 */
var GameLoopTemplate_1 = require("./loop/GameLoopTemplate");
var WebGLGameRenderingSystem_1 = require("./rendering/WebGLGameRenderingSystem");
var SceneGraph_1 = require("./scene/SceneGraph");
var ResourceManager_1 = require("./files/ResourceManager");
var UIController_1 = require("./ui/UIController");
var Viewport_1 = require("./scene/Viewport");

var Game = function (_GameLoopTemplate_1$G) {
    _inherits(Game, _GameLoopTemplate_1$G);

    function Game(gameCanvasId, textCanvasId) {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

        _this.resourceManager = new ResourceManager_1.ResourceManager();
        _this.sceneGraph = new SceneGraph_1.SceneGraph();
        _this.renderingSystem = new WebGLGameRenderingSystem_1.WebGLGameRenderingSystem(gameCanvasId, textCanvasId);
        _this.uiController = new UIController_1.UIController(gameCanvasId, _this.sceneGraph);
        // MAKE SURE THE SCENE GRAPH' S VIEWPORT IS PROPERLY SETUP
        var viewportWidth = document.getElementById(gameCanvasId).width;
        var viewportHeight = document.getElementById(gameCanvasId).height;
        var viewport = new Viewport_1.Viewport(viewportWidth, viewportHeight);
        _this.sceneGraph.setViewport(viewport);
        return _this;
    }

    _createClass(Game, [{
        key: "getRenderingSystem",
        value: function getRenderingSystem() {
            return this.renderingSystem;
        }
    }, {
        key: "getResourceManager",
        value: function getResourceManager() {
            return this.resourceManager;
        }
    }, {
        key: "getSceneGraph",
        value: function getSceneGraph() {
            return this.sceneGraph;
        }
    }, {
        key: "begin",
        value: function begin() {}
        /*
         * This draws the game. Note that we are not currently using the
         * interpolation value, but could once physics is involved.
         */

    }, {
        key: "draw",
        value: function draw(interpolationPercentage) {
            // GET THE TILED LAYERS TO RENDER FROM THE SCENE GRAPH
            var visibleLayers = void 0;
            visibleLayers = this.sceneGraph.getTiledLayers();
            // GET THE VISIBLE SET FROM THE SCENE GRAPH
            var visibleSprites = void 0;
            visibleSprites = this.sceneGraph.scope();
            var viewport = this.sceneGraph.getViewport();
            // RENDER THE VISIBLE SET, WHICH SHOULD ALL BE RENDERABLE
            this.renderingSystem.render(viewport, visibleLayers, visibleSprites);
        }
        /**
         * Updates the scene.
         */

    }, {
        key: "update",
        value: function update(delta) {
            this.sceneGraph.update(delta);
        }
        /**
         * Updates the FPS counter.
         */

    }, {
        key: "end",
        value: function end(fps, panic) {
            if (panic) {
                var discardedTime = Math.round(this.resetFrameDelta());
                console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
            }
        }
    }]);

    return Game;
}(GameLoopTemplate_1.GameLoopTemplate);

exports.Game = Game;

},{"./files/ResourceManager":3,"./loop/GameLoopTemplate":4,"./rendering/WebGLGameRenderingSystem":10,"./scene/SceneGraph":15,"./scene/Viewport":17,"./ui/UIController":23}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var WebGLGameTexture_1 = require("../rendering/WebGLGameTexture");
var AnimatedSpriteType_1 = require("../scene/sprite/AnimatedSpriteType");
var TiledLayer_1 = require("../scene/tiles/TiledLayer");
var TileSet_1 = require("../scene/tiles/TileSet");

var ResourceManager = function () {
    function ResourceManager() {
        var _this = this;

        _classCallCheck(this, ResourceManager);

        // GAME SHADER PROGRAM SOURCE CODE WILL BE LOADED HERE. NOTE THAT
        // WE HAVE ONE MAP FOR MAPPING THE SHADER NAME TO THE SOURCE CODE
        // AND ANOTHER FOR MAPPING THE SHADER NAME TO THE FILE PATH
        this.gameShadersSource = new Map();
        this.gameShadersSourcePaths = new Map();
        // SPRITE TYPES
        this.gameSpriteTypes = new Map();
        this.gameSpriteTypePaths = new Map();
        // TILE SETS
        this.gameTileSets = new Map();
        this.gameTileSetPaths = new Map();
        // GAME TEXTURES 
        this.gameTextures = new Map();
        /*
         * This helper function loads all the json text into an AnimatedSpriteType
         * object and returns it.
         */
        this.loadSpriteTypeData = function (renderingSystem, spriteFilePath, jsonText, callback) {
            var jsonData = JSON.parse(jsonText);
            var texturePath = _this.buildPathToFileInSameDirectory(spriteFilePath, jsonData.spriteSheetImage);
            var thisResourceManager = _this;
            _this.loadTexture(texturePath, renderingSystem, function (spritesheetTexture) {
                var spriteWidth = jsonData.spriteWidth;
                var spriteHeight = jsonData.spriteHeight;
                var animatedSpriteType = new AnimatedSpriteType_1.AnimatedSpriteType(spritesheetTexture, spriteWidth, spriteHeight);
                for (var i = 0; i < jsonData.animations.length; i++) {
                    var animation = jsonData.animations[i];
                    animatedSpriteType.addAnimation(animation.name);
                    for (var j = 0; j < animation.frames.length; j++) {
                        var frame = animation.frames[j];
                        animatedSpriteType.addAnimationFrame(animation.name, frame.index, frame.duration);
                    }
                }
                callback(animatedSpriteType);
            });
        };
    }
    // ACCESSOR METHODS


    _createClass(ResourceManager, [{
        key: "getShaderSource",
        value: function getShaderSource(shaderName) {
            return this.gameShadersSource.get(shaderName);
        }
    }, {
        key: "getAnimatedSpriteType",
        value: function getAnimatedSpriteType(spriteTypeName) {
            return this.gameSpriteTypes.get(spriteTypeName);
        }
    }, {
        key: "getTileSet",
        value: function getTileSet(tileSetName) {
            return this.gameTileSets.get(tileSetName);
        }
    }, {
        key: "getTexture",
        value: function getTexture(texturePath) {
            return this.gameTextures.get(texturePath);
        }
    }, {
        key: "clear",
        value: function clear() {
            // CLEAR THE SHADER SOURCE 
            this.gameShadersSource.clear();
            this.gameShadersSourcePaths.clear();
            // CLEAR THE SPRITE TYPES
            this.gameSpriteTypes.clear();
            this.gameSpriteTypePaths.clear();
            // CLEAR THE TEXTURES
            this.gameTextures.clear();
            // WE REALLY SHOULD ADD FUNCTIONALITY TO REMOVE
            // ALL THE RESOURCES FROM THE GPU ONE BY ONE
            // BUT THAT'S SOMETHING FOR THE FUTURE
        }
        /**
         * loadScene is responsible for loading all the external files needed for
         * playing the game. These will be used for loading the scene, maps,
         * animated sprites, textures, and shaders.
         */

    }, {
        key: "loadScene",
        value: function loadScene(scenePath, sceneGraph, renderingSystem, callback) {
            // CLEAR THE SCENE GRAPH TO GET RID OF ALL THE OLD STUFF
            // THAT MAY HAVE BEEN LOADED FOR SOME OTHER LEVEL
            sceneGraph.clear();
            // CLEAR ALL THE SCENE RESOURCES 
            this.clear();
            // WE HAVE OUR OWN CUSTOM JSON FILE FORMAT TO REPRESENT OUR SCENE
            var thisResourceManager = this;
            this.loadTextFile(scenePath, function (jsonSceneText) {
                var sceneData = JSON.parse(jsonSceneText);
                thisResourceManager.loadShadersSource(renderingSystem, sceneData.shaderSourcePaths, function () {
                    // NEXT LOAD THE MAP, WHICH WILL FORCE A LOADING OF
                    // ANY USED TILE SET TEXTURES AS WELL AS THE CREATION
                    // OF TILED LAYERS TO BE ADDED TO THE SCENE
                    thisResourceManager.loadMap(sceneData.mapPath, renderingSystem, sceneGraph, function () {
                        // NOW THAT THE MAP HAS BEEN LOADED LOAD ALL THE SPRITE TYPES
                        thisResourceManager.loadSpriteTypes(renderingSystem, sceneData.spriteTypePaths, function () {
                            // NOW WE CAN INIT ALL SHADERS
                            thisResourceManager.initAllShaders(renderingSystem, sceneGraph);
                            callback();
                        });
                    });
                });
            });
        }
    }, {
        key: "initAllShaders",
        value: function initAllShaders(renderingSystem, sceneGraph) {
            // SETUP THE SPRITE RENDERER FOR USE WITH THE SPRITE SHADER THAT'S BEEN LOADED
            var spriteRendererVertexShaderSource = this.getShaderSource("SPRITE_VERTEX_SHADER");
            var spriteRendererFragmentShaderSource = this.getShaderSource("SPRITE_FRAGMENT_SHADER");
            renderingSystem.getSpriteRenderer().init(renderingSystem.getWebGL(), spriteRendererVertexShaderSource, spriteRendererFragmentShaderSource, null);
            // SETUP THE TILED LAYER RENDERER FOR USE WITH THE TILED SHADER THAT'S BEEN LOADED
            var tiledLayerVertexShaderSource = this.getShaderSource("TILED_LAYER_VERTEX_SHADER");
            var tiledLayerFragmentShaderSource = this.getShaderSource("TILED_LAYER_FRAGMENT_SHADER");
            renderingSystem.getTiledLayerRenderer().init(renderingSystem.getWebGL(), tiledLayerVertexShaderSource, tiledLayerFragmentShaderSource, sceneGraph.getTiledLayers());
        }
    }, {
        key: "loadShadersSource",
        value: function loadShadersSource(renderingSystem, namedPaths, callback) {
            var _this2 = this;

            // START BY LOADING ALL THE SHADER SOURCE FILES THESE CAN THEN BE
            // RETRIEVED LATER BY THE RENDERERS WHEN ITS TIME TO BUILD THE 
            // SHADER PROGRAMS
            var thisResourceManager = this;
            this.numShadersLoaded = 0;
            this.numShadersToLoad = namedPaths.length;

            var _loop = function _loop(i) {
                var namedPath = namedPaths[i];
                var shaderName = namedPath.name;
                var shaderPath = namedPath.path;
                _this2.loadTextFile(shaderPath, function (shaderSourceCode) {
                    thisResourceManager.gameShadersSource.set(shaderName, shaderSourceCode);
                    thisResourceManager.gameShadersSourcePaths.set(shaderName, shaderPath);
                    thisResourceManager.completeLoadingShader(function () {
                        // ALL SOURCE CODE IS LOADED SO DO WHAT'S NEXT
                        callback();
                    });
                });
            };

            for (var i = 0; i < namedPaths.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: "buildPathToFileInSameDirectory",
        value: function buildPathToFileInSameDirectory(baseFileWithPath, targetFileName) {
            var lastIndexOfSlash = baseFileWithPath.lastIndexOf('/');
            var targetFilePath = "./";
            if (lastIndexOfSlash > 0) targetFilePath = baseFileWithPath.substring(0, lastIndexOfSlash);
            targetFilePath += "/" + targetFileName;
            return targetFilePath;
        }
    }, {
        key: "loadMap",
        value: function loadMap(mapPath, renderingSystem, sceneGraph, callback) {
            var thisResourceManager = this;
            this.loadTextFile(mapPath, function (jsonMapText) {
                var mapData = JSON.parse(jsonMapText);
                // WE ONLY USE ONE TILE SET
                var tilesetFileName = mapData.tilesets[0].image;
                var tilesetFilePath = thisResourceManager.buildPathToFileInSameDirectory(mapPath, tilesetFileName);
                // USE THE PATHS TOLOAD THE TILE SET TEXTURES
                thisResourceManager.loadTexture(tilesetFilePath, renderingSystem, function (tilesetTexture) {
                    // NOW THAT THE TILE SET TEXTURES HAVE BEEN LOADED,
                    // LOAD ALL THEIR ASSOCIATED TILESET DATA
                    for (var i = 0; i < mapData.tilesets.length; i++) {
                        var tileSetData = mapData.tilesets[i];
                        var rows = Math.ceil(tileSetData.tilecount / tileSetData.columns);
                        var tileSetToAdd = new TileSet_1.TileSet(tileSetData.name, tileSetData.columns, rows, tileSetData.tilewidth, tileSetData.tileheight, tileSetData.spacing, tileSetData.imagewidth, tileSetData.imageheight, tileSetData.firstgid - 1, tilesetTexture);
                        thisResourceManager.gameTileSets.set(tileSetToAdd.getName(), tileSetToAdd);
                    }
                    // AND NOW THAT THE TILE SETS HAVE BEEN LOADED
                    // WE CAN LOAD THE MAP'S TILED LAYERS, THOUGH NOTE
                    // IN THIS EXAMPLE WE ARE GOING TO KEEP IT SIMPLE
                    // AND ASSUME THERE IS ONLY ONE TILE SET
                    for (var _i = 0; _i < mapData.layers.length; _i++) {
                        var layerData = mapData.layers[_i];
                        // THIS LINE OF CODE IS FUNKY, WE CAN ONLY DO THIS WITH A SINGLE TILE SET,
                        // SO TO MAKE THIS A REAL GAME ENGINE THIS WOULD NEED TO BE FIXED
                        var layerTileSet = thisResourceManager.gameTileSets.values().next().value;
                        // WE ARE ASSUMING EACH LAYER USES JUST ONE TILE SET, WHICH MIGHT NOT
                        // NECESSARILY BE TRUE. BUT FOR NOW, LET'S JUST MAKE THE LAYERS ALL
                        // USING THE SAME TILE SET, ADD THE TILES, AND THEN ADD THEM TO THE SCENE GRAPH
                        var tiledLayer = new TiledLayer_1.TiledLayer(layerData.width, layerData.height, layerTileSet);
                        for (var j = 0; j < layerData.data.length; j++) {
                            var tileIndex = layerData.data[j] - 1;
                            tiledLayer.addTile(tileIndex);
                        }
                        sceneGraph.addLayer(tiledLayer);
                    }
                    callback();
                });
            });
        }
        /*
         * Loads the texturePath file argument and once
         * that is done it calls the callback function.
         */

    }, {
        key: "loadTexture",
        value: function loadTexture(texturePath, renderingSystem, callback) {
            var thisResourceManager = this;
            thisResourceManager.loadImage(texturePath, function (path, image) {
                var textureToLoad = new WebGLGameTexture_1.WebGLGameTexture();
                var id = thisResourceManager.gameTextures.size;
                thisResourceManager.gameTextures.set(path, textureToLoad);
                renderingSystem.initWebGLTexture(textureToLoad, id, image, function () {
                    callback(textureToLoad);
                });
            });
        }
        /*
         * Loads all the sprite types listed in the spriteTypePaths argument and once
         * that is done it calls the callback function.
         */

    }, {
        key: "loadSpriteTypes",
        value: function loadSpriteTypes(renderingSystem, spriteTypePaths, callback) {
            // THEN LOAD THE TEXTURES WE'LL BE USING
            this.numSpriteTypesToLoad = spriteTypePaths.length;
            this.numSpriteTypesLoaded = 0;
            var thisResourceManager = this;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = spriteTypePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var namedPath = _step.value;

                    var name = namedPath.name;
                    var path = namedPath.path;
                    this.loadSpriteType(renderingSystem, name, path, function () {
                        thisResourceManager.completeLoadingSpriteType(callback);
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        // PRIVATE HELPER METHODS
        // LOADS A NEW JSON FILE AND UPON COMPLETION CALLS THE callback FUNCTION

    }, {
        key: "loadTextFile",
        value: function loadTextFile(textFilePath, callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', textFilePath, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == 200) {
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }
        // CHECKS TO SEE IF ALL SHADER LOADING IS COMPLETE, IF YES, callback IS INVOKED

    }, {
        key: "completeLoadingShader",
        value: function completeLoadingShader(callback) {
            this.numShadersLoaded++;
            if (this.numShadersLoaded === this.numShadersToLoad) {
                callback();
            }
        }
        // CHECKS TO SEE IF ALL SPRITE TYPE LOADING IS COMPLETE, IF YES, callback IS INVOKED

    }, {
        key: "completeLoadingSpriteType",
        value: function completeLoadingSpriteType(callback) {
            this.numSpriteTypesLoaded++;
            if (this.numSpriteTypesLoaded === this.numSpriteTypesToLoad) {
                callback();
            }
        }
        // CHECKS TO SEE IF ALL TEXTURE LOADING IS COMPLETE, IF YES, callback IS INVOKED

    }, {
        key: "completeLoadingTexture",
        value: function completeLoadingTexture(callback) {
            this.numTexturesLoaded++;
            if (this.numTexturesLoaded === this.numTexturesToLoad) {
                callback();
            }
        }
        /**
         * Loads an Image into RAM and once that process is complete it
         * calls the callback method argument, presumably to then load
         * it into GPU memory.
         */

    }, {
        key: "loadImage",
        value: function loadImage(path, callback) {
            // MAKE THE IMAGE
            var image = new Image();
            // ONCE THE IMAGE LOADING IS COMPLETED, THE CALLBACK WILL GET CALLED
            image.onload = function () {
                callback(path, image);
            };
            // START IMAGE LOADING
            image.src = path;
        }
        /*
         * This function loads a single sprite type resource from a JSON file and upon
         * completion calls the callback function.
         */

    }, {
        key: "loadSpriteType",
        value: function loadSpriteType(renderingSystem, spriteTypeName, jsonFilePath, callback) {
            var thisResourceManager = this;
            this.loadTextFile(jsonFilePath, function (jsonText) {
                thisResourceManager.loadSpriteTypeData(renderingSystem, jsonFilePath, jsonText, function (spriteType) {
                    thisResourceManager.gameSpriteTypes.set(spriteTypeName, spriteType);
                    thisResourceManager.gameSpriteTypePaths.set(spriteTypeName, jsonFilePath);
                    callback();
                });
            });
        }
    }]);

    return ResourceManager;
}();

exports.ResourceManager = ResourceManager;

},{"../rendering/WebGLGameTexture":13,"../scene/sprite/AnimatedSpriteType":19,"../scene/tiles/TileSet":21,"../scene/tiles/TiledLayer":22}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var GameLoopTemplate = function () {
    function GameLoopTemplate() {
        _classCallCheck(this, GameLoopTemplate);

        // An exponential moving average of the frames per second.
        this.fps = 60;
        // The amount of time (in milliseconds) to simulate each time update() runs.
        // See `MainLoop.setSimulationTimestep()` for details.
        this.simulationTimestep = 1000 / this.fps;
        // The cumulative amount of in-app time that hasn't been simulated yet.
        // See the comments inside animate() for details.
        this.frameDelta = 0;
        // The timestamp in milliseconds of the last time the main loop was run.
        // Used to compute the time elapsed between frames.
        this.lastFrameTimeMs = 0;
        // A factor that affects how heavily to weight more recent seconds'
        // performance when calculating the average frames per second. Valid values
        // range from zero to one inclusive. Higher values result in weighting more
        // recent seconds more heavily.
        this.fpsAlpha = 0.9;
        // The minimum duration between updates to the frames-per-second estimate.
        // Higher values increase accuracy, but result in slower updates.
        this.fpsUpdateInterval = 1000;
        // The timestamp (in milliseconds) of the last time the `fps` moving
        // average was updated.
        this.lastFpsUpdate = 0;
        // The number of frames delivered since the last time the `fps` moving
        // average was updated (i.e. since `lastFpsUpdate`).
        this.framesSinceLastFpsUpdate = 0;
        // The number of times update() is called in a given frame. This is only
        // relevant inside of animate(), but a reference is held externally so that
        // this variable is not marked for garbage collection every time the main
        // loop runs.
        this.numUpdateSteps = 0;
        // The minimum amount of time in milliseconds that must pass since the last
        // frame was executed before another frame can be executed. The
        // multiplicative inverse caps the FPS (the default of zero means there is
        // no cap).
        this.minFrameDelay = 0;
        // Whether the main loop is running.
        this.running = false;
        // `true` if `MainLoop.start()` has been called and the most recent time it
        // was called has not been followed by a call to `MainLoop.stop()`. This is
        // different than `running` because there is a delay of a few milliseconds
        // after `MainLoop.start()` is called before the application is considered
        // "running." This delay is due to waiting for the next frame.
        this.started = false;
        // Whether the simulation has fallen too far behind real time.
        // Specifically, `panic` will be set to `true` if too many updates occur in
        // one frame. This is only relevant inside of animate(), but a reference is
        // held externally so that this variable is not marked for garbage
        // collection every time the main loop runs.
        this.panic = false;
    }
    /**
     * Gets how many milliseconds should be simulated by every run of update().
     *
     * See `MainLoop.setSimulationTimestep()` for details on this value.
     *
     * @return {Number}
     *   The number of milliseconds that should be simulated by every run of
     *   {@link #setUpdate update}().
     */


    _createClass(GameLoopTemplate, [{
        key: "getSimulationTimestep",
        value: function getSimulationTimestep() {
            return this.simulationTimestep;
        }
        /**
         * Sets how many milliseconds should be simulated by every run of update().
         *
         * The perceived frames per second (FPS) is effectively capped at the
         * multiplicative inverse of the simulation timestep. That is, if the
         * timestep is 1000 / 60 (which is the default), then the maximum perceived
         * FPS is effectively 60. Decreasing the timestep increases the maximum
         * perceived FPS at the cost of running {@link #setUpdate update}() more
         * times per frame at lower frame rates. Since running update() more times
         * takes more time to process, this can actually slow down the frame rate.
         * Additionally, if the amount of time it takes to run update() exceeds or
         * very nearly exceeds the timestep, the application will freeze and crash
         * in a spiral of death (unless it is rescued; see `MainLoop.setEnd()` for
         * an explanation of what can be done if a spiral of death is occurring).
         *
         * The exception to this is that interpolating between updates for each
         * render can increase the perceived frame rate and reduce visual
         * stuttering. See `MainLoop.setDraw()` for an explanation of how to do
         * this.
         *
         * If you are considering decreasing the simulation timestep in order to
         * raise the maximum perceived FPS, keep in mind that most monitors can't
         * display more than 60 FPS. Whether humans can tell the difference among
         * high frame rates depends on the application, but for reference, film is
         * usually displayed at 24 FPS, other videos at 30 FPS, most games are
         * acceptable above 30 FPS, and virtual reality might require 75 FPS to
         * feel natural. Some gaming monitors go up to 144 FPS. Setting the
         * timestep below 1000 / 144 is discouraged and below 1000 / 240 is
         * strongly discouraged. The default of 1000 / 60 is good in most cases.
         *
         * The simulation timestep should typically only be changed at
         * deterministic times (e.g. before the main loop starts for the first
         * time, and not in response to user input or slow frame rates) to avoid
         * introducing non-deterministic behavior. The update timestep should be
         * the same for all players/users in multiplayer/multi-user applications.
         *
         * See also `MainLoop.getSimulationTimestep()`.
         *
         * @param {Number} timestep
         *   The number of milliseconds that should be simulated by every run of
         *   {@link #setUpdate update}().
         */

    }, {
        key: "setSimulationTimestep",
        value: function setSimulationTimestep(timestep) {
            this.simulationTimestep = timestep;
        }
        /**
         * Returns the exponential moving average of the frames per second.
         *
         * @return {Number}
         *   The exponential moving average of the frames per second.
         */

    }, {
        key: "getFPS",
        value: function getFPS() {
            return this.fps;
        }
        /**
         * Gets the maximum frame rate.
         *
         * Other factors also limit the FPS; see `MainLoop.setSimulationTimestep`
         * for details.
         *
         * See also `MainLoop.setMaxAllowedFPS()`.
         *
         * @return {Number}
         *   The maximum number of frames per second allowed.
         */

    }, {
        key: "getMaxAllowedFPS",
        value: function getMaxAllowedFPS() {
            return 1000 / this.minFrameDelay;
        }
        /**
         * Sets a maximum frame rate.
         *
         * See also `MainLoop.getMaxAllowedFPS()`.
         *
         * @param {Number} [fps=Infinity]
         *   The maximum number of frames per second to execute. If Infinity or not
         *   passed, there will be no FPS cap (although other factors do limit the
         *   FPS; see `MainLoop.setSimulationTimestep` for details). If zero, this
         *   will stop the loop, and when the loop is next started, it will return
         *   to the previous maximum frame rate. Passing negative values will stall
         *   the loop until this function is called again with a positive value.
         *
         * @chainable
         */

    }, {
        key: "setMaxAllowedFPS",
        value: function setMaxAllowedFPS(fps) {
            if (typeof fps === 'undefined') {
                fps = Infinity;
            }
            if (fps === 0) {
                this.stop();
            } else {
                // Dividing by Infinity returns zero.
                this.minFrameDelay = 1000 / fps;
            }
        }
        /**
         * Reset the amount of time that has not yet been simulated to zero.
         *
         * This introduces non-deterministic behavior if called after the
         * application has started running (unless it is being reset, in which case
         * it doesn't matter). However, this can be useful in cases where the
         * amount of time that has not yet been simulated has grown very large
         * (for example, when the application's tab gets put in the background and
         * the browser throttles the timers as a result). In applications with
         * lockstep the player would get dropped, but in other networked
         * applications it may be necessary to snap or ease the player/user to the
         * authoritative state and discard pending updates in the process. In
         * non-networked applications it may also be acceptable to simply resume
         * the application where it last left off and ignore the accumulated
         * unsimulated time.
         *
         * @return {Number}
         *   The cumulative amount of elapsed time in milliseconds that has not yet
         *   been simulated, but is being discarded as a result of calling this
         *   function.
         */

    }, {
        key: "resetFrameDelta",
        value: function resetFrameDelta() {
            var oldFrameDelta = this.frameDelta;
            this.frameDelta = 0;
            return oldFrameDelta;
        }
        /**
         * Starts the main loop.
         *
         * Note that the application is not considered "running" immediately after
         * this function returns; rather, it is considered "running" after the
         * application draws its first frame. The distinction is that event
         * handlers should remain paused until the application is running, even
         * after `MainLoop.start()` is called. Check `MainLoop.isRunning()` for the
         * current status. To act after the application starts, register a callback
         * with requestAnimationFrame() after calling this function and execute the
         * action in that callback. It is safe to call `MainLoop.start()` multiple
         * times even before the application starts running and without calling
         * `MainLoop.stop()` in between, although there is no reason to do this;
         * the main loop will only start if it is not already started.
         *
         * See also `MainLoop.stop()`.
         */

    }, {
        key: "start",
        value: function start() {
            if (!this.started) {
                // Since the application doesn't start running immediately, track
                // whether this function was called and use that to keep it from
                // starting the main loop multiple times.
                this.started = true;
                // In the main loop, draw() is called after update(), so if we
                // entered the main loop immediately, we would never render the
                // initial state before any updates occur. Instead, we run one
                // frame where all we do is draw, and then start the main loop with
                // the next frame.
                this.raf = requestAnimationFrame(this.startLoop.bind(this));
            }
        }
    }, {
        key: "startLoop",
        value: function startLoop(timestamp) {
            // Render the initial state before any updates occur.
            this.draw(1);
            // The application isn't considered "running" until the
            // application starts drawing.
            this.running = true;
            // Reset variables that are used for tracking time so that we
            // don't simulate time passed while the application was paused.
            this.lastFrameTimeMs = timestamp;
            this.lastFpsUpdate = timestamp;
            this.framesSinceLastFpsUpdate = 0;
            // Start the main loop.
            this.raf = window.requestAnimationFrame(this.animate.bind(this));
        }
        /**
         * Returns whether the main loop is currently running.
         *
         * See also `MainLoop.start()` and `MainLoop.stop()`.
         *
         * @return {Boolean}
         *   Whether the main loop is currently running.
         */

    }, {
        key: "isRunning",
        value: function isRunning() {
            return this.running;
        }
        /**
         * Stops the main loop.
         *
         * Event handling and other background tasks should also be paused when the
         * main loop is paused.
         *
         * Note that pausing in multiplayer/multi-user applications will cause the
         * player's/user's client to become out of sync. In this case the
         * simulation should exit, or the player/user needs to be snapped to their
         * updated position when the main loop is started again.
         *
         * See also `MainLoop.start()` and `MainLoop.isRunning()`.
         */

    }, {
        key: "stop",
        value: function stop() {
            this.running = false;
            this.started = false;
            window.cancelAnimationFrame(this.raf);
        }
        /**
         * The main loop that runs updates and rendering.
         *
         * @param {DOMHighResTimeStamp} timestamp
         * The current timestamp. In practice this is supplied by
         * requestAnimationFrame at the time that it starts to fire callbacks. This
         * should only be used for comparison to other timestamps because the epoch
         * (i.e. the "zero" time) depends on the engine running this code. In engines
         * that support `DOMHighResTimeStamp` (all modern browsers except iOS Safari
         * 8) the epoch is the time the page started loading, specifically
         * `performance.timing.navigationStart`. Everywhere else, including node.js,
         * the epoch is the Unix epoch (1970-01-01T00:00:00Z).
         *
         * @ignore
         */

    }, {
        key: "animate",
        value: function animate(timestamp) {
            // Run the loop again the next time the browser is ready to render.
            // We set rafHandle immediately so that the next frame can be canceled
            // during the current frame.
            this.raf = window.requestAnimationFrame(this.animate.bind(this));
            // Throttle the frame rate (if minFrameDelay is set to a non-zero value by
            // `MainLoop.setMaxAllowedFPS()`).
            if (timestamp < this.lastFrameTimeMs + this.minFrameDelay) {
                return;
            }
            // frameDelta is the cumulative amount of in-app time that hasn't been
            // simulated yet. Add the time since the last frame. We need to track total
            // not-yet-simulated time (as opposed to just the time elapsed since the
            // last frame) because not all actually elapsed time is guaranteed to be
            // simulated each frame. See the comments below for details.
            this.frameDelta += timestamp - this.lastFrameTimeMs;
            this.lastFrameTimeMs = timestamp;
            // Run any updates that are not dependent on time in the simulation. See
            // `MainLoop.setBegin()` for additional details on how to use this.
            this.begin(timestamp, this.frameDelta);
            // Update the estimate of the frame rate, `fps`. Approximately every
            // second, the number of frames that occurred in that second are included
            // in an exponential moving average of all frames per second. This means
            // that more recent seconds affect the estimated frame rate more than older
            // seconds.
            if (timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
                // Compute the new exponential moving average.
                this.fps =
                // Divide the number of frames since the last FPS update by the
                // amount of time that has passed to get the mean frames per second
                // over that period. This is necessary because slightly more than a
                // second has likely passed since the last update.
                this.fpsAlpha * this.framesSinceLastFpsUpdate * 1000 / (timestamp - this.lastFpsUpdate) + (1 - this.fpsAlpha) * this.fps;
                // Reset the frame counter and last-updated timestamp since their
                // latest values have now been incorporated into the FPS estimate.
                this.lastFpsUpdate = timestamp;
                this.framesSinceLastFpsUpdate = 0;
            }
            // Count the current frame in the next frames-per-second update. This
            // happens after the previous section because the previous section
            // calculates the frames that occur up until `timestamp`, and `timestamp`
            // refers to a time just before the current frame was delivered.
            this.framesSinceLastFpsUpdate++;
            /*
             * A naive way to move an object along its X-axis might be to write a main
             * loop containing the statement `obj.x += 10;` which would move the object
             * 10 units per frame. This approach suffers from the issue that it is
             * dependent on the frame rate. In other words, if your application is
             * running slowly (that is, fewer frames per second), your object will also
             * appear to move slowly, whereas if your application is running quickly
             * (that is, more frames per second), your object will appear to move
             * quickly. This is undesirable, especially in multiplayer/multi-user
             * applications.
             *
             * One solution is to multiply the speed by the amount of time that has
             * passed between rendering frames. For example, if you want your object to
             * move 600 units per second, you might write `obj.x += 600 * delta`, where
             * `delta` is the time passed since the last frame. (For convenience, let's
             * move this statement to an update() function that takes `delta` as a
             * parameter.) This way, your object will move a constant distance over
             * time. However, at low frame rates and high speeds, your object will move
             * large distances every frame, which can cause it to do strange things
             * such as move through walls. Additionally, we would like our program to
             * be deterministic. That is, every time we run the application with the
             * same input, we would like exactly the same output. If the time between
             * frames (the `delta`) varies, our output will diverge the longer the
             * program runs due to accumulated rounding errors, even at normal frame
             * rates.
             *
             * A better solution is to separate the amount of time simulated in each
             * update() from the amount of time between frames. Our update() function
             * doesn't need to change; we just need to change the delta we pass to it
             * so that each update() simulates a fixed amount of time (that is, `delta`
             * should have the same value each time update() is called). The update()
             * function can be run multiple times per frame if needed to simulate the
             * total amount of time passed since the last frame. (If the time that has
             * passed since the last frame is less than the fixed simulation time, we
             * just won't run an update() until the the next frame. If there is
             * unsimulated time left over that is less than our timestep, we'll just
             * leave it to be simulated during the next frame.) This approach avoids
             * inconsistent rounding errors and ensures that there are no giant leaps
             * through walls between frames.
             *
             * That is what is done below. It introduces a new problem, but it is a
             * manageable one: if the amount of time spent simulating is consistently
             * longer than the amount of time between frames, the application could
             * freeze and crash in a spiral of death. This won't happen as long as the
             * fixed simulation time is set to a value that is high enough that
             * update() calls usually take less time than the amount of time they're
             * simulating. If it does start to happen anyway, see `MainLoop.setEnd()`
             * for a discussion of ways to stop it.
             *
             * Additionally, see `MainLoop.setUpdate()` for a discussion of performance
             * considerations.
             *
             * Further reading for those interested:
             *
             * - http://gameprogrammingpatterns.com/game-loop.html
             * - http://gafferongames.com/game-physics/fix-your-timestep/
             * - https://gamealchemist.wordpress.com/2013/03/16/thoughts-on-the-javascript-game-loop/
             * - https://developer.mozilla.org/en-US/docs/Games/Anatomy
             */
            this.numUpdateSteps = 0;
            while (this.frameDelta >= this.simulationTimestep) {
                this.update(this.simulationTimestep);
                this.frameDelta -= this.simulationTimestep;
                /*
                 * Sanity check: bail if we run the loop too many times.
                 *
                 * One way this could happen is if update() takes longer to run than
                 * the time it simulates, thereby causing a spiral of death. For ways
                 * to avoid this, see `MainLoop.setEnd()`. Another way this could
                 * happen is if the browser throttles serving frames, which typically
                 * occurs when the tab is in the background or the device battery is
                 * low. An event outside of the main loop such as audio processing or
                 * synchronous resource reads could also cause the application to hang
                 * temporarily and accumulate not-yet-simulated time as a result.
                 *
                 * 240 is chosen because, for any sane value of simulationTimestep, 240
                 * updates will simulate at least one second, and it will simulate four
                 * seconds with the default value of simulationTimestep. (Safari
                 * notifies users that the script is taking too long to run if it takes
                 * more than five seconds.)
                 *
                 * If there are more updates to run in a frame than this, the
                 * application will appear to slow down to the user until it catches
                 * back up. In networked applications this will usually cause the user
                 * to get out of sync with their peers, but if the updates are taking
                 * this long already, they're probably already out of sync.
                 */
                if (++this.numUpdateSteps >= 240) {
                    this.panic = true;
                    break;
                }
            }
            /*
             * Render the screen. We do this regardless of whether update() has run
             * during this frame because it is possible to interpolate between updates
             * to make the frame rate appear faster than updates are actually
             * happening. See `MainLoop.setDraw()` for an explanation of how to do
             * that.
             *
             * We draw after updating because we want the screen to reflect a state of
             * the application that is as up-to-date as possible. (`MainLoop.start()`
             * draws the very first frame in the application's initial state, before
             * any updates have occurred.) Some sources speculate that rendering
             * earlier in the requestAnimationFrame callback can get the screen painted
             * faster; this is mostly not true, and even when it is, it's usually just
             * a trade-off between rendering the current frame sooner and rendering the
             * next frame later.
             *
             * See `MainLoop.setDraw()` for details about draw() itself.
             */
            this.draw(this.frameDelta / this.simulationTimestep);
            // Run any updates that are not dependent on time in the simulation. See
            // `MainLoop.setEnd()` for additional details on how to use this.
            this.end(this.fps, this.panic);
            this.panic = false;
        }
    }]);

    return GameLoopTemplate;
}();

exports.GameLoopTemplate = GameLoopTemplate;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * MathUtilities provides a number of services for rendering using 4x4 matrices, like
 * transformting (i.e. translation, rotation, and scaling) 3d or 2d points from world
 * coordinate systems to screen coordinate systems.
 */
var Matrix_1 = require("./Matrix");
var MathUtilities;
(function (MathUtilities) {
    function determinant4x4(result) {
        var det0 = result.get(0, 0) * (result.get(1, 1) * (result.get(2, 2) * result.get(3, 3) - result.get(2, 3) * result.get(3, 2)) - result.get(1, 2) * (result.get(2, 1) * result.get(3, 3) - result.get(2, 3) * result.get(3, 1)) + result.get(1, 3) * (result.get(2, 1) * result.get(3, 2) - result.get(3, 1) * result.get(2, 2)));
        var det1 = result.get(0, 1) * (result.get(1, 0) * (result.get(2, 2) * result.get(3, 3) - result.get(2, 3) * result.get(3, 2)) - result.get(1, 2) * (result.get(2, 0) * result.get(3, 3) - result.get(3, 0) * result.get(2, 3)) + result.get(1, 3) * (result.get(2, 0) * result.get(3, 2) - result.get(3, 0) * result.get(2, 2)));
        var det2 = result.get(0, 2) * (result.get(1, 0) * (result.get(2, 1) * result.get(3, 3) - result.get(2, 3) * result.get(3, 1)) - result.get(1, 1) * (result.get(2, 0) * result.get(3, 3) - result.get(2, 3) * result.get(3, 0)) + result.get(1, 3) * (result.get(2, 0) * result.get(3, 1) - result.get(2, 1) * result.get(3, 0)));
        var det3 = result.get(0, 3) * (result.get(1, 0) * (result.get(2, 1) * result.get(3, 2) - result.get(2, 2) * result.get(3, 1)) - result.get(1, 1) * (result.get(2, 0) * result.get(3, 2) - result.get(2, 2) * result.get(3, 0)) + result.get(1, 2) * (result.get(2, 0) * result.get(3, 1) - result.get(2, 1) * result.get(3, 0)));
        var det = det0 - det1 + det2 - det3;
        console.log("det = " + det0 + " + " + det1 + " + " + det2 + " + " + det3);
        return det;
    }
    MathUtilities.determinant4x4 = determinant4x4;
    function identity(result) {
        if (result.getRows() === result.getColumns()) {
            for (var i = 0; i < result.getRows(); i++) {
                for (var j = 0; j < result.getColumns(); j++) {
                    if (i === j) result.set(1.0, i, j);else result.set(0.0, i, j);
                }
            }
        }
    }
    MathUtilities.identity = identity;
    function inverse(result, mat) {
        var det = this.determinant(mat);
        var m00 = mat.get(0, 0);
        var m01 = mat.get(0, 1);
        var m02 = mat.get(0, 2);
        var m03 = mat.get(0, 3);
        var m10 = mat.get(1, 0);
        var m11 = mat.get(1, 1);
        var m12 = mat.get(1, 2);
        var m13 = mat.get(1, 3);
        var m20 = mat.get(2, 0);
        var m21 = mat.get(2, 1);
        var m22 = mat.get(2, 2);
        var m23 = mat.get(2, 3);
        var m30 = mat.get(3, 0);
        var m31 = mat.get(3, 1);
        var m32 = mat.get(3, 2);
        var m33 = mat.get(3, 3);
        var temp = new Matrix_1.Matrix(4, 4);
        temp.set(m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33, 0, 0);
        temp.set(m03 * m22 * m31 - m02 * m23 * m31 - m03 * m21 * m32 + m01 * m23 * m32 + m02 * m21 * m33 - m01 * m22 * m33, 0, 1);
        temp.set(m02 * m13 * m31 - m03 * m12 * m31 + m03 * m11 * m32 - m01 * m13 * m32 - m02 * m11 * m33 + m01 * m12 * m33, 0, 2);
        temp.set(m03 * m12 * m21 - m02 * m13 * m21 - m03 * m11 * m22 + m01 * m13 * m22 + m02 * m11 * m23 - m01 * m12 * m23, 0, 3);
        temp.set(m13 * m22 * m30 - m12 * m23 * m30 - m13 * m20 * m32 + m10 * m23 * m32 + m12 * m20 * m33 - m10 * m22 * m33, 1, 0);
        temp.set(m02 * m23 * m30 - m03 * m22 * m30 + m03 * m20 * m32 - m00 * m23 * m32 - m02 * m20 * m33 + m00 * m22 * m33, 1, 1);
        temp.set(m03 * m12 * m30 - m02 * m13 * m30 - m03 * m10 * m32 + m00 * m13 * m32 + m02 * m10 * m33 - m00 * m12 * m33, 1, 2);
        temp.set(m02 * m13 * m20 - m03 * m12 * m20 + m03 * m10 * m22 - m00 * m13 * m22 - m02 * m10 * m23 + m00 * m12 * m23, 1, 3);
        temp.set(m11 * m23 * m30 - m13 * m21 * m30 + m13 * m20 * m31 - m10 * m23 * m31 - m11 * m20 * m33 + m10 * m21 * m33, 2, 0);
        temp.set(m03 * m21 * m30 - m01 * m23 * m30 - m03 * m20 * m31 + m00 * m23 * m31 + m01 * m20 * m33 - m00 * m21 * m33, 2, 1);
        temp.set(m01 * m13 * m30 - m03 * m11 * m30 + m03 * m10 * m31 - m00 * m13 * m31 - m01 * m10 * m33 + m00 * m11 * m33, 2, 2);
        temp.set(m03 * m11 * m20 - m01 * m13 * m20 - m03 * m10 * m21 + m00 * m13 * m21 + m01 * m10 * m23 - m00 * m11 * m23, 2, 3);
        temp.set(m12 * m21 * m30 - m11 * m22 * m30 - m12 * m20 * m31 + m10 * m22 * m31 + m11 * m20 * m32 - m10 * m21 * m32, 3, 0);
        temp.set(m01 * m22 * m30 - m02 * m21 * m30 + m02 * m20 * m31 - m00 * m22 * m31 - m01 * m20 * m32 + m00 * m21 * m32, 3, 1);
        temp.set(m02 * m11 * m30 - m01 * m12 * m30 - m02 * m10 * m31 + m00 * m12 * m31 + m01 * m10 * m32 - m00 * m11 * m32, 3, 2);
        temp.set(m01 * m12 * m20 - m02 * m11 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 + m00 * m11 * m22, 3, 3);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                result.set(temp.get(i, j) / det, i, j);
            }
        }
    }
    MathUtilities.inverse = inverse;
    function model(result, translation, rotation, scale) {
        // TRANSLATION MATRIX	
        var translationMatrix = new Matrix_1.Matrix(4, 4);
        this.identity(translationMatrix);
        this.translate(translationMatrix, translation);
        // ROTATION MATRIX
        var rotationMatrix = new Matrix_1.Matrix(4, 4);
        this.identity(rotationMatrix);
        this.rotate(rotationMatrix, rotation);
        // SCALING MATRIX
        var scaleMatrix = new Matrix_1.Matrix(4, 4);
        this.identity(scaleMatrix);
        this.scale(scaleMatrix, scale);
        // AND NOW MULTIPLY THEM TOGETHER IN THE CORRECT ORDER
        var tempMatrix = new Matrix_1.Matrix(4, 4);
        this.multiply(tempMatrix, translationMatrix, rotationMatrix);
        this.multiply(result, tempMatrix, scaleMatrix);
    }
    MathUtilities.model = model;
    function multiply(result, mat0, mat1) {
        // result MIGHT BE mat0 OR mat1 SO IT'S BEST IF WE
        // CALCULATE TEMP VALUES FIRST BEFORE ASSIGNMENT
        var r00 = mat0.get(0, 0) * mat1.get(0, 0) + mat0.get(0, 1) * mat1.get(1, 0) + mat0.get(0, 2) * mat1.get(2, 0) + mat0.get(0, 3) * mat1.get(3, 0);
        var r10 = mat0.get(1, 0) * mat1.get(0, 0) + mat0.get(1, 1) * mat1.get(1, 0) + mat0.get(1, 2) * mat1.get(2, 0) + mat0.get(1, 3) * mat1.get(3, 0);
        var r20 = mat0.get(2, 0) * mat1.get(0, 0) + mat0.get(2, 1) * mat1.get(1, 0) + mat0.get(2, 2) * mat1.get(2, 0) + mat0.get(2, 3) * mat1.get(3, 0);
        var r30 = mat0.get(3, 0) * mat1.get(0, 0) + mat0.get(3, 1) * mat1.get(1, 0) + mat0.get(3, 2) * mat1.get(2, 0) + mat0.get(3, 3) * mat1.get(3, 0);
        var r01 = mat0.get(0, 0) * mat1.get(0, 1) + mat0.get(0, 1) * mat1.get(1, 1) + mat0.get(0, 2) * mat1.get(2, 1) + mat0.get(0, 3) * mat1.get(3, 1);
        var r11 = mat0.get(1, 0) * mat1.get(0, 1) + mat0.get(1, 1) * mat1.get(1, 1) + mat0.get(1, 2) * mat1.get(2, 1) + mat0.get(1, 3) * mat1.get(3, 1);
        var r21 = mat0.get(2, 0) * mat1.get(0, 1) + mat0.get(2, 1) * mat1.get(1, 1) + mat0.get(2, 2) * mat1.get(2, 1) + mat0.get(2, 3) * mat1.get(3, 1);
        var r31 = mat0.get(3, 0) * mat1.get(0, 1) + mat0.get(3, 1) * mat1.get(1, 1) + mat0.get(3, 2) * mat1.get(2, 1) + mat0.get(3, 3) * mat1.get(3, 1);
        var r02 = mat0.get(0, 0) * mat1.get(0, 2) + mat0.get(0, 1) * mat1.get(1, 2) + mat0.get(0, 2) * mat1.get(2, 2) + mat0.get(0, 3) * mat1.get(3, 2);
        var r12 = mat0.get(1, 0) * mat1.get(0, 2) + mat0.get(1, 1) * mat1.get(1, 2) + mat0.get(1, 2) * mat1.get(2, 2) + mat0.get(1, 3) * mat1.get(3, 2);
        var r22 = mat0.get(2, 0) * mat1.get(0, 2) + mat0.get(2, 1) * mat1.get(1, 2) + mat0.get(2, 2) * mat1.get(2, 2) + mat0.get(2, 3) * mat1.get(3, 2);
        var r32 = mat0.get(3, 0) * mat1.get(0, 2) + mat0.get(3, 1) * mat1.get(1, 2) + mat0.get(3, 2) * mat1.get(2, 2) + mat0.get(3, 3) * mat1.get(3, 2);
        var r03 = mat0.get(0, 0) * mat1.get(0, 3) + mat0.get(0, 1) * mat1.get(1, 3) + mat0.get(0, 2) * mat1.get(2, 3) + mat0.get(0, 3) * mat1.get(3, 3);
        var r13 = mat0.get(1, 0) * mat1.get(0, 3) + mat0.get(1, 1) * mat1.get(1, 3) + mat0.get(1, 2) * mat1.get(2, 3) + mat0.get(1, 3) * mat1.get(3, 3);
        var r23 = mat0.get(2, 0) * mat1.get(0, 3) + mat0.get(2, 1) * mat1.get(1, 3) + mat0.get(2, 2) * mat1.get(2, 3) + mat0.get(2, 3) * mat1.get(3, 3);
        var r33 = mat0.get(3, 0) * mat1.get(0, 3) + mat0.get(3, 1) * mat1.get(1, 3) + mat0.get(3, 2) * mat1.get(2, 3) + mat0.get(3, 3) * mat1.get(3, 3);
        // NOW PUT ALL THE CALCULATED VALUES IN THE result MATRIX
        result.set(r00, 0, 0);
        result.set(r10, 1, 0);
        result.set(r20, 2, 0);
        result.set(r30, 3, 0);
        result.set(r01, 0, 1);
        result.set(r11, 1, 1);
        result.set(r21, 2, 1);
        result.set(r31, 3, 1);
        result.set(r02, 0, 2);
        result.set(r12, 1, 2);
        result.set(r22, 2, 2);
        result.set(r32, 3, 2);
        result.set(r03, 0, 3);
        result.set(r13, 1, 3);
        result.set(r23, 2, 3);
        result.set(r33, 3, 3);
    }
    MathUtilities.multiply = multiply;
    function projection(result, nearZ, farZ, viewportWidth, viewportHeight, fovY) {
        var aspectRatio = viewportWidth / viewportHeight;
        var fieldOfViewY = this.math.degreesToRadians(fovY);
        var fieldOfViewX = 2 * Math.atan(Math.tan(fieldOfViewY / 2) * aspectRatio);
        // WE'LL USE THESE AS SHORTHAND FOR LOADING OUR MATRIX
        var n = nearZ;
        var f = farZ;
        var r = Math.tan(fieldOfViewX / 2) * n;
        var t = Math.tan(fieldOfViewY / 2) * n;
        // 0-3
        result.set(n / r, 0, 0);
        result.set(0.0, 0, 1);
        result.set(0.0, 0, 2);
        result.set(0.0, 0, 3);
        // 4-7
        result.set(0.0, 1, 0);
        result.set(n / t, 1, 1);
        result.set(0.0, 1, 2);
        result.set(0.0, 1, 3);
        // 8-11
        result.set(0.0, 2, 0);
        result.set(0.0, 2, 1);
        result.set(-(f + n) / (f - n), 2, 2);
        result.set(-2 * f * n / (f - n), 2, 3);
        // 12-15 
        result.set(0.0, 3, 0);
        result.set(0.0, 3, 1);
        result.set(-1.0, 3, 2);
        result.set(0.0, 3, 3);
    }
    MathUtilities.projection = projection;
    function rotate(result, rotationVector) {
        // START WITH THE X-AXIS ROTATION
        var xRotationMatrix = new Matrix_1.Matrix(4, 4);
        this.identity(xRotationMatrix);
        var thetaX = rotationVector.getThetaX();
        xRotationMatrix.set(Math.cos(thetaX), 1, 1);
        xRotationMatrix.set(Math.sin(thetaX), 2, 1);
        xRotationMatrix.set(-1 * Math.sin(thetaX), 1, 2);
        xRotationMatrix.set(Math.cos(thetaX), 2, 2);
        // START WITH THE Y-AXIS ROTATION
        var yRotationMatrix = new Matrix_1.Matrix(4, 4);
        this.identity(yRotationMatrix);
        var thetaY = rotationVector.getThetaY();
        yRotationMatrix.set(Math.cos(thetaY), 0, 0);
        yRotationMatrix.set(-1 * Math.sin(thetaY), 2, 0);
        yRotationMatrix.set(Math.sin(thetaY), 0, 2);
        yRotationMatrix.set(Math.cos(thetaY), 2, 2);
        // START WITH THE Z-AXIS ROTATION
        var zRotationMatrix = new Matrix_1.Matrix(4, 4);
        this.identity(zRotationMatrix);
        var thetaZ = rotationVector.getThetaZ();
        zRotationMatrix.set(Math.cos(thetaZ), 0, 0);
        zRotationMatrix.set(Math.sin(thetaZ), 1, 0);
        zRotationMatrix.set(-1 * Math.sin(thetaZ), 0, 1);
        zRotationMatrix.set(Math.cos(thetaZ), 1, 1);
        // START WITH THE X-AXIS ROTATION
        var tempMatrix = new Matrix_1.Matrix(4, 4);
        this.identity(tempMatrix);
        this.multiply(tempMatrix, xRotationMatrix, yRotationMatrix);
        this.multiply(result, tempMatrix, zRotationMatrix);
    }
    MathUtilities.rotate = rotate;
    function scale(result, scaleVector) {
        // START WITH THE IDENTITY MATRIX
        this.identity(result, scaleVector);
        // AND THEN LOAD IN THE TRANSLATION VALUES
        result.set(scaleVector.getX(), 0, 0);
        result.set(scaleVector.getY(), 1, 1);
        result.set(scaleVector.getZ(), 2, 2);
    }
    MathUtilities.scale = scale;
    function transform(result, mat, vec) {
        result.setX(mat.get(0, 0) * vec.getX() + mat.get(0, 1) * vec.getY() + mat.get(0, 2) * vec.getZ() + mat.get(0, 3) * vec.getW());
        result.setY(mat.get(1, 0) * vec.getX() + mat.get(1, 1) * vec.getY() + mat.get(1, 2) * vec.getZ() + mat.get(1, 3) * vec.getW());
        result.setZ(mat.get(2, 0) * vec.getX() + mat.get(2, 1) * vec.getY() + mat.get(2, 2) * vec.getZ() + mat.get(2, 3) * vec.getW());
        result.setW(mat.get(3, 0) * vec.getX() + mat.get(3, 1) * vec.getY() + mat.get(3, 2) * vec.getZ() + mat.get(3, 3) * vec.getW());
    }
    MathUtilities.transform = transform;
    function translate(result, translationVector) {
        // START WITH THE IDENTITY MATRIX
        this.identity(result);
        // AND THEN LOAD IN THE TRANSLATION VALUES
        result.set(translationVector.getX(), 0, 3);
        result.set(translationVector.getY(), 1, 3);
        result.set(translationVector.getZ(), 2, 3);
    }
    MathUtilities.translate = translate;
    function transpose(result, mat) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var temp = mat.get(i, j);
                result.set(temp, j, i);
            }
        }
    }
    MathUtilities.transpose = transpose;
    function view(result, cameraPosition, cameraOrientation) {
        var pitch = this.math.degreesToRadians(cameraOrientation.getThetaX());
        var yaw = this.math.degreesToRadians(cameraOrientation.getThetaY());
        var roll = this.math.degreesToRadians(cameraOrientation.getThetaZ());
        // TO TRANSLATE
        var translateVector = this.math.vectorMath.createPositionVector();
        translateVector.set(-cameraPosition.getX(), -cameraPosition.getY(), -cameraPosition.getZ());
        var translateMatrix = new Matrix_1.Matrix(4, 4);
        this.identity(translateMatrix);
        this.translate(translateMatrix, translateVector);
        // TO ROTATE
        var rotateVector = this.math.vectorMath.createRotationVector();
        rotateVector.set(-pitch, -yaw, -roll);
        var rotateMatrix = new Matrix_1.Matrix(4, 4);
        this.rotate(rotateMatrix, rotateVector);
        // NOW COMBINE THE 2 MATRICES
        this.multiply(result, rotateMatrix, translateMatrix);
    }
    MathUtilities.view = view;
    function addVectors(result, vec0, vec1) {
        for (var i = 0; i < vec0.getSize(); i++) {
            var total = vec0.getAt(i) + vec1.getAt(i);
            result.setAt(i, total);
        }
    }
    MathUtilities.addVectors = addVectors;
    function crossProduct(result, vec0, vec1) {
        var result0 = vec0.getY() * vec1.getZ() - vec1.getY() * vec0.getZ();
        var result1 = vec0.getZ() * vec1.getX() - vec1.getZ() * vec0.getX();
        var result2 = vec0.getX() * vec1.getY() - vec1.getX() * vec0.getY();
        result.setX(result0);
        result.setY(result1);
        result.setZ(result2);
    }
    MathUtilities.crossProduct = crossProduct;
    function dotProduct(vec0, vec1) {
        var resultX = vec0.getX() * vec1.getX();
        var resultY = vec0.getY() * vec1.getY();
        var resultZ = vec0.getZ() * vec1.getZ();
        return resultX + resultY + resultZ;
    }
    MathUtilities.dotProduct = dotProduct;
    function multiplyVectors(result, vec, scalar) {
        var vecX = vec.getX() * scalar;
        var vecY = vec.getY() * scalar;
        var vecZ = vec.getZ() * scalar;
        result.setX(vecX);
        result.setY(vecY);
        result.setZ(vecZ);
    }
    MathUtilities.multiplyVectors = multiplyVectors;
    function normalize(result, vec) {
        var xSquared = vec.getX() * vec.getX();
        var ySquared = vec.getY() * vec.getY();
        var zSquared = vec.getZ() * vec.getZ();
        var distance = Math.sqrt(xSquared + ySquared + zSquared);
        result.setX(vec.getX() / distance);
        result.setY(vec.getY() / distance);
        result.setZ(vec.getZ() / distance);
    }
    MathUtilities.normalize = normalize;
    function subtractVectors(result, vec0, vec1) {
        var resultX = vec0.getX() - vec1.getX();
        var resultY = vec0.getY() - vec1.getY();
        var resultZ = vec0.getZ() - vec1.getZ();
        result.setX(resultX);
        result.setY(resultY);
        result.setZ(resultZ);
    }
    MathUtilities.subtractVectors = subtractVectors;
})(MathUtilities = exports.MathUtilities || (exports.MathUtilities = {}));

},{"./Matrix":6}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * A Matrix is used for transforming points from local
 * coordinates to world coordinates.
 */

var Matrix = function () {
    function Matrix(rows, columns) {
        _classCallCheck(this, Matrix);

        this.rows = rows;
        this.columns = columns;
        this.mat = new Float32Array(rows * columns);
        for (var i = 0; i < rows * columns; i++) {
            this.mat[i] = 0.0;
        }
    }

    _createClass(Matrix, [{
        key: "getData",
        value: function getData() {
            return this.mat;
        }
    }, {
        key: "getRows",
        value: function getRows() {
            return this.rows;
        }
    }, {
        key: "getColumns",
        value: function getColumns() {
            return this.columns;
        }
    }, {
        key: "getIndex",
        value: function getIndex(rows, columns) {
            return this.rows * columns + rows;
        }
    }, {
        key: "get",
        value: function get(row, column) {
            var index = this.getIndex(row, column);
            var valueToReturn = this.mat[index];
            return valueToReturn;
        }
    }, {
        key: "set",
        value: function set(value, row, column) {
            var index = this.getIndex(row, column);
            this.mat[index] = value;
        }
    }, {
        key: "print",
        value: function print() {
            var maxWidth = 0;
            for (var i = 0; i < 4; i++) {
                for (var _j = 0; _j < 4; _j++) {
                    var testNum = this.get(_j, i) + "";
                    if (testNum.length > maxWidth) {
                        maxWidth = testNum.length;
                    }
                }
            }
            var text = "[ ";
            for (var _i = 0; _i < this.rows; _i++) {
                if (_i > 0) text += "  ";
                for (var j = 0; j < this.columns; j++) {
                    var numText = this.get(_i, j) + "";
                    while (numText.length < maxWidth) {
                        numText = " " + numText;
                    }
                    text += numText;
                    if (j < this.columns - 1) {
                        text += ",";
                    }
                    text += " ";
                }
                if (_i < this.rows - 1) {
                    text += "\n";
                }
                text += "]";
                console.log(text);
            }
        }
    }]);

    return Matrix;
}();

exports.Matrix = Matrix;

},{}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Vector3
 *
 * The Vector3 class can be used for any 2d or 3d point, vector,
 * or rotation (i.e. angles of orientation).
 */

var Vector3 = function () {
    function Vector3() {
        _classCallCheck(this, Vector3);

        this.vec = new Float32Array(4);
        for (var i = 0; i < 4; i++) {
            this.vec[i] = 0.0;
        }this.size = 4;
    }

    _createClass(Vector3, [{
        key: "getSize",
        value: function getSize() {
            return this.size;
        }
    }, {
        key: "getAt",
        value: function getAt(index) {
            return this.vec[index];
        }
    }, {
        key: "getX",
        value: function getX() {
            return this.vec[0];
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.vec[1];
        }
    }, {
        key: "getZ",
        value: function getZ() {
            return this.vec[2];
        }
    }, {
        key: "getW",
        value: function getW() {
            return this.vec[3];
        }
    }, {
        key: "getThetaX",
        value: function getThetaX() {
            return this.vec[0];
        }
    }, {
        key: "getThetaY",
        value: function getThetaY() {
            return this.vec[1];
        }
    }, {
        key: "getThetaZ",
        value: function getThetaZ() {
            return this.vec[2];
        }
    }, {
        key: "set",
        value: function set(init0, init1, init2, init3) {
            this.vec[0] = init0;
            this.vec[1] = init1;
            this.vec[2] = init2;
            this.vec[3] = init3;
        }
    }, {
        key: "setAt",
        value: function setAt(index, value) {
            this.vec[index] = value;
        }
    }, {
        key: "setX",
        value: function setX(initX) {
            this.vec[0] = initX;
        }
    }, {
        key: "setY",
        value: function setY(initY) {
            this.vec[1] = initY;
        }
    }, {
        key: "setZ",
        value: function setZ(initZ) {
            this.vec[2] = initZ;
        }
    }, {
        key: "setW",
        value: function setW(initW) {
            this.vec[3] = initW;
        }
    }, {
        key: "setThetaX",
        value: function setThetaX(initThetaX) {
            this.setX(initThetaX);
        }
    }, {
        key: "setThetaY",
        value: function setThetaY(initThetaY) {
            this.setY(initThetaY);
        }
    }, {
        key: "setThetaZ",
        value: function setThetaZ(initThetaZ) {
            this.setZ(initThetaZ);
        }
    }, {
        key: "print",
        value: function print() {
            var text = "[";
            for (var i = 0; i < this.size; i++) {
                text += this.vec[i];
                if (i < this.size - 1) {
                    text += ", ";
                }
            }
            text += "]";
            console.log(text);
        }
    }]);

    return Vector3;
}();

exports.Vector3 = Vector3;

},{}],8:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This class renders text to a canvas, updated each frame.
 */

var TextToRender = function TextToRender(initId, initText, initX, initY, initUpdate) {
    _classCallCheck(this, TextToRender);

    this.id = initId;
    this.text = initText;
    this.x = initX;
    this.y = initY;
    this.update = initUpdate;
    this.fontFamily = "";
    this.fontSize = 0;
    this.fontColor = "";
    this.properties = new Map();
};

exports.TextToRender = TextToRender;

var TextRenderer = function () {
    function TextRenderer(textCanvasId, initFontFamily, initFontSize, initFontColor) {
        _classCallCheck(this, TextRenderer);

        this.textToRender = new Array();
        this.textCanvas = document.getElementById(textCanvasId);
        this.textCanvas.width = window.innerWidth;
        this.textCanvas.height = window.innerHeight;
        this.textCanvasWidth = this.textCanvas.width;
        this.textCanvasHeight = this.textCanvas.height;
        this.textCtx = this.textCanvas.getContext("2d");
        this.defaultFontFamily = initFontFamily;
        this.defaultFontSize = initFontSize;
        this.defaultFontColor = initFontColor;
    }

    _createClass(TextRenderer, [{
        key: "addTextToRender",
        value: function addTextToRender(textToAdd) {
            textToAdd.fontFamily = this.defaultFontFamily;
            textToAdd.fontSize = this.defaultFontSize;
            textToAdd.fontColor = this.defaultFontColor;
            this.textToRender.push(textToAdd);
        }
    }, {
        key: "clear",
        value: function clear() {
            this.textToRender = [];
        }
    }, {
        key: "getCanvasWidth",
        value: function getCanvasWidth() {
            return this.textCanvasWidth;
        }
    }, {
        key: "getCanvasHeight",
        value: function getCanvasHeight() {
            return this.textCanvasHeight;
        }
    }, {
        key: "render",
        value: function render() {
            this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
            for (var i = 0; i < this.textToRender.length; i++) {
                var textToRender = this.textToRender[i];
                textToRender.update();
                this.textCtx.font = "" + textToRender.fontSize + "px " + textToRender.fontFamily;
                this.textCtx.fillStyle = textToRender.fontColor;
                this.textCtx.fillText(textToRender.text, textToRender.x, textToRender.y);
            }
        }
    }]);

    return TextRenderer;
}();

exports.TextRenderer = TextRenderer;

},{}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var WebGLGameShader_1 = require("./WebGLGameShader");
var Matrix_1 = require("../math/Matrix");
var Vector3_1 = require("../math/Vector3");

var WebGLGameRenderingComponent = function () {
    function WebGLGameRenderingComponent() {
        _classCallCheck(this, WebGLGameRenderingComponent);

        this.A_POSITION = "a_Position";
        this.A_TEX_COORD = "a_TexCoord";
        this.U_MESH_TRANSFORM = "u_MeshTransform";
        this.U_TEX_COORD_FACTOR = "u_TexCoordFactor";
        this.U_TEX_COORD_SHIFT = "u_TexCoordShift";
        this.U_SAMPLER = "u_Sampler";
        this.NUM_VERTICES = 4;
        this.FLOATS_PER_VERTEX = 2;
        this.FLOATS_PER_TEXTURE_COORDINATE = 2;
        this.TOTAL_BYTES = 16;
        this.VERTEX_POSITION_OFFSET = 0;
        this.TEXTURE_COORDINATE_OFFSET = 8;
        this.INDEX_OF_FIRST_VERTEX = 0;
        // WE'LL MANAGE THESE FOR OUR WebGL SHADERS
        this.webGLAttributeLocations = new Map();
        this.webGLUniformLocations = new Map();
        // WE'LL USE THESE FOR TRANSLATING, ROTATING, AND SCALING THE MESH
        this.meshTransform = new Matrix_1.Matrix(4, 4);
        this.meshTranslate = new Vector3_1.Vector3();
        this.meshRotate = new Vector3_1.Vector3();
        this.meshScale = new Vector3_1.Vector3();
    }

    _createClass(WebGLGameRenderingComponent, [{
        key: "init",
        value: function init(webGL, vertexShaderSource, fragmentShaderSource, renderSetupData) {
            // FIRST WE NEED TO MAKE THE SHADER
            this.shader = new WebGLGameShader_1.WebGLGameShader();
            this.shader.init(webGL, vertexShaderSource, fragmentShaderSource);
            // CREATE THE BUFFER ON THE GPU
            this.vertexDataBuffer = webGL.createBuffer();
            // BIND THE BUFFER TO BE VERTEX DATA
            webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexDataBuffer);
            // MAKE THE MESH DATA OURSELVES IN A CHILD CLASS
            var meshVertexData = this.getVertexData(renderSetupData);
            // AND SEND THE DATA TO THE BUFFER WE CREATED ON THE GPU
            webGL.bufferData(webGL.ARRAY_BUFFER, meshVertexData, webGL.STATIC_DRAW);
            // SETUP THE SHADER ATTRIBUTES AND UNIFORMS
            this.loadAttributeLocations(webGL, this.getShaderAttributeNames());
            this.loadUniformLocations(webGL, this.getShaderUniformNames());
        }
        /**
         * This function loads all the attribute data values so that we can
         * retrieve them later when it is time to render. Note that this function
         * can only be called after the shader program has been created.
         */

    }, {
        key: "loadAttributeLocations",
        value: function loadAttributeLocations(webGL, attributeLocationNames) {
            for (var i = 0; i < attributeLocationNames.length; i++) {
                var locationName = attributeLocationNames[i];
                var location = webGL.getAttribLocation(this.shader.getProgram(), locationName);
                this.webGLAttributeLocations.set(locationName, location);
            }
        }
        /**
         * This function loads all the uniform data values so that we can
         * retrieve them later when it is time to render. Note that this function
         * can only be called after the shader program has been created.
         */

    }, {
        key: "loadUniformLocations",
        value: function loadUniformLocations(webGL, uniformLocationNames) {
            for (var i = 0; i < uniformLocationNames.length; i++) {
                var locationName = uniformLocationNames[i];
                var location = webGL.getUniformLocation(this.shader.getProgram(), locationName);
                this.webGLUniformLocations.set(locationName, location);
            }
        }
    }]);

    return WebGLGameRenderingComponent;
}();

exports.WebGLGameRenderingComponent = WebGLGameRenderingComponent;

},{"../math/Matrix":6,"../math/Vector3":7,"./WebGLGameShader":11}],10:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This serves as the subsystem that manages all game rendering.
 */
var TextRenderer_1 = require("./TextRenderer");
var WebGLGameTiledLayerRenderer_1 = require("./WebGLGameTiledLayerRenderer");
var WebGLGameSpriteRenderer_1 = require("./WebGLGameSpriteRenderer");

var WebGLGameRenderingSystem = function () {
    function WebGLGameRenderingSystem(renderingCanvasId, textCanvasId) {
        _classCallCheck(this, WebGLGameRenderingSystem);

        // FIRST SETUP webGL
        this.renderingCanvas = document.getElementById(renderingCanvasId);
        this.renderingCanvas.width = window.innerWidth;
        this.renderingCanvas.height = window.innerHeight;
        this.canvasWidth = this.renderingCanvas.width;
        this.canvasHeight = this.renderingCanvas.height;
        this.webGL = this.renderingCanvas.getContext("webgl");
        // IF THE USER'S MACHINE/BROWSER DOESN'T SUPPORT
        // WebGL THEN THERE'S NO POINT OF GOING ON
        if (!this.webGL) {
            // PROVIDE SOME FEEDBACK THAT WebGL WON'T WORK BECAUSE
            // THE USER'S' GRAPHICS CARD IS FOR THE BIRDS
            console.error("WebGL is not supported by this device");
            // AND END INITIALIZATION
            return;
        }
        // WebGL IS SUPPORTED, SO INIT EVERYTHING THAT USES IT
        // MAKE THE CLEAR COLOR BLACK
        this.setClearColor(0.0, 0.0, 0.0, 1.0);
        // ENABLE DEPTH TESTING
        this.webGL.disable(this.webGL.DEPTH_TEST);
        this.webGL.enable(this.webGL.BLEND);
        this.webGL.blendFunc(this.webGL.SRC_ALPHA, this.webGL.ONE_MINUS_SRC_ALPHA);
        // TURN ON BACKFACE CULLING
        this.webGL.enable(this.webGL.CULL_FACE);
        // THIS SPECIFIES THAT WE'RE USING THE ENTIRE CANVAS
        this.webGL.viewport(0, 0, this.canvasWidth, this.canvasHeight);
        // MAKE THE TILED LAYER RENDERER
        this.tiledLayerRenderer = new WebGLGameTiledLayerRenderer_1.WebGLGameTiledLayerRenderer();
        // MAKE THE SPRITE RENDERER
        this.spriteRenderer = new WebGLGameSpriteRenderer_1.WebGLGameSpriteRenderer();
        // THIS WILL STORE OUR TEXT
        this.textRenderer = new TextRenderer_1.TextRenderer(textCanvasId, "serif", 18, "#FFFF00");
    }

    _createClass(WebGLGameRenderingSystem, [{
        key: "getTextureConstant",
        value: function getTextureConstant(id) {
            // WE ONLY ALLOW FOR 10 TEXTURES TO BE PUT ON THE GPU
            switch (id) {
                case 0:
                    return this.webGL.TEXTURE0;
                case 1:
                    return this.webGL.TEXTURE1;
                case 2:
                    return this.webGL.TEXTURE2;
                case 3:
                    return this.webGL.TEXTURE3;
                case 4:
                    return this.webGL.TEXTURE4;
                case 5:
                    return this.webGL.TEXTURE5;
                case 6:
                    return this.webGL.TEXTURE6;
                case 7:
                    return this.webGL.TEXTURE7;
                case 8:
                    return this.webGL.TEXTURE8;
                default:
                    return this.webGL.TEXTURE9;
            }
        }
    }, {
        key: "getWebGL",
        value: function getWebGL() {
            return this.webGL;
        }
    }, {
        key: "getTiledLayerRenderer",
        value: function getTiledLayerRenderer() {
            return this.tiledLayerRenderer;
        }
    }, {
        key: "getSpriteRenderer",
        value: function getSpriteRenderer() {
            return this.spriteRenderer;
        }
    }, {
        key: "getTextRenderer",
        value: function getTextRenderer() {
            return this.textRenderer;
        }
    }, {
        key: "initWebGLTexture",
        value: function initWebGLTexture(textureToInit, textureId, image, callback) {
            textureToInit.width = image.width;
            textureToInit.height = image.height;
            // CREATE A WebGL TEXTURE ON THE GPU
            textureToInit.webGLTexture = this.webGL.createTexture();
            textureToInit.webGLTextureId = textureId;
            // FLIP THE IMAGE'S y-AXIS
            //webGL.pixelStorei(webGL.UNPACK_FLIP_Y_WEBGL, 1);
            // ACTIVATE THE WebGL TEXTURE ON THE GPU
            //let textureNumName : string = "TEXTURE" + textureId;
            var textureNameConstant = this.getTextureConstant(textureId);
            this.webGL.activeTexture(textureNameConstant);
            // BIND THE TEXTURE TO A 2D TYPE
            this.webGL.bindTexture(this.webGL.TEXTURE_2D, textureToInit.webGLTexture);
            // SPECIFY RENDERING SETTINGS
            this.webGL.texParameteri(this.webGL.TEXTURE_2D, this.webGL.TEXTURE_MIN_FILTER, this.webGL.LINEAR);
            // SET THE IMAGE FOR THE TEXTURE
            this.webGL.texImage2D(this.webGL.TEXTURE_2D, 0, this.webGL.RGBA, this.webGL.RGBA, this.webGL.UNSIGNED_BYTE, image);
            // KEEP IT FOR WHEN WE RENDER
            callback();
        }
    }, {
        key: "setClearColor",
        value: function setClearColor(r, g, b, a) {
            this.webGL.clearColor(r, g, b, a);
        }
    }, {
        key: "render",
        value: function render(viewport, tiledLayers, visibleSprites) {
            // CLEAR THE CANVAS
            this.webGL.clear(this.webGL.COLOR_BUFFER_BIT | this.webGL.DEPTH_BUFFER_BIT);
            // RENDER THE TILED LAYER FIRST
            this.tiledLayerRenderer.render(this.webGL, viewport, tiledLayers);
            // RENDER THE SPRITES ON ONE CANVAS
            this.spriteRenderer.render(this.webGL, viewport, visibleSprites);
            // THEN THE TEXT ON ANOTHER OVERLAPPING CANVAS
            this.textRenderer.render();
        }
    }]);

    return WebGLGameRenderingSystem;
}();

exports.WebGLGameRenderingSystem = WebGLGameRenderingSystem;

},{"./TextRenderer":8,"./WebGLGameSpriteRenderer":12,"./WebGLGameTiledLayerRenderer":14}],11:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is a wrapper class for a WebGLProgram, i.e. a shader for custom rendering
 * using WebGL's programmable pipeline.
 */

var WebGLGameShader = function () {
    function WebGLGameShader() {
        _classCallCheck(this, WebGLGameShader);
    }

    _createClass(WebGLGameShader, [{
        key: "getProgram",
        value: function getProgram() {
            return this.program;
        }
    }, {
        key: "init",
        value: function init(webGL, vSource, fSource) {
            this.vertexShader = this.createShader(webGL, webGL.VERTEX_SHADER, vSource);
            this.fragmentShader = this.createShader(webGL, webGL.FRAGMENT_SHADER, fSource);
            this.program = this.createShaderProgram(webGL, this.vertexShader, this.fragmentShader);
        }
    }, {
        key: "createShader",
        value: function createShader(webGL, type, source) {
            // MAKE A NEW SHADER OBJECT, LOAD IT'S SOURCE, AND COMPILE IT
            var shader = webGL.createShader(type);
            webGL.shaderSource(shader, source);
            webGL.compileShader(shader);
            // DID IT COMPILE?
            var success = webGL.getShaderParameter(shader, webGL.COMPILE_STATUS);
            if (success) {
                return shader;
            }
            // DISASTER
            console.log(webGL.getShaderInfoLog(shader));
            webGL.deleteShader(shader);
            return null;
        }
    }, {
        key: "createShaderProgram",
        value: function createShaderProgram(webGL, vShader, fShader) {
            // MAKE THE GLSL SHADER PROGRAM
            var programToCreate = webGL.createProgram();
            // LINK THE VERT AND FRAG
            webGL.attachShader(programToCreate, vShader);
            webGL.attachShader(programToCreate, fShader);
            // NOW WE CAN LINK THE SHADER PROGRAM
            webGL.linkProgram(programToCreate);
            var linked = webGL.getProgramParameter(programToCreate, webGL.LINK_STATUS);
            // IS IT LINKED?
            if (!linked) {
                // DISASTER
                var errorFeedback = webGL.getProgramInfoLog(programToCreate);
                console.log(errorFeedback);
                // DISASTER
                console.log(webGL.getProgramInfoLog(programToCreate));
                webGL.deleteProgram(programToCreate);
            }
            return programToCreate;
        }
    }]);

    return WebGLGameShader;
}();

exports.WebGLGameShader = WebGLGameShader;

},{}],12:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var WebGLGameRenderingComponent_1 = require("./WebGLGameRenderingComponent");
var MathUtilities_1 = require("../math/MathUtilities");

var WebGLGameSpriteRenderer = function (_WebGLGameRenderingCo) {
    _inherits(WebGLGameSpriteRenderer, _WebGLGameRenderingCo);

    function WebGLGameSpriteRenderer() {
        _classCallCheck(this, WebGLGameSpriteRenderer);

        return _possibleConstructorReturn(this, (WebGLGameSpriteRenderer.__proto__ || Object.getPrototypeOf(WebGLGameSpriteRenderer)).call(this));
    }

    _createClass(WebGLGameSpriteRenderer, [{
        key: "getVertexData",
        value: function getVertexData() {
            return new Float32Array([-0.5, 0.5, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.5, 0.5, 1.0, 0.0, 0.5, -0.5, 1.0, 1.0]);
        }
    }, {
        key: "getShaderAttributeNames",
        value: function getShaderAttributeNames() {
            return [this.A_POSITION, this.A_TEX_COORD];
        }
    }, {
        key: "getShaderUniformNames",
        value: function getShaderUniformNames() {
            return [this.U_MESH_TRANSFORM, this.U_SAMPLER, this.U_TEX_COORD_FACTOR, this.U_TEX_COORD_SHIFT];
        }
    }, {
        key: "render",
        value: function render(webGL, viewport, visibleSprites) {
            // SELECT THE ANIMATED SPRITE RENDERING SHADER PROGRAM FOR USE
            var shaderProgramToUse = this.shader.getProgram();
            webGL.useProgram(shaderProgramToUse);
            // AND THEN RENDER EACH ONE
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = visibleSprites[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var sprite = _step.value;

                    this.renderAnimatedSprite(webGL, viewport, sprite);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "renderAnimatedSprite",
        value: function renderAnimatedSprite(webGL, viewport, sprite) {
            // YOU'LL NEED TO UPDATE THIS METHOD TO MAKE SURE SPRITES SCROLL AND ROTATE
            var canvasWidth = webGL.canvas.width;
            var canvasHeight = webGL.canvas.height;
            var spriteType = sprite.getSpriteType();
            var texture = spriteType.getSpriteSheetTexture();
            // CALCULATE HOW MUCH TO TRANSLATE THE QUAD PER THE SPRITE POSITION
            var spriteWidth = spriteType.getSpriteWidth();
            var spriteHeight = spriteType.getSpriteHeight();
            var spriteXInPixels = sprite.getPosition().getX() + spriteWidth / 2;
            var spriteYInPixels = sprite.getPosition().getY() + spriteHeight / 2;
            var spriteXTranslate = (spriteXInPixels - canvasWidth / 2) / (canvasWidth / 2);
            var spriteYTranslate = (spriteYInPixels - canvasHeight / 2) / (canvasHeight / 2);
            this.meshTranslate.setX(spriteXTranslate);
            this.meshTranslate.setY(-spriteYTranslate);
            // CALCULATE HOW MUCH TO SCALE THE QUAD PER THE SPRITE SIZE
            var defaultWidth = canvasWidth;
            var defaultHeight = canvasHeight;
            var scaleX = 2 * spriteWidth / defaultWidth;
            var scaleY = 2 * spriteHeight / defaultHeight;
            this.meshScale.set(scaleX, scaleY, 0.0, 0.0); //1.0, 1.0);
            // @todo - COMBINE THIS WITH THE ROTATE AND SCALE VALUES FROM THE SPRITE
            MathUtilities_1.MathUtilities.identity(this.meshTransform);
            MathUtilities_1.MathUtilities.model(this.meshTransform, this.meshTranslate, this.meshRotate, this.meshScale);
            // FIGURE OUT THE TEXTURE COORDINATE FACTOR AND SHIFT
            var texCoordFactorX = spriteWidth / texture.width;
            var texCoordFactorY = spriteHeight / texture.height;
            var spriteLeft = sprite.getLeft();
            var spriteTop = sprite.getTop();
            var texCoordShiftX = spriteLeft / texture.width;
            var texCoordShiftY = spriteTop / texture.height;
            // USE THE ATTRIBUTES
            webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexDataBuffer);
            webGL.bindTexture(webGL.TEXTURE_2D, texture.webGLTexture);
            // HOOK UP THE ATTRIBUTES
            var a_PositionLocation = this.webGLAttributeLocations.get(this.A_POSITION);
            webGL.vertexAttribPointer(a_PositionLocation, this.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, this.TOTAL_BYTES, this.VERTEX_POSITION_OFFSET);
            webGL.enableVertexAttribArray(a_PositionLocation);
            var a_TexCoordLocation = this.webGLAttributeLocations.get(this.A_TEX_COORD);
            webGL.vertexAttribPointer(a_TexCoordLocation, this.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, this.TOTAL_BYTES, this.TEXTURE_COORDINATE_OFFSET);
            webGL.enableVertexAttribArray(a_TexCoordLocation);
            // USE THE UNIFORMS
            var u_MeshTransformLocation = this.webGLUniformLocations.get(this.U_MESH_TRANSFORM);
            webGL.uniformMatrix4fv(u_MeshTransformLocation, false, this.meshTransform.getData());
            var u_SamplerLocation = this.webGLUniformLocations.get(this.U_SAMPLER);
            webGL.uniform1i(u_SamplerLocation, texture.webGLTextureId);
            var u_TexCoordFactorLocation = this.webGLUniformLocations.get(this.U_TEX_COORD_FACTOR);
            webGL.uniform2f(u_TexCoordFactorLocation, texCoordFactorX, texCoordFactorY);
            var u_TexCoordShiftLocation = this.webGLUniformLocations.get(this.U_TEX_COORD_SHIFT);
            webGL.uniform2f(u_TexCoordShiftLocation, texCoordShiftX, texCoordShiftY);
            // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
            webGL.drawArrays(webGL.TRIANGLE_STRIP, this.INDEX_OF_FIRST_VERTEX, this.NUM_VERTICES);
            this.meshRotate.setZ(Math.PI);
        }
    }]);

    return WebGLGameSpriteRenderer;
}(WebGLGameRenderingComponent_1.WebGLGameRenderingComponent);

exports.WebGLGameSpriteRenderer = WebGLGameSpriteRenderer;

},{"../math/MathUtilities":5,"./WebGLGameRenderingComponent":9}],13:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var WebGLGameTexture = function WebGLGameTexture() {
  _classCallCheck(this, WebGLGameTexture);
};

exports.WebGLGameTexture = WebGLGameTexture;

},{}],14:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var WebGLGameRenderingComponent_1 = require("./WebGLGameRenderingComponent");

var WebGLGameTiledLayerRenderer = function (_WebGLGameRenderingCo) {
    _inherits(WebGLGameTiledLayerRenderer, _WebGLGameRenderingCo);

    function WebGLGameTiledLayerRenderer() {
        _classCallCheck(this, WebGLGameTiledLayerRenderer);

        return _possibleConstructorReturn(this, (WebGLGameTiledLayerRenderer.__proto__ || Object.getPrototypeOf(WebGLGameTiledLayerRenderer)).call(this));
    }
    /**
     * This function generates the array of attribute data needed to
     * render our TiledLayer and puts it in the tiled layer argument.
     */


    _createClass(WebGLGameTiledLayerRenderer, [{
        key: "generateVertexData",
        value: function generateVertexData(tiledLayer) {
            var someNumberYouHaveToDetermine = 4;
            var dataToFill = [someNumberYouHaveToDetermine];
            var vertexData = new Float32Array(dataToFill);
            return vertexData;
        }
    }, {
        key: "getVertexData",
        value: function getVertexData(renderSetupData) {
            // WE WILL NEED THIS TO KNOW HOW LARGE TO MAKE OUR VERTEX DATA BUFFER
            var tiledLayers = renderSetupData;
            var tiledLayer = tiledLayers[0];
            return this.generateVertexData(tiledLayer);
        }
    }, {
        key: "getShaderAttributeNames",
        value: function getShaderAttributeNames() {
            // YOU'LL NEED TO DEFINE THIS METHOD
            return [];
        }
    }, {
        key: "getShaderUniformNames",
        value: function getShaderUniformNames() {
            // YOU'LL NEED TO DEFINE THIS METHOD
            return [];
        }
    }, {
        key: "render",
        value: function render(webGL, viewport, tiledLayers) {
            // SELECT THE ANIMATED SPRITE RENDERING SHADER PROGRAM FOR USE
            var shaderProgramToUse = this.shader.getProgram();
            webGL.useProgram(shaderProgramToUse);
            // AND THEN RENDER EACH LAYER
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = tiledLayers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tiledLayer = _step.value;

                    this.renderTiledLayer(webGL, viewport, tiledLayer);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "renderTiledLayer",
        value: function renderTiledLayer(webGL, viewport, tiledLayer) {
            // YOU'LL NEED TO DEFINE THIS METHOD
        }
    }]);

    return WebGLGameTiledLayerRenderer;
}(WebGLGameRenderingComponent_1.WebGLGameRenderingComponent);

exports.WebGLGameTiledLayerRenderer = WebGLGameTiledLayerRenderer;

},{"./WebGLGameRenderingComponent":9}],15:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var SceneGraph = function () {
    function SceneGraph() {
        _classCallCheck(this, SceneGraph);

        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.clear();
    }

    _createClass(SceneGraph, [{
        key: "clear",
        value: function clear() {
            this.animatedSprites = [];
            this.visibleSet = [];
            this.tiledLayers = [];
            this.tileSets = [];
        }
    }, {
        key: "addTileSet",
        value: function addTileSet(tileSetToAdd) {
            return this.tileSets.push(tileSetToAdd) - 1;
        }
    }, {
        key: "getNumTileSets",
        value: function getNumTileSets() {
            return this.tileSets.length;
        }
    }, {
        key: "getTileSet",
        value: function getTileSet(index) {
            return this.tileSets[index];
        }
    }, {
        key: "addLayer",
        value: function addLayer(layerToAdd) {
            this.tiledLayers.push(layerToAdd);
        }
    }, {
        key: "getNumTiledLayers",
        value: function getNumTiledLayers() {
            return this.tiledLayers.length;
        }
    }, {
        key: "getTiledLayers",
        value: function getTiledLayers() {
            return this.tiledLayers;
        }
    }, {
        key: "getTiledLayer",
        value: function getTiledLayer(layerIndex) {
            return this.tiledLayers[layerIndex];
        }
    }, {
        key: "getNumSprites",
        value: function getNumSprites() {
            return this.animatedSprites.length;
        }
    }, {
        key: "setViewport",
        value: function setViewport(initViewport) {
            this.viewport = initViewport;
        }
    }, {
        key: "getViewport",
        value: function getViewport() {
            return this.viewport;
        }
    }, {
        key: "updateViewport",
        value: function updateViewport(posX, posY) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.animatedSprites[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var sprite = _step.value;

                    sprite.getPosition().setX(sprite.getPosition().getX() - posX);
                    sprite.getPosition().setY(sprite.getPosition().getY() - posY);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "addAnimatedSprite",
        value: function addAnimatedSprite(sprite) {
            this.animatedSprites.push(sprite);
        }
    }, {
        key: "getSpriteAt",
        value: function getSpriteAt(testX, testY) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.animatedSprites[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var sprite = _step2.value;

                    if (sprite.contains(testX, testY)) return sprite;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return null;
        }
    }, {
        key: "setCharacter",
        value: function setCharacter(character) {
            this.character = character;
        }
    }, {
        key: "getCharacter",
        value: function getCharacter() {
            return this.character;
        }
        /**
         * update
         *
         * Called once per frame, this function updates the state of all the objects
         * in the scene.
         *
         * @param delta The time that has passed since the last time this update
         * funcation was called.
         */

    }, {
        key: "update",
        value: function update(delta) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.animatedSprites[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var sprite = _step3.value;

                    sprite.update(delta);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: "scope",
        value: function scope() {
            // CLEAR OUT THE OLD
            this.visibleSet = [];
            // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.animatedSprites[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var sprite = _step4.value;

                    this.visibleSet.push(sprite);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return this.visibleSet;
        }
    }]);

    return SceneGraph;
}();

exports.SceneGraph = SceneGraph;

},{}],16:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var Vector3_1 = require("../math/Vector3");
/**
 * SceneObject
 *
 * A SceneObject is something that can be placed into the scene graph. It has
 * a position, rotation, and scale in the game world. Note that its position
 * is typically its centered location, so if we're talking about a 2d box,
 * it would be the center of that box.
 */

var SceneObject = function () {
    function SceneObject() {
        _classCallCheck(this, SceneObject);

        this.position = new Vector3_1.Vector3();
        this.rotation = new Vector3_1.Vector3();
        this.scale = new Vector3_1.Vector3();
        // CLEAR ALL VALUES
        this.position.set(0.0, 0.0, 0.0, 1.0);
        this.rotation.set(0.0, 0.0, 0.0, 1.0);
        this.scale.set(1.0, 1.0, 1.0, 1.0);
    }

    _createClass(SceneObject, [{
        key: "getPosition",
        value: function getPosition() {
            return this.position;
        }
    }, {
        key: "getRotation",
        value: function getRotation() {
            return this.rotation;
        }
    }, {
        key: "getScale",
        value: function getScale() {
            return this.scale;
        }
    }]);

    return SceneObject;
}();

exports.SceneObject = SceneObject;

},{"../math/Vector3":7}],17:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Viewport = function () {
    function Viewport(initWidth, initHeight) {
        _classCallCheck(this, Viewport);

        this.width = initWidth;
        this.height = initHeight;
        this.x = 0;
        this.y = 0;
    }

    _createClass(Viewport, [{
        key: "getWidth",
        value: function getWidth() {
            return this.width;
        }
    }, {
        key: "getHeight",
        value: function getHeight() {
            return this.height;
        }
    }, {
        key: "getX",
        value: function getX() {
            return this.x;
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.y;
        }
    }, {
        key: "inc",
        value: function inc(incX, incY) {
            this.x += incX;
            this.y += incY;
        }
    }, {
        key: "setPosition",
        value: function setPosition(initX, initY) {
            this.x = initX;
            this.y = initY;
        }
    }]);

    return Viewport;
}();

exports.Viewport = Viewport;

},{}],18:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var SceneObject_1 = require("../SceneObject");
var SpriteAction_1 = require("./SpriteAction");

var AnimatedSprite = function (_SceneObject_1$SceneO) {
    _inherits(AnimatedSprite, _SceneObject_1$SceneO);

    function AnimatedSprite(initSpriteType, initState) {
        _classCallCheck(this, AnimatedSprite);

        var _this = _possibleConstructorReturn(this, (AnimatedSprite.__proto__ || Object.getPrototypeOf(AnimatedSprite)).call(this));

        _this.spriteType = initSpriteType;
        // START RESET
        _this.state = initState;
        _this.animationFrameIndex = 0;
        _this.frameCounter = 0;
        _this.action = new SpriteAction_1.SpriteAction(10);
        return _this;
    }

    _createClass(AnimatedSprite, [{
        key: "getAnimationFrameIndex",
        value: function getAnimationFrameIndex() {
            return this.animationFrameIndex;
        }
    }, {
        key: "getFrameCounter",
        value: function getFrameCounter() {
            return this.frameCounter;
        }
    }, {
        key: "getSpriteType",
        value: function getSpriteType() {
            return this.spriteType;
        }
    }, {
        key: "getState",
        value: function getState() {
            return this.state;
        }
    }, {
        key: "setState",
        value: function setState(initState) {
            this.state = initState;
            this.animationFrameIndex = 0;
            this.frameCounter = 0;
        }
    }, {
        key: "doAction",
        value: function doAction() {}
    }, {
        key: "update",
        value: function update(delta) {
            this.frameCounter++;
            // HAVE WE GONE PAST THE LAST FRAME IN THE ANIMATION?
            var currentAnimation = this.spriteType.getAnimation(this.state);
            var currentFrame = currentAnimation[this.animationFrameIndex];
            if (this.frameCounter > currentFrame.duration) {
                this.animationFrameIndex++;
                if (this.animationFrameIndex >= currentAnimation.length) {
                    this.animationFrameIndex = 0;
                }
                this.frameCounter = 0;
            }
        }
    }, {
        key: "contains",
        value: function contains(pointX, pointY) {
            var spriteWidth = this.getSpriteType().getSpriteWidth();
            var spriteHeight = this.getSpriteType().getSpriteHeight();
            var spriteLeft = this.getPosition().getX();
            var spriteRight = this.getPosition().getX() + spriteWidth;
            var spriteTop = this.getPosition().getY();
            var spriteBottom = this.getPosition().getY() + spriteHeight;
            if (pointX < spriteLeft || spriteRight < pointX || pointY < spriteTop || spriteBottom < pointY) {
                return false;
            } else {
                return true;
            }
        }
        /**RENAME THIS METHOD SO IT DENOTES PIXEL LOCATION IN TEXTURE */

    }, {
        key: "getLeft",
        value: function getLeft() {
            return this.spriteType.getLeft(this.state, this.animationFrameIndex);
        }
    }, {
        key: "getTop",
        value: function getTop() {
            return this.spriteType.getTop(this.state, this.animationFrameIndex);
        }
    }, {
        key: "toString",
        value: function toString() {
            var summary = "{ position: (" + this.getPosition().getX() + ", " + this.getPosition().getY() + ") " + "(state: " + this.getState() + ") " + "(animationFrameIndex: " + this.getAnimationFrameIndex() + ") " + "(frameCounter: " + this.getFrameCounter() + ") ";
            return summary;
        }
    }]);

    return AnimatedSprite;
}(SceneObject_1.SceneObject);

exports.AnimatedSprite = AnimatedSprite;

},{"../SceneObject":16,"./SpriteAction":20}],19:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var AnimationFrame = function AnimationFrame(initLeft, initTop, initDuration) {
    _classCallCheck(this, AnimationFrame);

    this.left = initLeft;
    this.top = initTop;
    this.duration = initDuration;
};

exports.AnimationFrame = AnimationFrame;

var AnimatedSpriteType = function () {
    function AnimatedSpriteType(initSpriteSheetTexture, initSpriteWidth, initSpriteHeight) {
        _classCallCheck(this, AnimatedSpriteType);

        this.spriteSheetTexture = initSpriteSheetTexture;
        this.animations = new Map();
        this.spriteWidth = initSpriteWidth;
        this.spriteHeight = initSpriteHeight;
    }

    _createClass(AnimatedSpriteType, [{
        key: "addAnimation",
        value: function addAnimation(state) {
            this.animations.set(state, new Array());
        }
    }, {
        key: "addAnimationFrame",
        value: function addAnimationFrame(state, index, frameDuration) {
            var columns = this.spriteSheetTexture.width / this.spriteWidth;
            var rows = this.spriteSheetTexture.height / this.spriteHeight;
            var col = index % columns;
            var row = Math.floor(index / columns);
            var left = col * this.spriteWidth;
            var top = row * this.spriteHeight;
            this.animations.get(state).push(new AnimationFrame(left, top, frameDuration));
        }
    }, {
        key: "getSpriteWidth",
        value: function getSpriteWidth() {
            return this.spriteWidth;
        }
    }, {
        key: "getSpriteHeight",
        value: function getSpriteHeight() {
            return this.spriteHeight;
        }
    }, {
        key: "getSpriteSheetTexture",
        value: function getSpriteSheetTexture() {
            return this.spriteSheetTexture;
        }
    }, {
        key: "getAnimation",
        value: function getAnimation(state) {
            return this.animations.get(state);
        }
    }, {
        key: "getLeft",
        value: function getLeft(state, frameIndex) {
            var animationFrame = this.animations.get(state)[frameIndex];
            return animationFrame.left;
        }
    }, {
        key: "getTop",
        value: function getTop(state, frameIndex) {
            var animationFrame = this.animations.get(state)[frameIndex];
            return animationFrame.top;
        }
    }]);

    return AnimatedSpriteType;
}();

exports.AnimatedSpriteType = AnimatedSpriteType;

},{}],20:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var SpriteAction = function () {
    function SpriteAction(countdown) {
        _classCallCheck(this, SpriteAction);

        this.countdown = countdown;
    }

    _createClass(SpriteAction, [{
        key: "setCountdown",
        value: function setCountdown() {
            this.countdown = Math.random() * 10;
        }
    }, {
        key: "refresh",
        value: function refresh() {
            this.countdown--;
        }
    }, {
        key: "isZero",
        value: function isZero() {
            return this.countdown <= 0;
        }
    }]);

    return SpriteAction;
}();

exports.SpriteAction = SpriteAction;

},{}],21:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var TileSet = function () {
    function TileSet(initName, initColumns, initRows, initTileWidth, initTileHeight, initTileSpacing, initTileSheetWidth, initTileSheetHeight, initFirstIndex, initTexture) {
        _classCallCheck(this, TileSet);

        this.name = initName;
        this.columns = initColumns;
        this.rows = initRows;
        this.tileWidth = initTileWidth;
        this.tileHeight = initTileHeight;
        this.tileSpacing = initTileSpacing;
        this.tileSheetWidth = initTileSheetWidth;
        this.tileSheetHeight = initTileSheetHeight;
        this.firstIndex = initFirstIndex;
        this.texture = initTexture;
    }

    _createClass(TileSet, [{
        key: "getName",
        value: function getName() {
            return this.name;
        }
    }, {
        key: "getColumns",
        value: function getColumns() {
            return this.columns;
        }
    }, {
        key: "getRows",
        value: function getRows() {
            return this.rows;
        }
    }, {
        key: "getTileWidth",
        value: function getTileWidth() {
            return this.tileWidth;
        }
    }, {
        key: "getTileHeight",
        value: function getTileHeight() {
            return this.tileHeight;
        }
    }, {
        key: "getTileSpacing",
        value: function getTileSpacing() {
            return this.tileSpacing;
        }
    }, {
        key: "getTileSheetWidth",
        value: function getTileSheetWidth() {
            return this.tileSheetWidth;
        }
    }, {
        key: "getTileSheetHeight",
        value: function getTileSheetHeight() {
            return this.tileSheetHeight;
        }
    }, {
        key: "getFirstIndex",
        value: function getFirstIndex() {
            return this.firstIndex;
        }
    }, {
        key: "getTexture",
        value: function getTexture() {
            return this.texture;
        }
    }]);

    return TileSet;
}();

exports.TileSet = TileSet;

},{}],22:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var TiledLayer = function () {
    function TiledLayer(initColumns, initRows, initTileSet) {
        _classCallCheck(this, TiledLayer);

        this.tiles = new Array();
        this.columns = initColumns;
        this.rows = initRows;
        this.tileSet = initTileSet;
    }

    _createClass(TiledLayer, [{
        key: "setRenderData",
        value: function setRenderData(initRenderData) {
            this.renderData = initRenderData;
        }
    }, {
        key: "getRenderData",
        value: function getRenderData() {
            return this.renderData;
        }
    }, {
        key: "getMinimumVisibleColumn",
        value: function getMinimumVisibleColumn(viewportLeft) {
            return viewportLeft / this.tileSet.getTileWidth();
        }
    }, {
        key: "getMaximumVisibleColumn",
        value: function getMaximumVisibleColumn(viewportRight) {
            return viewportRight / this.tileSet.getTileWidth();
        }
    }, {
        key: "getMinimumVisibleRow",
        value: function getMinimumVisibleRow(viewportTop) {
            return viewportTop / this.tileSet.getTileHeight();
        }
    }, {
        key: "getMaximumVisibleRow",
        value: function getMaximumVisibleRow(viewportBottom) {
            return viewportBottom / this.tileSet.getTileHeight();
        }
    }, {
        key: "getNumCells",
        value: function getNumCells() {
            return this.columns * this.rows;
        }
    }, {
        key: "getColumns",
        value: function getColumns() {
            return this.columns;
        }
    }, {
        key: "getRows",
        value: function getRows() {
            return this.rows;
        }
    }, {
        key: "getTileSet",
        value: function getTileSet() {
            return this.tileSet;
        }
    }, {
        key: "isCollidable",
        value: function isCollidable() {
            return this.collidable;
        }
    }, {
        key: "addTile",
        value: function addTile(tileSetCellIndex) {
            this.tiles.push(tileSetCellIndex);
        }
    }, {
        key: "setTile",
        value: function setTile(column, row, tileSetCellIndex) {
            var tileIndex = this.getTileIndex(column, row);
            this.tiles[tileIndex] = tileSetCellIndex;
        }
    }, {
        key: "getTileIndex",
        value: function getTileIndex(column, row) {
            return row * this.columns + column;
        }
    }, {
        key: "getTileSetCellIndex",
        value: function getTileSetCellIndex(column, row) {
            var tileIndex = this.getTileIndex(column, row);
            return this.tiles[tileIndex];
        }
    }, {
        key: "getTile",
        value: function getTile(column, row) {
            var index = this.getTileIndex(column, row);
            return this.tiles[index];
        }
    }]);

    return TiledLayer;
}();

exports.TiledLayer = TiledLayer;

},{}],23:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var UIController = function UIController(canvasId, initScene) {
    var _this = this;

    _classCallCheck(this, UIController);

    this.keyDownHandler = function (event) {
        var keyPress = event.key;
        var posX = 0;
        var posY = 0;
        var vp = _this.scene.getViewport();
        console.log("keyPress: " + keyPress);
        if (keyPress == 'w') {
            // keyPress = "w"
            posY--;
            vp.setPosition(vp.getX(), vp.getY() + posY * 10);
        }
        if (keyPress == 's') {
            // keyPress = "s"
            posY++;
            vp.setPosition(vp.getX(), vp.getY() + posY * 10);
        }
        if (keyPress == 'a') {
            // keyPress = "a"
            posX--;
            vp.setPosition(vp.getX() + posX * 10, vp.getY());
        }
        if (keyPress == 'd') {
            // keyPress = "d"
            posX++;
            vp.setPosition(vp.getX() + posX * 10, vp.getY());
        }
        _this.scene.updateViewport(posX * 10, posY * 10);
    };
    this.mouseDownHandler = function (event) {
        var mousePressX = event.clientX;
        var mousePressY = event.clientY;
        var sprite = _this.scene.getSpriteAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + sprite);
        if (sprite != null) {
            // START DRAGGING IT
            _this.spriteToDrag = sprite;
            _this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            _this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }
    };
    this.mouseMoveHandler = function (event) {
        if (_this.spriteToDrag != null) {
            _this.spriteToDrag.getPosition().set(event.clientX + _this.dragOffsetX, event.clientY + _this.dragOffsetY, _this.spriteToDrag.getPosition().getZ(), _this.spriteToDrag.getPosition().getW());
        }
    };
    this.mouseUpHandler = function (event) {
        _this.spriteToDrag = null;
    };
    this.spriteToDrag = null;
    this.scene = initScene;
    this.dragOffsetX = -1;
    this.dragOffsetY = -1;
    var canvas = document.getElementById(canvasId);
    canvas.addEventListener("mousedown", this.mouseDownHandler);
    canvas.addEventListener("mousemove", this.mouseMoveHandler);
    canvas.addEventListener("mouseup", this.mouseUpHandler);
    canvas.addEventListener("keydown", this.keyDownHandler);
};

exports.UIController = UIController;

},{}]},{},[1])

//# sourceMappingURL=demo.js.map
