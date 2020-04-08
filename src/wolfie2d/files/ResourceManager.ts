/*
 * ResourceManager.js
 *
 * This class is responsible for managing all shared resources. This means things
 * that may be needed by multiple game objects. In this application this means
 * textures for the purpose of GPU rendering and animated sprite types.
 */
import { SpriteTypeData, AnimationStateData } from './SpriteTypeData'
import { MapData, TiledLayerData, TiledLayerProperty, TileSetData } from './MapData'
import { SceneData, NamedPath } from './SceneData'
import { WebGLGameRenderingSystem } from '../rendering/WebGLGameRenderingSystem'
import { WebGLGameTexture } from '../rendering/WebGLGameTexture'
import { AnimatedSpriteType } from '../scene/sprite/AnimatedSpriteType'
import { SceneGraph } from '../scene/SceneGraph'
import { TiledLayer } from '../scene/tiles/TiledLayer'
import { TileSet } from '../scene/tiles/TileSet'

export class ResourceManager {
    // GAME SHADER PROGRAM SOURCE CODE WILL BE LOADED HERE. NOTE THAT
    // WE HAVE ONE MAP FOR MAPPING THE SHADER NAME TO THE SOURCE CODE
    // AND ANOTHER FOR MAPPING THE SHADER NAME TO THE FILE PATH
    private gameShadersSource: Map<string, string> = new Map();
    private gameShadersSourcePaths: Map<string, string> = new Map();
    private numShadersToLoad: number;
    private numShadersLoaded: number;

    // SPRITE TYPES
    private gameSpriteTypes: Map<string, AnimatedSpriteType> = new Map();
    private gameSpriteTypePaths: Map<string, string> = new Map();
    private numSpriteTypesToLoad: number;
    private numSpriteTypesLoaded: number;

    // TILE SETS
    private gameTileSets: Map<string, TileSet> = new Map();
    private gameTileSetPaths: Map<string, string> = new Map();
    private numTileSetsToLoad: number;
    private numTileSetsLoaded: number;

    // GAME TEXTURES 
    private gameTextures: Map<string, WebGLGameTexture> = new Map();
    private numTexturesToLoad: number;
    private numTexturesLoaded: number;

    public constructor() { }

    // ACCESSOR METHODS

    public getShaderSource(shaderName: string): string {
        return this.gameShadersSource.get(shaderName);
    }

    public getAnimatedSpriteType(spriteTypeName: string): AnimatedSpriteType {
        return this.gameSpriteTypes.get(spriteTypeName);
    }

    public getTileSet(tileSetName: string): TileSet {
        return this.gameTileSets.get(tileSetName);
    }

    public getTexture(texturePath: string): WebGLGameTexture {
        return this.gameTextures.get(texturePath);
    }

