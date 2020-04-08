import {WebGLGameRenderingComponent} from './WebGLGameRenderingComponent'
import {MathUtilities} from '../math/MathUtilities'
import {AnimatedSprite} from '../scene/sprite/AnimatedSprite'
import {AnimatedSpriteType} from '../scene/sprite/AnimatedSpriteType'
import {WebGLGameTexture} from './WebGLGameTexture'
import {Viewport} from '../scene/Viewport'

export class WebGLGameSpriteRenderer extends WebGLGameRenderingComponent {

    public constructor() {
        super();
    }

    public getVertexData() : Float32Array {
        return new Float32Array([
            -0.5,  0.5, 0.0, 0.0,
            -0.5, -0.5, 0.0, 1.0,
             0.5,  0.5, 1.0, 0.0,
             0.5, -0.5, 1.0, 1.0
        ]);
    }
    public getShaderAttributeNames() : string[] {
        return [this.A_POSITION, this.A_TEX_COORD];
    }
    public getShaderUniformNames() : string[] {
        return [this.U_MESH_TRANSFORM, this.U_SAMPLER, this.U_TEX_COORD_FACTOR, this.U_TEX_COORD_SHIFT];
    }

    public render(  webGL : WebGLRenderingContext,
                    viewport : Viewport,
                    visibleSprites : Array<AnimatedSprite>) : void {
        // SELECT THE ANIMATED SPRITE RENDERING SHADER PROGRAM FOR USE
        let shaderProgramToUse = this.shader.getProgram();
        webGL.useProgram(shaderProgramToUse);

       // AND THEN RENDER EACH ONE
       for (let sprite of visibleSprites) {
            this.renderAnimatedSprite(webGL, viewport, sprite);        
        }
    }

    private renderAnimatedSprite(   webGL : WebGLRenderingContext,
                                    viewport : Viewport, 
                                    sprite : AnimatedSprite) : void {
        // YOU'LL NEED TO UPDATE THIS METHOD TO MAKE SURE SPRITES SCROLL AND ROTATE
        
        let canvasWidth : number = webGL.canvas.width;
        let canvasHeight : number = webGL.canvas.height;
        let spriteType : AnimatedSpriteType = sprite.getSpriteType();
        let texture : WebGLGameTexture = spriteType.getSpriteSheetTexture();

        // CALCULATE HOW MUCH TO TRANSLATE THE QUAD PER THE SPRITE POSITION
        let spriteWidth : number = spriteType.getSpriteWidth();
        let spriteHeight : number = spriteType.getSpriteHeight();
        let spriteXInPixels : number = sprite.getPosition().getX() + (spriteWidth/2);
        let spriteYInPixels : number = sprite.getPosition().getY() + (spriteHeight/2);
        let spriteXTranslate : number = (spriteXInPixels - (canvasWidth/2))/(canvasWidth/2);
        let spriteYTranslate : number = (spriteYInPixels - (canvasHeight/2))/(canvasHeight/2);
        this.meshTranslate.setX(spriteXTranslate);
        this.meshTranslate.setY(-spriteYTranslate);

        // CALCULATE HOW MUCH TO SCALE THE QUAD PER THE SPRITE SIZE
        let defaultWidth : number = canvasWidth;
        let defaultHeight : number = canvasHeight;
        let scaleX : number = 2*spriteWidth/defaultWidth;
        let scaleY : number = 2*spriteHeight/defaultHeight;
        this.meshScale.set(scaleX, scaleY, 0.0, 0.0);//1.0, 1.0);

        // @todo - COMBINE THIS WITH THE ROTATE AND SCALE VALUES FROM THE SPRITE
        MathUtilities.identity(this.meshTransform);
        MathUtilities.model(this.meshTransform, this.meshTranslate, this.meshRotate, this.meshScale);
        
        // FIGURE OUT THE TEXTURE COORDINATE FACTOR AND SHIFT
        let texCoordFactorX : number = spriteWidth/texture.width;
        let texCoordFactorY : number = spriteHeight/texture.height;
        let spriteLeft : number = sprite.getLeft();
        let spriteTop : number = sprite.getTop();
        let texCoordShiftX : number = spriteLeft/texture.width;
        let texCoordShiftY : number = spriteTop/texture.height;

        // USE THE ATTRIBUTES
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexDataBuffer);
        webGL.bindTexture(webGL.TEXTURE_2D, texture.webGLTexture);

        // HOOK UP THE ATTRIBUTES
        let a_PositionLocation : GLuint = this.webGLAttributeLocations.get(this.A_POSITION);
        webGL.vertexAttribPointer(a_PositionLocation, this.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, this.TOTAL_BYTES, this.VERTEX_POSITION_OFFSET);
        webGL.enableVertexAttribArray(a_PositionLocation);
        let a_TexCoordLocation : GLuint = this.webGLAttributeLocations.get(this.A_TEX_COORD);
        webGL.vertexAttribPointer(a_TexCoordLocation, this.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, this.TOTAL_BYTES, this.TEXTURE_COORDINATE_OFFSET);
        webGL.enableVertexAttribArray(a_TexCoordLocation);

        // USE THE UNIFORMS
        let u_MeshTransformLocation : WebGLUniformLocation = this.webGLUniformLocations.get(this.U_MESH_TRANSFORM);
        webGL.uniformMatrix4fv(u_MeshTransformLocation, false, this.meshTransform.getData());
        let u_SamplerLocation : WebGLUniformLocation = this.webGLUniformLocations.get(this.U_SAMPLER);
        webGL.uniform1i(u_SamplerLocation, texture.webGLTextureId);
        let u_TexCoordFactorLocation : WebGLUniformLocation = this.webGLUniformLocations.get(this.U_TEX_COORD_FACTOR);
        webGL.uniform2f(u_TexCoordFactorLocation, texCoordFactorX, texCoordFactorY);
        let u_TexCoordShiftLocation : WebGLUniformLocation = this.webGLUniformLocations.get(this.U_TEX_COORD_SHIFT);
        webGL.uniform2f(u_TexCoordShiftLocation, texCoordShiftX, texCoordShiftY);

        // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
        webGL.drawArrays(webGL.TRIANGLE_STRIP, this.INDEX_OF_FIRST_VERTEX, this.NUM_VERTICES);
        this.meshRotate.setZ(Math.PI);
    }
}