// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { LibUtils } from "../libraries/LibUtils.sol";
import { PCClass, PCInstance, AttackClass, CommandedBy } from "../codegen/Tables.sol";
import { PCClassData } from "../codegen/tables/PCClass.sol";
import { PCInstanceData } from "../codegen/tables/PCInstance.sol";
import { AttackClassData } from "../codegen/tables/AttackClass.sol";

contract PCSystem is System { 
  
  uint256 nonce = 0; // can use UniqueEntityModule

  function createNewAttackClass(bytes32 attackClassID, AttackClassData memory attackClassData) public {
    AttackClass.set(attackClassID, attackClassData);
  }

  function createNewPCClass(bytes32 pcClassID, PCClassData memory pcClassData) public {
    PCClass.set(pcClassID, pcClassData);
  }

  // Note: a "cheat" function only for convenience during hackathon
  // can be used in script or when spawn new player
  // TODO: later, add access control
  function spawnPC(bytes32 pcClassID, bytes32 player) public {
    PCClassData memory pcClass = PCClass.get(pcClassID);
    bytes32 key = keccak256(abi.encode(player, pcClassID, ++nonce));
    PCInstance.set(key, PCInstanceData(
      pcClassID, pcClass.maxHP, pcClass.atk, pcClass.spd, 
      pcClass.maxPP, pcClass.maxHP, 0, pcClass.attackIDs));
    CommandedBy.set(key, player);
  } 

  function askToJoin() public {}

  
}