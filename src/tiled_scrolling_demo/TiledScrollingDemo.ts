/*
 * TiledScrollingDemo.ts - demonstrates how tiled layers can be rendered
 * and scrolled using a viewport. 
 */
import {Game} from '../wolfie2d/Game'
import {AnimatedSprite} from '../wolfie2d/scene/sprite/AnimatedSprite'
import {AnimatedSpriteType} from '../wolfie2d/scene/sprite/AnimatedSpriteType'
import {TiledLayer} from '../wolfie2d/scene/tiles/TiledLayer'
import {SceneGraph} from '../wolfie2d/scene/SceneGraph'
import {Viewport} from '../wolfie2d/scene/Viewport'
import {TextToRender, TextRenderer} from '../wolfie2d/rendering/TextRenderer'

// THIS IS THE ENTRY POINT INTO OUR APPLICATION, WE MAKE
// THE Game OBJECT AND INITIALIZE IT WITH THE CANVASES
let game = new Game("game_canvas", "text_canvas");

// WE THEN LOAD OUR GAME SCENE, WHICH WILL FIRST LOAD
// ALL GAME RESOURCES, THEN CREATE ALL SHADERS FOR
// RENDERING, AND THEN PLACE ALL GAME OBJECTS IN THE SCENE.
// ONCE IT IS COMPLETED WE CAN START THE GAME
const DESERT_SCENE_PATH = "resources/scenes/ScrollableDesert.json";
game.getResourceManager().loadScene(DESERT_SCENE_PATH, 
                                    game.getSceneGraph(),
                                    game.getRenderingSystem(), 
                                    function() {
    // ADD ANY CUSTOM STUFF WE NEED HERE, LIKE TEXT RENDERING
    // LET'S ADD A BUNCH OF RANDOM SPRITES
    let world : TiledLayer[] = game.getSceneGraph().getTiledLayers();
    let worldWidth : number = world[0].getColumns() * world[0].getTileSet().getTileWidth();
    let worldHeight : number = world[0].getRows() * world[0].getTileSet().getTileHeight();
    for (let i = 0; i < 100; i++) {
        let type : AnimatedSpriteType = game.getResourceManager().getAnimatedSpriteType("ANT");
        if (i >= 50) {
            type = game.getResourceManager().getAnimatedSpriteType("COCKROACH");
        }
        let randomSprite : AnimatedSprite = new AnimatedSprite(type, "IDLE");
        let randomX : number = Math.random() * worldWidth;
        let randomY : number = Math.random() * worldHeight;
        randomSprite.getPosition().set(randomX, randomY, 0, 1);
        game.getSceneGraph().addAnimatedSprite(randomSprite);
    }

    let type : AnimatedSpriteType = game.getResourceManager().getAnimatedSpriteType("SPIDER");
    let characterSprite : AnimatedSprite = new AnimatedSprite(type, "IDLE");
    let charX : number = game.getSceneGraph().getViewport().getWidth() / 2;
    let charY : number = game.getSceneGraph().getViewport().getHeight() / 2;
    characterSprite.getPosition().set(charX, charY, 0, 1);
    game.getSceneGraph().addAnimatedSprite(characterSprite);
    game.getSceneGraph().setCharacter(characterSprite);

    // NOW ADD TEXT RENDERING. WE ARE GOING TO RENDER 3 THINGS:
        // NUMBER OF SPRITES IN THE SCENE
        // LOCATION IN GAME WORLD OF VIEWPORT
        // NUMBER OF SPRITES IN VISIBLE SET (i.e. IN THE VIEWPORT)
    let sceneGraph : SceneGraph = game.getSceneGraph();
    let spritesInSceneText : TextToRender = new TextToRender("Sprites in Scene", "", 20, 50, function() {
        spritesInSceneText.text = "Sprites in Scene: " + sceneGraph.getNumSprites();
    });
    let viewportText : TextToRender = new TextToRender("Viewport", "", 20, 70, function() {
        let viewport : Viewport = sceneGraph.getViewport();
        viewportText.text = "Viewport (w, h, x, y): ("  + viewport.getWidth() + ", "
                                                        + viewport.getHeight() + ", "
                                                        + viewport.getX() + ", "
                                                        + viewport.getY() + ")";
    });
    let spritesInViewportText : TextToRender = new TextToRender("Sprites in Viewport", "", 20, 90, function() {
        spritesInViewportText.text = "Sprites in Viewport: " + sceneGraph.scope().length;
    });
    let worldDimensionsText : TextToRender = new TextToRender("World Dimensions", "", 20, 110, function() {
        worldDimensionsText.text = "World Dimensions (w, h): (" + worldWidth + ", " + worldHeight + ")";
    });
    let textRenderer = game.getRenderingSystem().getTextRenderer();
    textRenderer.addTextToRender(spritesInSceneText);
    textRenderer.addTextToRender(viewportText);
    textRenderer.addTextToRender(spritesInViewportText);
    textRenderer.addTextToRender(worldDimensionsText);

    // AND START THE GAME LOOP
    game.start();
});