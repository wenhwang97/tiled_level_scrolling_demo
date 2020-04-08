import { WebGLGameShader } from './WebGLGameShader'
import { Matrix } from '../math/Matrix'
import { Vector3 } from '../math/Vector3'

export abstract class WebGLGameRenderingComponent {
    protected readonly A_POSITION = "a_Position";
    protected readonly A_TEX_COORD = "a_TexCoord";
    protected readonly U_MESH_TRANSFORM = "u_MeshTransform";
    protected readonly U_TEX_COORD_FACTOR = "u_TexCoordFactor";
    protected readonly U_TEX_COORD_SHIFT = "u_TexCoordShift";
    protected readonly U_SAMPLER = "u_Sampler";
    protected readonly NUM_VERTICES = 4;
    protected readonly FLOATS_PER_VERTEX = 2;
    protected readonly FLOATS_PER_TEXTURE_COORDINATE = 2;
    protected readonly TOTAL_BYTES = 16;
    protected readonly VERTEX_POSITION_OFFSET = 0;
    protected readonly TEXTURE_COORDINATE_OFFSET = 8;
    protected readonly INDEX_OF_FIRST_VERTEX = 0;

    // THESE WILL BE PROVIDED CUSTOMLY AFTER CONSTRUCTION DURING init
    protected shader: WebGLGameShader;
    protected vertexDataBuffer: WebGLBuffer;
    protected webGLAttributeLocations: Map<string, GLuint>;
    protected webGLUniformLocations: Map<string, WebGLUniformLocation>;

    // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
    protected meshTransform: Matrix;
    protected meshTranslate: Vector3;
    protected meshRotate: Vector3;
    protected meshScale: Vector3;

    constructor() {
        // WE'LL MANAGE THESE FOR OUR WebGL SHADERS
        this.webGLAttributeLocations = new Map();
        this.webGLUniformLocations = new Map();

        // WE'LL USE THESE FOR TRANSLATING, ROTATING, AND SCALING THE MESH
        this.meshTransform = new Matrix(4, 4);
        this.meshTranslate = new Vector3();
        this.meshRotate = new Vector3();
        this.meshScale = new Vector3();
    }

    public init(webGL: WebGLRenderingContext,
                vertexShaderSource: string,
                fragmentShaderSource: string,
                renderSetupData: object): void {
        // FIRST WE NEED TO MAKE THE SHADER
        this.shader = new WebGLGameShader();
        this.shader.init(webGL, vertexShaderSource, fragmentShaderSource);

        // CREATE THE BUFFER ON THE GPU
        this.vertexDataBuffer = webGL.createBuffer();

        // BIND THE BUFFER TO BE VERTEX DATA
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexDataBuffer);

        // MAKE THE MESH DATA OURSELVES IN A CHILD CLASS
        let meshVertexData : Float32Array = this.getVertexData(renderSetupData);

        // AND SEND THE DATA TO THE BUFFER WE CREATED ON THE GPU
        webGL.bufferData(webGL.ARRAY_BUFFER, meshVertexData, webGL.STATIC_DRAW);

        // SETUP THE SHADER ATTRIBUTES AND UNIFORMS
        this.loadAttributeLocations(webGL, this.getShaderAttributeNames());
        this.loadUniformLocations(webGL, this.getShaderUniformNames());
    }

    public abstract getVertexData(renderData : object) : Float32Array;
    public abstract getShaderAttributeNames(): string[];
    public abstract getShaderUniformNames(): string[];

    /**
     * This function loads all the attribute data values so that we can
     * retrieve them later when it is time to render. Note that this function
     * can only be called after the shader program has been created.
     */
    protected loadAttributeLocations(webGL: WebGLRenderingContext, attributeLocationNames: Array<string>) {
        for (var i = 0; i < attributeLocationNames.length; i++) {
            let locationName: string = attributeLocationNames[i];
            let location: GLuint = webGL.getAttribLocation(this.shader.getProgram(), locationName);
            this.webGLAttributeLocations.set(locationName, location);
        }
    }

    /**
     * This function loads all the uniform data values so that we can
     * retrieve them later when it is time to render. Note that this function
     * can only be called after the shader program has been created.
     */
    protected loadUniformLocations(webGL: WebGLRenderingContext, uniformLocationNames: Array<string>) {
        for (let i: number = 0; i < uniformLocationNames.length; i++) {
            let locationName: string = uniformLocationNames[i];
            let location: WebGLUniformLocation = webGL.getUniformLocation(this.shader.getProgram(), locationName);
            this.webGLUniformLocations.set(locationName, location);
        }
    }
}