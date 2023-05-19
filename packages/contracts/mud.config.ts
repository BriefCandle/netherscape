import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "netherscape",
  enums: {
    ParcelType: ["CUSTOMIZED", "NONE", "LEFT", "UP", "RIGHT", "DOWN", "LEFTUP", "RIGHTUP", "RIGHTDOWN", "LEFTDOWN"],
    TerrainType: ["NONE", "TREE", "GRASS", "FLOWER", "CONSOLE"]
  },
  tables: {
    MapConfig: {
      // primaryKeys: {y: "uint16"},
      schema: {
        parcelTypes: "uint8[32]"
      },
    },
    ParcelTerrain: "bytes", // parcel (template) ID -> terrain value
    Obstruction: "bool",     // hash(parcelID, coord on parcel) -> bool
    Player: "bool",
    PlayerPosition: {
      dataStruct: false,
      schema: {
        x: "uint16",
        y: "uint16"
      }
    }
  },
  modules: [
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("PlayerPosition")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PlayerPosition")]
    }
  ]
});
