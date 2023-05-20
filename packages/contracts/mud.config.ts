import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "netherscape",
  enums: {
    ParcelType: ["CUSTOMIZED", "NONE", "LEFT", "UP", "RIGHT", "DOWN", "LEFTUP", "RIGHTUP", "RIGHTDOWN", "LEFTDOWN"],
    TerrainType: ["NONE", "TREE", "GRASS", "FLOWER", "CONSOLE"],
    AttackType: ["NORMAL", "PARALYSIS"],
  },
  systems: {
    BattleInitSystem: {
      name: "battleInit",
      openAccess: false,
      accessList:["CrawlSystem"]
    },
  },
  tables: {
    // ----- player position, map, parcel -----
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
    },
    // ----- PC, attacks, and command -----
    PCClass: {
      schema: {
        maxHP: "uint16",
        atk: "uint16",
        spd: "uint16",
        maxPP: "uint16",
        attackIDs: "bytes32[2]",
        className: "string",
      }
    },
    PCInstance: {
      schema: {
        pcClassID: "bytes32",
        maxHP: "uint16",
        atk: "uint16",
        spd: "uint16",
        maxPP: "uint16",
        currentHP: "uint16",
        blockStarts: "uint256",
        attackIDs: "bytes32[2]" // TODO: change it to dynamic
      }
    },
    AttackClass: {
      schema: {
        power: "uint16",
        pp: "uint16",
        crit: "uint16",
        attackType: "AttackType",
        className: "string",
      }
    },
    CommandedBy: "bytes32",
    // ----- battle related -----
    BattleWith: "bytes32",
    SiegedBy: "bytes32"
  },
  modules: [
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("PlayerPosition"), resolveTableId("SiegedBy"), resolveTableId("BattleWith")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PlayerPosition"), resolveTableId("SiegedBy"), resolveTableId("BattleWith"), resolveTableId("CommandedBy")]
    }
  ]
});
