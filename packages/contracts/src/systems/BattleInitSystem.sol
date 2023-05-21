// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BattleWith, SiegedBy, SiegedByTableId, PlayerPosition, ParcelTerrain, MapConfig, Obstruction, Player } from "../codegen/Tables.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { LibUtils } from "../libraries/LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";
import { LibSiege } from "../libraries/LibSiege.sol";

import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

// this is a subsystem only accessible through CrawlSystem
contract BattleInitSystem is System { 
  
  function battleInit(bytes32 attacker, bytes32 defender) public {
    BattleWith.set(attacker, defender);
  }
}