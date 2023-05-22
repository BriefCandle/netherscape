// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ParcelTemplate, ParcelType } from "./ParcelTemplate.s.sol";

// forge script script/parcelTemplate/ParcelTemplateNone.s.sol:ParcelTemplateNone --rpc-url http://localhost:8545 --broadcast

contract ParcelTemplateUp1 is ParcelTemplate {

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    parcelType = ParcelType.UP1;

    map = [
      [W, W, W, W, T],
      [W, W, F, R, T],
      [F, W, G, R, T],
      [G, G, G, R, R],
      [F, G, T, T, R]
    ];

    bytes memory terrainMap = convertTerrainArrayToBytes();

    submitParcelTemplate(terrainMap);

    vm.stopBroadcast();
  }
}