// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { AttackType } from "../../src/codegen/Types.sol";
import { AttackClassData } from "../../src/codegen/tables/AttackClass.sol";

import { LibUtils } from "../../src/libraries/LibUtils.sol";

// forge script --rpc-url http://localhost:8545 --broadcast script/cheat/SpawnPCToPlayer.s.sol:SpawnPCToPlayer 

// don't do it during battle
contract SpawnPCToPlayer is Script {
  
  address worldAddress = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
  IWorld world = IWorld(worldAddress);  

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    uint32 pcClassID = 0;
    address player = 0xA51CC76D84C606534Ce2C4Bcd98F659c7d432CE4;

    spawnPCToPlayer(pcClassID, player);

    vm.stopBroadcast();
  }

  function spawnPCToPlayer(uint32 pcClassID, address player) public {
    bytes32 pcClassID_bytes = LibUtils.numberToEntityKey(pcClassID);
    bytes32 player_bytes = LibUtils.addressToEntityKey(player);
    world.netherscape_PCSystem_spawnPC(pcClassID_bytes, player_bytes);
  }
}