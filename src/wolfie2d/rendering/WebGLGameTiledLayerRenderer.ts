import { MathUtilities } from "../math/MathUtilities"
import { TiledLayer } from "../scene/tiles/TiledLayer"
import { TileSet } from "../scene/tiles/TileSet"
import { WebGLGameRenderingComponent } from './WebGLGameRenderingComponent'
import { WebGLGameTexture } from './WebGLGameTexture'
import { Viewport } from '../scene/Viewport'

export class WebGLGameTiledLayerRenderer extends WebGLGameRenderingComponent {
    public constructor() {
        super();
    }

    /**
     * This function generates the array of attribute data needed to 
     * render our TiledLayer and puts it in the tiled layer argument.
     */
    public generateVertexData(tiledLayer: TiledLayer): Float32Array {
        let someNumberYouHaveToDetermine : number = 4;
        let dataToFill = [someNumberYouHaveToDetermine];
        let vertexData: Float32Array = new Float32Array(dataToFill);
        return vertexData;
    }

    public getVertexData(renderSetupData: object): Float32Array {
        // WE WILL NEED THIS TO KNOW HOW LARGE TO MAKE OUR VERTEX DATA BUFFER
        let tiledLayers: Array<TiledLayer> = <Array<TiledLayer>>renderSetupData;
        let tiledLayer: TiledLayer = tiledLayers[0];
        return this.generateVertexData(tiledLayer);
    }

    public getShaderAttributeNames(): string[] {
        // YOU'LL NEED TO DEFINE THIS METHOD
        return [];
    }

    public getShaderUniformNames(): string[] {
        // YOU'LL NEED TO DEFINE THIS METHOD
        return [];
    }

    public render(  webGL: WebGLRenderingContext,
                    viewport : Viewport,
                    tiledLayers: Array<TiledLayer>): void {

            // SELECT THE ANIMATED SPRITE RENDERING SHADER PROGRAM FOR USE
        let shaderProgramToUse = this.shader.getProgram();
        webGL.useProgram(shaderProgramToUse);

        // AND THEN RENDER EACH LAYER
        for (let tiledLayer of tiledLayers) {
            this.renderTiledLayer(webGL, viewport, tiledLayer);
        }
    }

    private renderTiledLayer(
        webGL: WebGLRenderingContext,
        viewport : Viewport,
        tiledLayer: TiledLayer) {
            // YOU'LL NEED TO DEFINE THIS METHOD
    }
}