// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { LibUtils } from "../libraries/LibUtils.sol";
import { PCClass, PCInstance, AttackClass } from "../codegen/Tables.sol";
import { PCClassData } from "../codegen/tables/PCClass.sol";
import { AttackClassData } from "../codegen/tables/AttackClass.sol";

contract PCSystem is System { 

  function createNewAttackClass(bytes32 attackClassID, AttackClassData memory attackClassData) public {
    AttackClass.set(attackClassID, attackClassData);
  }

  function createNewPCClass(bytes32 pcClassID, PCClassData memory pcClassData) public {
    PCClass.set(pcClassID, pcClassData);
  }

  // Note: a "special" function only for convenience during hackathon
  function spawnPC(bytes32 PCClassID, bytes32 player) public {} 

  function askToJoin() public {}

  
}