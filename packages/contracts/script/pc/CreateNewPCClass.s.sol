// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { PCClassData } from "../../src/codegen/tables/PCClass.sol";

import { LibUtils } from "../../src/libraries/LibUtils.sol";

contract CreateNewPCClass is Script {
  
  address worldAddress = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
  IWorld world = IWorld(worldAddress);  

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    uint32 pcClassID = 0;
    createNewPCClass(pcClassID, PCClassData(350, 5,	10,	20,	[LibUtils.numberToEntityKey(0), LibUtils.numberToEntityKey(3)], "Mario"));
    // uint16 maxHP; uint16 atk; uint16 spd; uint16 maxPP; uint32[2] attackIDs; string className; 

    createNewPCClass(1, PCClassData(220, 6,	15,	15,	[LibUtils.numberToEntityKey(0), LibUtils.numberToEntityKey(2)], "Luigi"));

    createNewPCClass(2, PCClassData(200,	5,	20,	13,	[LibUtils.numberToEntityKey(1), LibUtils.numberToEntityKey(4)], "Princess Peach"));

    createNewPCClass(3, PCClassData(300,	6,	10,	15,	[LibUtils.numberToEntityKey(1), LibUtils.numberToEntityKey(3)], "Toad"));

    createNewPCClass(4, PCClassData(220,	7,	10,	13,	[LibUtils.numberToEntityKey(2), LibUtils.numberToEntityKey(4)], "Yoshi")); 

    vm.stopBroadcast();
  }

  function createNewPCClass(uint32 pcID, PCClassData memory pcClassData ) public {
    bytes32 key = LibUtils.numberToEntityKey(pcID);
    world.netherscape_PCSystem_createNewPCClass(key, pcClassData);
  }
}