// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ParcelTemplate, ParcelType } from "./ParcelTemplate.s.sol";

// forge script script/parcelTemplate/ParcelTemplateNone.s.sol:ParcelTemplateNone --rpc-url http://localhost:8545 --broadcast

contract ParcelTemplateLeftDown is ParcelTemplate {

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    parcelType = ParcelType.LEFTDOWN;

    map = [
      [T, G, G, G, G],
      [T, G, F, F, F],
      [T, G, G, F, G],
      [T, G, G, F, G],
      [T, T, T, T, T]
    ];

    bytes memory terrainMap = convertTerrainArrayToBytes();

    submitParcelTemplate(terrainMap);

    vm.stopBroadcast();
  }
}