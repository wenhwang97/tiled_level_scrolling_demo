import {SceneObject} from './SceneObject'
import {AnimatedSprite} from './sprite/AnimatedSprite'
import {TiledLayer} from './tiles/TiledLayer'
import {TileSet} from './tiles/TileSet'
import {Viewport} from './Viewport';

export class SceneGraph {
    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private animatedSprites : Array<AnimatedSprite>;
    private character : AnimatedSprite;

    // SET OF VISIBLE OBJECTS, NOTE THAT AT THE MOMENT OUR
    // SCENE GRAPH IS QUITE SIMPLE, SO THIS IS THE SAME AS
    // OUR LIST OF ANIMATED SPRITES
    private visibleSet : Array<SceneObject>;

    // WE ARE ALSO USING A TILING ENGINE FOR RENDERING OUR LEVEL
    // NOTE THAT WE MANAGE THIS HERE BECAUSE WE MAY INVOLVE THE TILED
    // LAYERS IN PHYSICS AND PATHFINDING AS WELL
    private tiledLayers : Array<TiledLayer>;
    private tileSets : Array<TileSet>;

    // THE VIEWPORT IS USED TO FILTER OUT WHAT IS NOT VISIBLE
    private viewport : Viewport;

    public constructor() {
        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.clear();
    }

    public clear() : void {
        this.animatedSprites = [];
        this.visibleSet = [];
        this.tiledLayers = [];
        this.tileSets = [];
    }

    public addTileSet(tileSetToAdd : TileSet) : number {
        return this.tileSets.push(tileSetToAdd) - 1;
    }

    public getNumTileSets() : number {
        return this.tileSets.length;
    }

    public getTileSet(index : number) : TileSet {
        return this.tileSets[index];
    }

    public addLayer(layerToAdd : TiledLayer) : void {
        this.tiledLayers.push(layerToAdd);
    }

    public getNumTiledLayers() : number {
        return this.tiledLayers.length;
    }

    public getTiledLayers() : Array<TiledLayer> {
        return this.tiledLayers;
    }

    public getTiledLayer(layerIndex : number) : TiledLayer {
        return this.tiledLayers[layerIndex];
    }

    public getNumSprites() : number {
        return this.animatedSprites.length;
    }

    public setViewport(initViewport : Viewport) : void {
        this.viewport = initViewport;
    }

    public getViewport() : Viewport { 
        return this.viewport;
    }

    public updateViewport(posX : number, posY : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.getPosition().setX(sprite.getPosition().getX() - posX);
            sprite.getPosition().setY(sprite.getPosition().getY() - posY);
        }
    }

    public addAnimatedSprite(sprite : AnimatedSprite) : void {
        this.animatedSprites.push(sprite);
    }

    public getSpriteAt(testX : number, testY : number) : AnimatedSprite {
        for (let sprite of this.animatedSprites) {
            if (sprite.contains(testX, testY))
                return sprite;
        }
        return null;
    }

    public setCharacter(character : AnimatedSprite) : void {
        this.character = character;
    }

    public getCharacter() : AnimatedSprite {
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
    public update(delta : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.update(delta);
        }
    }

    public scope() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.animatedSprites) {
            this.visibleSet.push(sprite);
        }

        return this.visibleSet;
    }
}