/*
 * This provides responses to UI input.
 */
import {AnimatedSprite} from "../scene/sprite/AnimatedSprite"
import {SceneGraph} from "../scene/SceneGraph"
import { Viewport } from "../scene/Viewport";

export class UIController {
    private spriteToDrag : AnimatedSprite;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;

    public constructor(canvasId : string, initScene : SceneGraph) {
        this.spriteToDrag = null;
        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        canvas.addEventListener("keydown", this.keyDownHandler);
    }

    public keyDownHandler = (event : KeyboardEvent) : void => {
        let keyPress : string = event.key;
        let posX : number = 0;
        let posY : number = 0;
        let vp : Viewport = this.scene.getViewport();
        console.log("keyPress: " + keyPress);
        if (keyPress == 'w') {  // keyPress = "w"
            posY--;
            vp.setPosition(vp.getX(), vp.getY() + posY * 10);
        }
        if (keyPress == 's') {  // keyPress = "s"
            posY++;
            vp.setPosition(vp.getX(), vp.getY() + posY * 10);
        }
        if (keyPress == 'a') {   // keyPress = "a"
            posX--;
            vp.setPosition(vp.getX() + posX * 10, vp.getY());
        }
        if (keyPress == 'd') {  // keyPress = "d"
            posX++;
            vp.setPosition(vp.getX() + posX * 10, vp.getY());
        }

        this.scene.updateViewport(posX * 10, posY * 10);
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + sprite);
        if (sprite != null) {
            // START DRAGGING IT
            this.spriteToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        if (this.spriteToDrag != null) {
            this.spriteToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.spriteToDrag.getPosition().getZ(), 
                                                this.spriteToDrag.getPosition().getW());
        }
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        this.spriteToDrag = null;
    }
}