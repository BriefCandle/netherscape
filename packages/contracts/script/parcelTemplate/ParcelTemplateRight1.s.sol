// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ParcelTemplate, ParcelType } from "./ParcelTemplate.s.sol";

// forge script script/parcelTemplate/ParcelTemplateNone.s.sol:ParcelTemplateNone --rpc-url http://localhost:8545 --broadcast

contract ParcelTemplateRight1 is ParcelTemplate {

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    parcelType = ParcelType.RIGHT1;

    map = [
      [G, F, G, F, W],
      [G, T, T, F, W],
      [G, F, T, T, W],
      [W, F, G, T, W],
      [W, G, G, G, W]
    ];

    bytes memory terrainMap = convertTerrainArrayToBytes();

    submitParcelTemplate(terrainMap);

    vm.stopBroadcast();
  }
}