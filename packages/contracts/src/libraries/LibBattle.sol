// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { BattleWith, BattleWithTableId, SiegedBy, SiegedByTableId, PlayerPosition, ParcelTerrain, MapConfig, Obstruction, Player } from "../codegen/Tables.sol";
import { ParcelType, TerrainType } from "../codegen/Types.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { parcel_width, parcel_height, Coord, map_width, map_height, max_width, max_height } from "../systems/MapSystem.sol";

import { LibUtils } from "./LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";

// BattleWith Table: attacker -> defender
library LibBattle { 
  
  function isPlayerInBattle(bytes32 player) internal view returns (bool) {
    return isPlayerAttacker(player) || isPlayerDefender(player);
  }

  function isPlayerDefender(bytes32 player) internal view returns (bool) {
    bytes32[] memory attackers = getAttackersFromDefender(player);
    return attackers.length != 0;
  }

  function getAttackersFromDefender(bytes32 defender) internal view returns (bytes32[] memory) {
    return getKeysWithValue(BattleWithTableId, BattleWith.encode(defender));
  }

  function isPlayerAttacker(bytes32 player) internal view returns (bool) {
    bytes32 defender = getDefenderFromAttacker(player);
    return defender != LibUtils.numberToEntityKey(0);
  }

  
  function getDefenderFromAttacker(bytes32 attacker) internal view returns (bytes32) {
    return BattleWith.get(attacker);
  }


}