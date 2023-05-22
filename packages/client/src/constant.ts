
// straight-up copied from ParcelSystem.sol
export enum ParcelType {
  CUSTOMIZED, // for any parcel modified in game
  NONE,
  LEFT,
  UP,
  RIGHT,
  DOWN,
  LEFTUP,
  RIGHTUP,
  RIGHTDOWN,
  LEFTDOWN,
  NONE1,
  LEFT1,
  UP1,
  RIGHT1,
  DOWN1,
  LEFTUP1,
  RIGHTUP1,
  RIGHTDOWN1,
  LEFTDOWN1
}

export enum TerrainType {
  NONE,
  TREE,
  GRASS,
  FLOWER,
  WATER,
  GRAVEL,
  // buildings
  CONSOLE,
  // only for hackathon
  ENCOUNTER
}

export type TerrainConfig = {
  tile00: string;
  tile10: string;
  tile01: string;
  tile11: string;
};

export const terrainTypes: Record<TerrainType, TerrainConfig> = {
  // [TerrainType.Path]: {
  //   tile00: "path",
  //   tile10: "path",
  //   tile01: "path",
  //   tile11: "path"
  // },
  [TerrainType.GRAVEL]: {
    tile00: "gravel",
    tile10: "gravel",
    tile01: "gravel",
    tile11: "gravel"
  },
  [TerrainType.GRASS]: {
    tile00: "grass",
    tile10: "grass",
    tile01: "grass",
    tile11: "grass"
  },
  [TerrainType.FLOWER]: {
    tile00: "grass",
    tile10: "flower",
    tile01: "flower",
    tile11: "grass"
  },
  // [TerrainType.GrassTall]: {
  //   tile00: "grass_tall",
  //   tile10: "grass_tall",
  //   tile01: "grass_tall",
  //   tile11: "grass_tall"
  // },
  [TerrainType.TREE]: {
    tile00: "tree_short00",
    tile10: "tree_short10",
    tile01: "tree_short01",
    tile11: "tree_short11"
  },
  [TerrainType.WATER]: {
    tile00: "water",
    tile10: "water",
    tile01: "water",
    tile11: "water"
  },
  // [TerrainType.Nurse]: {
  //   tile00: "",
  //   tile10: "",
  //   tile01: "",
  //   tile11: ""
  // },
  [TerrainType.CONSOLE]: {
    tile00: "pc00",
    tile10: "pc10",
    tile01: "pc01",
    tile11: "pc11"
  },
  [TerrainType.ENCOUNTER]: {
    tile00: "",
    tile10: "",
    tile01: "",
    tile11: ""
  },
  [TerrainType.NONE]: {
    tile00: "",
    tile10: "",
    tile01: "",
    tile11: ""
  }
};

export enum NodeType {
  NONE,
  EMPRESS,
  TOWER
}

export const terrain_width = 40;   //pixel
export const terrain_height = 40;  //pixel

export const parcel_width = 5; 
export const parcel_height = 5;

export const map_width = 32;
export const map_height = 32;

export const max_width = parcel_width * map_width;
export const max_height = parcel_height * map_height;

export type Coord = {
  x: number,
  y: number
}

export const spdAdjust = 10;