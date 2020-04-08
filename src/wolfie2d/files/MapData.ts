/*
 * MapData is an interfaces for loading such data
 * from JSON files.
 */
export interface MapData {
    compressionlevel : number,
    height : number,
    infinite :boolean,
    layers : Array<TiledLayerData>,
    nextlayeri : number,
    nextobjectid : number,
    orientation : string,
    renderorder : string,
    tiledversion : string,
    tileheight : number,
    tilesets : Array<TileSetData>,
    tilewidth : number,
    type : string,
    version : number,
    width :50
}

export interface TiledLayerData {
    data : Array<number>,
    height : number,
    id : number,
    name : string,
    opacity : number,
    properties: Array<TiledLayerProperty>,
    type : string,
    visible : boolean,
    width : number,
    x : number,
    y : number
}

export interface TiledLayerProperty {
    name : string,
    type : string,
    value : string
}

export interface TileSetData {
    columns : number,
    firstgid : number,
    image : string,
    imageheight : number,
    imagewidth : number,
    margin : number,
    name : string,
    spacing : number,
    tilecount : number,
    tileheight : number,
    tilewidth : number,
    transparentcolor : string
}