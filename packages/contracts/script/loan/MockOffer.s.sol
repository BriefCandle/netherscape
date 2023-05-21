// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { PCLoan, PCLoanData } from "../../src/codegen/tables/PCLoan.sol";
import { PCInstance, PCInstanceData } from "../../src/codegen/tables/PCInstance.sol";

import { LibUtils } from "../../src/libraries/LibUtils.sol";

contract MockOffer is Script {

  IWorld world;  
  
  constructor(address worldAddress) {
    world = IWorld(worldAddress);
  }
  
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    world.netherscape_ReinforceSystem_mockOffer( spawnPC(1, address(1)) );
    world.netherscape_ReinforceSystem_mockOffer( spawnPC(3, address(4)) );
    world.netherscape_ReinforceSystem_mockOffer( spawnPC(4, address(3)) );
    world.netherscape_ReinforceSystem_mockOffer( spawnPC(2, address(111)) );
    world.netherscape_ReinforceSystem_mockOffer( spawnPC(4, address(0x23145673B2e6Ede673CcB3B506aC070137448CAf)) );

    
    vm.stopBroadcast();
  }

  function spawnPC(uint32 pcID, address player) public returns (bytes32) {
    bytes32 pcClassID = LibUtils.numberToEntityKey(pcID);
    return world.netherscape_PCSystem_spawnPC(pcClassID, LibUtils.addressToEntityKey(player));
  } 
}