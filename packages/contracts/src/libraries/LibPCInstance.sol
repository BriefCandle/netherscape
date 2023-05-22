// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { PCInstance } from "../codegen/Tables.sol";
import { PCInstanceData } from "../codegen/tables/PCInstance.sol";
import { ParcelType, TerrainType } from "../codegen/Types.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { parcel_width, parcel_height, Coord, map_width, map_height, max_width, max_height } from "../systems/MapSystem.sol";

import { LibUtils } from "./LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";

// BattleWith Table: attacker -> defender
library LibPCInstance { 

  uint16 constant spdAdjust = 10;

  function getPCAttackIDs(bytes32 pcID) internal view returns (bytes32[2] memory) {
    return PCInstance.getAttackIDs(pcID);
  }

  function isAttackIDFromPC(bytes32 attackID, bytes32 pcID) internal view returns (bool) {
    return isValueInArray(attackID, getPCAttackIDs(pcID));
  }

  function getCurrentPP(bytes32 pcID) internal view returns (uint16) {
    PCInstanceData memory pcInstance = PCInstance.get(pcID);
    uint256 blocks = block.number - pcInstance.blockStarts;
    uint16 current_pp = convertBlocksToPP(blocks, pcInstance.spd, pcInstance.maxPP);
    return current_pp;
  }

  // to determine the current pp level of a PC
  function convertBlocksToPP(uint256 blocks, uint16 spd, uint16 maxPP) internal pure returns (uint16) {
    uint256 pp_accum = spd * blocks / spdAdjust;
    uint16 current_pp = pp_accum >= maxPP ? maxPP: uint16(pp_accum);
    return current_pp;
  }

  // from currentPP
  function getNewBlockStarts(bytes32 pcID, uint16 ppConsumed) internal view returns (uint256) {
    uint16 ppRemained = getCurrentPP(pcID) - ppConsumed;
    uint16 spd = PCInstance.getSpd(pcID);
    uint256 blockRemained = convertPPToBlocks(ppRemained, spd);
    return block.number - blockRemained;
  }

  // to determine blocks left for the remaining pp
  function convertPPToBlocks(uint16 pp_attack, uint16 spd) internal pure returns (uint256) {
    uint256 blocks = pp_attack * spdAdjust / spd;
    return blocks;
  }

  function isPCFainted(bytes32 pcID) internal view returns (bool) {
    return PCInstance.getCurrentHP(pcID) == 0;
  }

  function isValueInArray(bytes32 value, bytes32[2] memory array) internal pure returns (bool) {
    for (uint256 i = 0; i < array.length; i++) {
      if (array[i] == value) {
        return true;
      }
    }
    return false;
  }


}