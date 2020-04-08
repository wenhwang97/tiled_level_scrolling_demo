/*
 * This serves as the subsystem that manages all game rendering.
 */
import { TextRenderer } from './TextRenderer'
import { WebGLGameTiledLayerRenderer } from './WebGLGameTiledLayerRenderer'
import { WebGLGameSpriteRenderer } from './WebGLGameSpriteRenderer'
import { WebGLGameTexture } from './WebGLGameTexture';
import { AnimatedSprite } from '../scene/sprite/AnimatedSprite'
import { TiledLayer } from '../scene/tiles/TiledLayer'
import { Viewport } from '../scene/Viewport'


export class WebGLGameRenderingSystem {
    private renderingCanvas: HTMLCanvasElement;
    private webGL: WebGLRenderingContext;
    private canvasWidth: number;
    private canvasHeight: number;

    // OUR GAMES RENDER THREE DIFFERENT TYPES OF THINGS
    private tiledLayerRenderer: WebGLGameTiledLayerRenderer;
    private spriteRenderer: WebGLGameSpriteRenderer;
    private textRenderer: TextRenderer;

    public constructor( renderingCanvasId: string,
                        textCanvasId: string) {
        // FIRST SETUP webGL
        this.renderingCanvas = <HTMLCanvasElement>document.getElementById(renderingCanvasId);
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
        this.tiledLayerRenderer = new WebGLGameTiledLayerRenderer();

        // MAKE THE SPRITE RENDERER
        this.spriteRenderer = new WebGLGameSpriteRenderer();

        // THIS WILL STORE OUR TEXT
        this.textRenderer = new TextRenderer(textCanvasId, "serif", 18, "#FFFF00");
    }

    public getTextureConstant(id: number): number {
        // WE ONLY ALLOW FOR 10 TEXTURES TO BE PUT ON THE GPU
        switch (id) {
            case 0: return this.webGL.TEXTURE0;
            case 1: return this.webGL.TEXTURE1;
            case 2: return this.webGL.TEXTURE2;
            case 3: return this.webGL.TEXTURE3;
            case 4: return this.webGL.TEXTURE4;
            case 5: return this.webGL.TEXTURE5;
            case 6: return this.webGL.TEXTURE6;
            case 7: return this.webGL.TEXTURE7;
            case 8: return this.webGL.TEXTURE8;
            default: return this.webGL.TEXTURE9;
        }
    }

    public getWebGL(): WebGLRenderingContext {
        return this.webGL;
    }

    public getTiledLayerRenderer(): WebGLGameTiledLayerRenderer {
        return this.tiledLayerRenderer;
    }

    public getSpriteRenderer(): WebGLGameSpriteRenderer {
        return this.spriteRenderer;
    }

    public getTextRenderer(): TextRenderer {
        return this.textRenderer;
    }

    public initWebGLTexture(textureToInit: WebGLGameTexture, textureId: number, image: HTMLImageElement, callback: Function): void {
        textureToInit.width = image.width;
        textureToInit.height = image.height;

        // CREATE A WebGL TEXTURE ON THE GPU
        textureToInit.webGLTexture = this.webGL.createTexture();
        textureToInit.webGLTextureId = textureId;

        // FLIP THE IMAGE'S y-AXIS
        //webGL.pixelStorei(webGL.UNPACK_FLIP_Y_WEBGL, 1);

        // ACTIVATE THE WebGL TEXTURE ON THE GPU
        //let textureNumName : string = "TEXTURE" + textureId;
        let textureNameConstant: number = this.getTextureConstant(textureId);
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

    public setClearColor(r: number, g: number, b: number, a: number): void {
        this.webGL.clearColor(r, g, b, a);
    }

    public render(  viewport : Viewport,
                    tiledLayers: Array<TiledLayer>,
                    visibleSprites: Array<AnimatedSprite>): void {
        // CLEAR THE CANVAS
        this.webGL.clear(this.webGL.COLOR_BUFFER_BIT | this.webGL.DEPTH_BUFFER_BIT);

        // RENDER THE TILED LAYER FIRST
        this.tiledLayerRenderer.render(this.webGL, viewport, tiledLayers);

        // RENDER THE SPRITES ON ONE CANVAS
        this.spriteRenderer.render(this.webGL, viewport, visibleSprites);

        // THEN THE TEXT ON ANOTHER OVERLAPPING CANVAS
        this.textRenderer.render();
    }
}