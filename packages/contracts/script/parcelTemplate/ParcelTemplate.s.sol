// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { ParcelType, TerrainType } from "../../src/codegen/Types.sol";
import { parcel_width, parcel_height, MapSystem } from "../../src/systems/MapSystem.sol";
import { LibMap } from "../../src/libraries/LibMap.sol";


contract ParcelTemplate is Script {

  address worldAddress = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
  IWorld world = IWorld(worldAddress);  

  ParcelType parcelType;

  TerrainType N = TerrainType.NONE;
  TerrainType T = TerrainType.TREE;
  TerrainType G = TerrainType.GRASS;
  TerrainType F = TerrainType.FLOWER;
  TerrainType C = TerrainType.CONSOLE;

  TerrainType[parcel_height][parcel_width] map;

  function convertTerrainArrayToBytes() internal view returns( bytes memory terrain) {
    terrain = new bytes(parcel_width * parcel_height);
    for (uint32 j=0; j<parcel_height; j++) {
      for (uint32 i=0; i<parcel_width; i++) {
        TerrainType terrainType = map[j][i];
        terrain[(j * parcel_width) + i] = bytes1(uint8(terrainType));
      }
    }
  }

  function submitParcelTemplate(bytes memory terrainMap) public {
    world.netherscape_MapSystem_submitParcelTemplate(parcelType, terrainMap);
  }
}