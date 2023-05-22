// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { AttackType } from "../../src/codegen/Types.sol";
import { AttackClassData } from "../../src/codegen/tables/AttackClass.sol";

import { LibUtils } from "../../src/libraries/LibUtils.sol";

contract CreateNewAttackClass is Script {
  
  address worldAddress = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
  IWorld world = IWorld(worldAddress);  

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    uint32 attackID = 0;
    createNewAttackClass(attackID, AttackClassData(10, 3, 20, AttackType.NORMAL, "shoot"));
    //   uint16 power, uint16 pp, uint16 crit, AttackType attackType; string className, 

    createNewAttackClass(1, AttackClassData(15, 6, 40, AttackType.NORMAL, "cut open"));

    createNewAttackClass(2, AttackClassData( 20, 5, 5, AttackType.NORMAL, "strike"));

    createNewAttackClass(3, AttackClassData(40, 15, 40, AttackType.NORMAL, "refashion"));

    createNewAttackClass(4, AttackClassData(5, 7, 0, AttackType.PARALYSIS, "paralysis")); 

    vm.stopBroadcast();
  }

  function createNewAttackClass(uint32 attackID, AttackClassData memory attackClassData ) public {
    bytes32 key = LibUtils.numberToEntityKey(attackID);
    world.netherscape_PCSystem_createNewAttackClass(key, attackClassData);
  }
}