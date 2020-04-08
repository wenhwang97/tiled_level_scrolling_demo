import { WebGLGameTexture } from "../../rendering/WebGLGameTexture";

export class TileSet {
    private name : string;
    private columns : number;
    private rows : number;
    private tileWidth : number;
    private tileHeight : number;
    private tileSpacing : number;
    private tileSheetWidth : number;
    private tileSheetHeight : number;
    private firstIndex : number;
    private texture : WebGLGameTexture;

    constructor(initName : string, 
                initColumns : number,
                initRows : number,
                initTileWidth : number,
                initTileHeight : number,
                initTileSpacing : number,
                initTileSheetWidth : number,
                initTileSheetHeight : number,
                initFirstIndex : number,
                initTexture : WebGLGameTexture) {
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

    public getName() : string {
        return this.name;
    }

    public getColumns() : number {
        return this.columns;
    }

    public getRows() : number { 
        return this.rows;
    }

    public getTileWidth() : number {
        return this.tileWidth;
    }

    public getTileHeight() : number {
        return this.tileHeight;
    }

    public getTileSpacing() : number {
        return this.tileSpacing;
    }

    public getTileSheetWidth() : number {
        return this.tileSheetWidth;
    }

    public getTileSheetHeight() : number {
        return this.tileSheetHeight;
    }

    public getFirstIndex() : number {
        return this.firstIndex;
    }

    public getTexture() : WebGLGameTexture {
        return this.texture;
    }
}