    public clear() : void {
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
    public loadScene(   scenePath: string,
                        sceneGraph: SceneGraph,
                        renderingSystem: WebGLGameRenderingSystem,
                        callback: Function): void {
        // CLEAR THE SCENE GRAPH TO GET RID OF ALL THE OLD STUFF
        // THAT MAY HAVE BEEN LOADED FOR SOME OTHER LEVEL
        sceneGraph.clear();

        // CLEAR ALL THE SCENE RESOURCES 
        this.clear();

        // WE HAVE OUR OWN CUSTOM JSON FILE FORMAT TO REPRESENT OUR SCENE
        let thisResourceManager: ResourceManager = this;
        this.loadTextFile(scenePath, function (jsonSceneText: string) {
            let sceneData: SceneData = <SceneData>JSON.parse(jsonSceneText);
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

    public initAllShaders(  renderingSystem: WebGLGameRenderingSystem,
                            sceneGraph: SceneGraph): void {
        // SETUP THE SPRITE RENDERER FOR USE WITH THE SPRITE SHADER THAT'S BEEN LOADED
        let spriteRendererVertexShaderSource: string = this.getShaderSource("SPRITE_VERTEX_SHADER");
        let spriteRendererFragmentShaderSource: string = this.getShaderSource("SPRITE_FRAGMENT_SHADER");
        renderingSystem.getSpriteRenderer().init(renderingSystem.getWebGL(), spriteRendererVertexShaderSource, spriteRendererFragmentShaderSource, null);

        // SETUP THE TILED LAYER RENDERER FOR USE WITH THE TILED SHADER THAT'S BEEN LOADED
        let tiledLayerVertexShaderSource: string = this.getShaderSource("TILED_LAYER_VERTEX_SHADER");
        let tiledLayerFragmentShaderSource: string = this.getShaderSource("TILED_LAYER_FRAGMENT_SHADER");
        renderingSystem.getTiledLayerRenderer().init(renderingSystem.getWebGL(), tiledLayerVertexShaderSource, tiledLayerFragmentShaderSource, sceneGraph.getTiledLayers());
    }

    public loadShadersSource(   renderingSystem: WebGLGameRenderingSystem,
                                namedPaths: Array<NamedPath>,
                                callback: Function): void {
        // START BY LOADING ALL THE SHADER SOURCE FILES THESE CAN THEN BE
        // RETRIEVED LATER BY THE RENDERERS WHEN ITS TIME TO BUILD THE 
        // SHADER PROGRAMS
        let thisResourceManager: ResourceManager = this;
        this.numShadersLoaded = 0;
        this.numShadersToLoad = namedPaths.length;
        for (let i: number = 0; i < namedPaths.length; i++) {
            let namedPath: NamedPath = namedPaths[i];
            let shaderName: string = namedPath.name;
            let shaderPath: string = namedPath.path;
            this.loadTextFile(shaderPath, function (shaderSourceCode: string) {
                thisResourceManager.gameShadersSource.set(shaderName, shaderSourceCode);
                thisResourceManager.gameShadersSourcePaths.set(shaderName, shaderPath);
                thisResourceManager.completeLoadingShader(function () {
                    // ALL SOURCE CODE IS LOADED SO DO WHAT'S NEXT
                    callback();
                });
            });
        }
    }

    public buildPathToFileInSameDirectory(baseFileWithPath : string, targetFileName : string) : string {
        let lastIndexOfSlash: number = baseFileWithPath.lastIndexOf('/');
        let targetFilePath : string = "./";
        if (lastIndexOfSlash > 0)
            targetFilePath = baseFileWithPath.substring(0, lastIndexOfSlash);
        targetFilePath += "/" + targetFileName;
        return targetFilePath;
    }

    public loadMap( mapPath: string,
                    renderingSystem: WebGLGameRenderingSystem,
                    sceneGraph: SceneGraph,
                    callback: Function): void {
        let thisResourceManager: ResourceManager = this;
        this.loadTextFile(mapPath, function (jsonMapText: string) {
            let mapData: MapData = <MapData>JSON.parse(jsonMapText);

            // WE ONLY USE ONE TILE SET
            let tilesetFileName: string = mapData.tilesets[0].image;
            let tilesetFilePath = thisResourceManager.buildPathToFileInSameDirectory(mapPath, tilesetFileName);

            // USE THE PATHS TOLOAD THE TILE SET TEXTURES
            thisResourceManager.loadTexture(tilesetFilePath, renderingSystem, function (tilesetTexture : WebGLGameTexture) {
                // NOW THAT THE TILE SET TEXTURES HAVE BEEN LOADED,
                // LOAD ALL THEIR ASSOCIATED TILESET DATA
                for (let i = 0; i < mapData.tilesets.length; i++) {
                    let tileSetData : TileSetData = mapData.tilesets[i];
                    let rows : number = Math.ceil(tileSetData.tilecount/tileSetData.columns);
                    let tileSetToAdd : TileSet = new TileSet(
                                                    tileSetData.name,
                                                    tileSetData.columns,
                                                    rows,
                                                    tileSetData.tilewidth,
                                                    tileSetData.tileheight,
                                                    tileSetData.spacing,
                                                    tileSetData.imagewidth,
                                                    tileSetData.imageheight,
                                                    tileSetData.firstgid - 1,
                                                    tilesetTexture);                    
                    thisResourceManager.gameTileSets.set(tileSetToAdd.getName(), tileSetToAdd);
                }

                // AND NOW THAT THE TILE SETS HAVE BEEN LOADED
                // WE CAN LOAD THE MAP'S TILED LAYERS, THOUGH NOTE
                // IN THIS EXAMPLE WE ARE GOING TO KEEP IT SIMPLE
                // AND ASSUME THERE IS ONLY ONE TILE SET
                for (let i = 0; i < mapData.layers.length; i++) {
                    let layerData : TiledLayerData = mapData.layers[i];

                    // THIS LINE OF CODE IS FUNKY, WE CAN ONLY DO THIS WITH A SINGLE TILE SET,
                    // SO TO MAKE THIS A REAL GAME ENGINE THIS WOULD NEED TO BE FIXED
                    let layerTileSet : TileSet = thisResourceManager.gameTileSets.values().next().value;

                    // WE ARE ASSUMING EACH LAYER USES JUST ONE TILE SET, WHICH MIGHT NOT
                    // NECESSARILY BE TRUE. BUT FOR NOW, LET'S JUST MAKE THE LAYERS ALL
                    // USING THE SAME TILE SET, ADD THE TILES, AND THEN ADD THEM TO THE SCENE GRAPH
                    let tiledLayer : TiledLayer = new TiledLayer(layerData.width, layerData.height,layerTileSet);
                    for (let j = 0; j < layerData.data.length; j++) {
                        let tileIndex : number = layerData.data[j] - 1;
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
    public loadTexture(texturePath: string,
        renderingSystem: WebGLGameRenderingSystem,
        callback: Function): void {
        let thisResourceManager = this;
        thisResourceManager.loadImage(texturePath, function (path: string, image: HTMLImageElement) {
            let textureToLoad: WebGLGameTexture = new WebGLGameTexture();
            let id: number = thisResourceManager.gameTextures.size;
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
    public loadSpriteTypes( renderingSystem : WebGLGameRenderingSystem,
                            spriteTypePaths: Array<NamedPath>,
                            callback: Function): void {
        // THEN LOAD THE TEXTURES WE'LL BE USING
        this.numSpriteTypesToLoad = spriteTypePaths.length;
        this.numSpriteTypesLoaded = 0;
        let thisResourceManager = this;
        for (let namedPath of spriteTypePaths) {
            let name: string = namedPath.name;
            let path: string = namedPath.path;
            this.loadSpriteType(renderingSystem, name, path, function () {
                thisResourceManager.completeLoadingSpriteType(callback);
            });
        }
    }

    // PRIVATE HELPER METHODS

    // LOADS A NEW JSON FILE AND UPON COMPLETION CALLS THE callback FUNCTION
    private loadTextFile(textFilePath: string, callback: Function): void {
        let xobj: XMLHttpRequest = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', textFilePath, true);
        xobj.onreadystatechange = function () {
            if ((xobj.readyState == 4) && (xobj.status == 200)) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    // CHECKS TO SEE IF ALL SHADER LOADING IS COMPLETE, IF YES, callback IS INVOKED
    private completeLoadingShader(callback: Function): void {
        this.numShadersLoaded++;
        if (this.numShadersLoaded === this.numShadersToLoad) {
            callback();
        }
    }

    // CHECKS TO SEE IF ALL SPRITE TYPE LOADING IS COMPLETE, IF YES, callback IS INVOKED
    private completeLoadingSpriteType(callback: Function): void {
        this.numSpriteTypesLoaded++;
        if (this.numSpriteTypesLoaded === this.numSpriteTypesToLoad) {
            callback();
        }
    }

    // CHECKS TO SEE IF ALL TEXTURE LOADING IS COMPLETE, IF YES, callback IS INVOKED
    private completeLoadingTexture(callback: Function): void {
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
    private loadImage(path: string, callback: Function): void {
        // MAKE THE IMAGE
        var image = new Image();

        // ONCE THE IMAGE LOADING IS COMPLETED, THE CALLBACK WILL GET CALLED
        image.onload = function () {
            callback(path, image);
        }

        // START IMAGE LOADING
        image.src = path;
    }

    /*
     * This function loads a single sprite type resource from a JSON file and upon
     * completion calls the callback function.
     */
    private loadSpriteType(renderingSystem : WebGLGameRenderingSystem, spriteTypeName: string, jsonFilePath: string, callback: Function): void {
        let thisResourceManager: ResourceManager = this;
        this.loadTextFile(jsonFilePath, function (jsonText: string) {
            thisResourceManager.loadSpriteTypeData(renderingSystem, jsonFilePath, jsonText, function(spriteType : AnimatedSpriteType) {
                thisResourceManager.gameSpriteTypes.set(spriteTypeName, spriteType);
                thisResourceManager.gameSpriteTypePaths.set(spriteTypeName, jsonFilePath);
                callback();
            });
        });
    }

    /*
     * This helper function loads all the json text into an AnimatedSpriteType
     * object and returns it.
     */
    private loadSpriteTypeData = (  renderingSystem : WebGLGameRenderingSystem, 
                                    spriteFilePath : string, 
                                    jsonText: string,
                                    callback : Function): void => {
        let jsonData: SpriteTypeData = <SpriteTypeData>JSON.parse(jsonText);
        let texturePath : string = this.buildPathToFileInSameDirectory(spriteFilePath, jsonData.spriteSheetImage);
        let thisResourceManager : ResourceManager = this;
        this.loadTexture(texturePath, renderingSystem, function(spritesheetTexture : WebGLGameTexture) {
            let spriteWidth: number = jsonData.spriteWidth;
            let spriteHeight: number = jsonData.spriteHeight;
            let animatedSpriteType = new AnimatedSpriteType(spritesheetTexture, spriteWidth, spriteHeight);
            for (let i = 0; i < jsonData.animations.length; i++) {
                let animation = <AnimationStateData>jsonData.animations[i];
                animatedSpriteType.addAnimation(animation.name);
                for (var j = 0; j < animation.frames.length; j++) {
                    var frame = animation.frames[j];
                    animatedSpriteType.addAnimationFrame(animation.name, frame.index, frame.duration);
                }
            }
            callback(animatedSpriteType);
        });
    }
}