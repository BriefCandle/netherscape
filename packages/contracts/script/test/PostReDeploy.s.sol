// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";

contract PostReDeploy is Script {
  function run() external {
    address worldAddress = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    IWorld world = IWorld(worldAddress);
    vm.startBroadcast(deployerPrivateKey);

    initMapConfig(world);
    // console.log("Init map");

    vm.stopBroadcast();
  }

  function initMapConfig(IWorld world) internal {
    uint8[32][32] memory map = [
    [ 1,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  1],
    [ 1,  4,  2,  4,  2,  4,  2,  4,  9,  5,  1,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  1],
    [ 1,  1,  1,  1,  1,  1,  1,  1,  3,  7,  2,  1,  1,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  4,  2,  4,  2,  1,  1,  4,  2,  1],
    [ 5,  5,  1,  1,  5,  5,  1,  1,  5,  8,  2,  1,  5,  8,  2,  4,  2,  4,  2,  4,  2,  1,  5,  8,  2,  4,  9,  5,  1,  4,  2,  1],
    [ 3,  3,  1,  4,  6,  7,  2,  1,  3,  7,  2,  4,  6,  3,  1,  4,  2,  4,  2,  4,  2,  1,  3,  7,  2,  4,  6,  7,  2,  4,  2,  1],
    [ 5,  5,  5,  8,  2,  4,  9,  5,  1,  4,  2,  4,  9,  5,  1,  4,  2,  4,  2,  4,  9,  5,  5,  8,  2,  4,  2,  4,  2,  4,  2,  1],
    [ 3,  3,  3,  7,  2,  1,  3,  7,  2,  1,  1,  4,  6,  7,  2,  4,  2,  4,  2,  4,  6,  7,  6,  7,  2,  1,  1,  4,  2,  1,  1,  1],
    [ 5,  5,  1,  4,  9,  5,  1,  4,  9,  5,  1,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  9,  5,  1,  4,  9,  5,  1,  1],
    [ 3,  3,  1,  1,  3,  7,  2,  4,  6,  7,  2,  1,  1,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  1,  3,  3,  1,  1,  3,  7,  2,  1],
    [ 5,  5,  1,  1,  1,  4,  2,  4,  2,  4,  2,  1,  1,  4,  2,  4,  2,  4,  2,  4,  9,  5,  5,  5,  5,  5,  5,  5,  1,  4,  2,  1],
    [ 3,  7,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  4,  2,  4,  6,  7,  6,  3,  3,  3,  3,  7,  2,  4,  2,  1],
    [ 1,  4,  9,  8,  2,  4,  2,  4,  2,  4,  9,  8,  2,  4,  9,  5,  1,  4,  2,  4,  2,  4,  9,  5,  5,  5,  1,  4,  2,  4,  2,  1],
    [ 1,  4,  6,  3,  1,  4,  2,  1,  1,  4,  6,  7,  2,  4,  6,  7,  2,  4,  2,  4,  2,  1,  3,  3,  3,  3,  1,  1,  1,  4,  2,  1],
    [ 1,  4,  9,  5,  1,  4,  2,  1,  1,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  9,  5,  5,  5,  5,  5,  1,  1,  1,  4,  2,  1],
    [ 1,  4,  6,  3,  1,  4,  2,  4,  2,  1,  1,  4,  2,  4,  2,  4,  2,  1,  1,  1,  3,  7,  6,  7,  6,  7,  2,  4,  2,  4,  2,  1],
    [ 5,  8,  9,  5,  1,  4,  2,  4,  9,  5,  1,  4,  2,  4,  2,  4,  9,  5,  5,  5,  1,  4,  2,  4,  2,  4,  9,  8,  2,  4,  9,  5],
    [ 3,  3,  3,  3,  1,  4,  2,  4,  6,  7,  2,  1,  1,  1,  1,  4,  6,  3,  3,  7,  2,  1,  1,  1,  1,  1,  3,  3,  1,  4,  6,  3],
    [ 5,  5,  5,  5,  5,  8,  2,  4,  2,  4,  9,  5,  1,  1,  1,  4,  9,  5,  1,  4,  2,  1,  5,  5,  1,  1,  5,  5,  5,  8,  2,  1],
    [ 3,  7,  6,  7,  6,  3,  1,  4,  2,  4,  6,  3,  1,  4,  2,  1,  3,  7,  2,  1,  1,  4,  6,  7,  2,  4,  6,  3,  3,  7,  2,  1],
    [ 1,  4,  2,  4,  9,  5,  1,  4,  2,  4,  9,  5,  5,  8,  2,  1,  1,  4,  9,  5,  1,  4,  2,  4,  2,  4,  9,  5,  1,  4,  2,  1],
    [ 1,  1,  1,  4,  6,  3,  1,  4,  2,  4,  6,  7,  6,  7,  2,  4,  2,  1,  3,  3,  1,  4,  2,  1,  1,  4,  6,  3,  1,  4,  2,  1],
    [ 5,  5,  1,  4,  9,  5,  1,  4,  2,  4,  2,  4,  2,  4,  9,  8,  9,  5,  1,  1,  5,  8,  9,  5,  1,  4,  9,  5,  1,  4,  2,  1],
    [ 3,  7,  2,  1,  3,  7,  2,  1,  1,  4,  2,  4,  2,  4,  6,  3,  3,  3,  1,  1,  3,  7,  6,  7,  2,  4,  6,  3,  1,  4,  2,  1],
    [ 1,  4,  9,  5,  1,  4,  9,  5,  1,  4,  2,  4,  2,  4,  9,  5,  5,  5,  5,  5,  1,  4,  2,  4,  2,  4,  2,  1,  5,  8,  9,  5],
    [ 1,  1,  3,  7,  2,  1,  3,  3,  1,  4,  2,  1,  1,  4,  6,  7,  6,  3,  3,  3,  1,  4,  2,  1,  1,  4,  2,  1,  3,  7,  6,  3],
    [ 1,  1,  1,  4,  9,  5,  5,  5,  1,  4,  9,  5,  1,  4,  2,  4,  9,  5,  1,  1,  5,  8,  9,  5,  5,  8,  9,  5,  1,  4,  2,  1],
    [ 1,  4,  2,  4,  6,  7,  6,  7,  2,  4,  6,  7,  2,  4,  2,  1,  3,  3,  1,  1,  3,  7,  6,  7,  6,  7,  6,  3,  1,  1,  1,  1],
    [ 5,  8,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  1,  5,  5,  5,  5,  5,  8,  2,  4,  2,  4,  9,  5,  1,  1,  5,  5],
    [ 3,  7,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  6,  7,  6,  7,  6,  3,  1,  4,  2,  4,  6,  7,  2,  4,  6,  3],
    [ 1,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  9,  5,  1,  4,  2,  4,  2,  4,  2,  4,  2,  1],
    [ 1,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  4,  2,  4,  6,  7,  2,  4,  2,  4,  2,  4,  2,  1,  1,  1],
    [ 1,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  4,  2,  1,  1,  1]
  ];
  world.netherscape_MapSystem_initMapConfig(map);
  }


}
