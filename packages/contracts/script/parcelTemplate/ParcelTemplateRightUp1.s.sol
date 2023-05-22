// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ParcelTemplate, ParcelType } from "./ParcelTemplate.s.sol";

// forge script script/parcelTemplate/ParcelTemplateNone.s.sol:ParcelTemplateNone --rpc-url http://localhost:8545 --broadcast

contract ParcelTemplateRightUp1 is ParcelTemplate {

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    parcelType = ParcelType.RIGHTUP1;

    map = [
      [W, W, W, W, W],
      [R, R, R, G, W],
      [T, T, R, F, W],
      [T, F, R, F, W],
      [R, R, R, R, W]
    ];

    bytes memory terrainMap = convertTerrainArrayToBytes();

    submitParcelTemplate(terrainMap);

    vm.stopBroadcast();
  }
}