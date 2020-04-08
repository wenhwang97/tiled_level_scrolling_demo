import { TileSet } from "./TileSet";

export class TiledLayer {
    private collidable : boolean;
    private tiles : Array<number>;
    private columns : number;
    private rows : number;
    private tileSet : TileSet;
    
    // WE WILL STORE RENDERING-SPECIFIC DATA HERE
    private renderData : object;

    constructor(initColumns : number,
                initRows : number,
                initTileSet : TileSet) {
        this.tiles = new Array();
        this.columns = initColumns;
        this.rows = initRows;
        this.tileSet = initTileSet;
    }

    public setRenderData(initRenderData : object) : void {
        this.renderData = initRenderData;
    }

    public getRenderData() : object {
        return this.renderData;
    }

    public getMinimumVisibleColumn(viewportLeft : number) : number {
        return (viewportLeft / this.tileSet.getTileWidth());
    }

    public getMaximumVisibleColumn(viewportRight : number) : number {
        return (viewportRight / this.tileSet.getTileWidth());
    }

    public getMinimumVisibleRow(viewportTop : number) : number {
        return (viewportTop / this.tileSet.getTileHeight());
    }

    public getMaximumVisibleRow(viewportBottom : number) : number {
        return (viewportBottom / this.tileSet.getTileHeight());
    }

    public getNumCells() : number {
        return this.columns * this.rows;
    }

    public getColumns() : number {
        return this.columns;
    }

    public getRows() : number {
        return this.rows;
    }

    public getTileSet() : TileSet {
        return this.tileSet;
    }

    public isCollidable() : boolean {
        return this.collidable;
    }

    public addTile(tileSetCellIndex : number) : void {
        this.tiles.push(tileSetCellIndex);
    }

    public setTile(column : number, row : number, tileSetCellIndex : number) {
        let tileIndex : number = this.getTileIndex(column, row);
        this.tiles[tileIndex] = tileSetCellIndex;
    }

    public getTileIndex(column : number, row : number) : number {
        return (row * this.columns) + column;
    }

    public getTileSetCellIndex(column : number, row : number) : number {
        let tileIndex : number = this.getTileIndex(column, row);
        return this.tiles[tileIndex];
    }

    public getTile(column : number, row : number) : number {
        let index = this.getTileIndex(column, row);
        return this.tiles[index];
    }
}