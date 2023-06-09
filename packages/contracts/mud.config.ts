import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "netherscape",
  enums: {
    // ParcelType: ["CUSTOMIZED", "NONE", "LEFT", "UP", "RIGHT", "DOWN", "LEFTUP", "RIGHTUP", "RIGHTDOWN", "LEFTDOWN"],
    ParcelType: ["CUSTOMIZED", "NONE", "LEFT", "UP", "RIGHT", "DOWN", "LEFTUP", "RIGHTUP", "RIGHTDOWN", "LEFTDOWN",
                              "NONE1", "LEFT1", "UP1", "RIGHT1", "DOWN1", "LEFTUP1", "RIGHTUP1", "RIGHTDOWN1", "LEFTDOWN1"],
    TerrainType: ["NONE", "TREE", "GRASS", "FLOWER", "WATER", "GRAVEL", "CONSOLE"],
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
      // primaryKeys: {y: "uint16"},    use singleton
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

    // ----- PC, attacks, class and instance -----
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
        attackIDs: "bytes32[2]" // TODO: change it to dynamic so that new skills can be learned
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

    // ----- commandedBy -----
    CommandedBy: "bytes32",

    // ----- battle related -----
    BattleWith: "bytes32", // attacker -> defender
    SiegedBy: "bytes32",    // parcelHashID -> player

    // ----- BK: reinforcement / loan  -----
    PCLoanOffer: {              // pcID -> PCOfferData
      schema: {
        offerorID: "bytes32",
        offereeID: "bytes32", // could be zero
        duration: "uint256", 
        interestRate: "uint32"
      }
    },
    PCLoanAccept: {             // i.e., PCLoanContract
      schema: {
        offerorID: "bytes32",
        acceptorID: "bytes32", 
        startBlock: "uint256",
        duration: "uint256",
        collateral: "uint256",
        distance: "uint16",
        isInjected: "bool",
      }
    },

    // ----- reinforcement /loan  -----
    OfferEnabled: "bool",        
    PCLoan: {
      schema: {
        debtorID: "bytes32",       // player ID
        startBlock: "uint256",
        duration: "uint256",      //block number
        collateral: "uint256",    // token amount
        interestRate: "uint32",
      }
    },

  },
  modules: [
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("PlayerPosition")],
    },
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("SiegedBy")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PlayerPosition")]
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("SiegedBy")]
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("BattleWith")]
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("CommandedBy")]
    },
  ]
});
