/*
 * SceneData is an interfaces for loading complete
 * scene data from a JSON file. Our scene file will
 * contain all game-engine specific stuff, like
 * which map to use and animated sprites.
 */
export interface SceneData {
    mapPath : string,
    shaderSourcePaths : NamedPath[],
    spriteTypePaths : NamedPath[]
}
export interface NamedPath {
    name : string,
    path : string
}