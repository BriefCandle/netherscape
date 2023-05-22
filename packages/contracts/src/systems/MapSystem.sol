// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { ParcelTerrain, MapConfig, Obstruction } from "../codegen/Tables.sol";
import { ParcelType, TerrainType } from "../codegen/Types.sol";

import { LibMap } from "../libraries/LibMap.sol";
import { LibUtils } from "../libraries/LibUtils.sol";


struct Coord {
  uint16 x;
  uint16 y;
}

uint16 constant parcel_width = 5; 
uint16 constant parcel_height = 5;

uint16 constant map_width = 32;
uint16 constant map_height = 32;

uint16 constant max_width = parcel_width * map_width;
uint16 constant max_height = parcel_height * map_height;


contract MapSystem is System {
  // TODO: add authorization modifier

  function initMapConfig(uint8[32][32] memory map) public {
    // TODO: require: only called once in PostDeploy
    for (uint16 j; j<map_height; j++) {
      MapConfig.set(LibUtils.numberToEntityKey(j), map[j]);
    }
  }

  function submitParcelTemplate(ParcelType parcelType, bytes memory terrainMap) public {
    bytes32 parcelID = LibMap.parcelTypeToTemplateID(parcelType);
    ParcelTerrain.set(parcelID, terrainMap);
    for (uint16 j=0; j<parcel_height; j++) {
      for (uint16 i=0; i<parcel_width; i++) {
        TerrainType terrainType = TerrainType(uint8(terrainMap[(j * parcel_width) + i]));
        
        if (terrainType == TerrainType.TREE ||
            terrainType == TerrainType.CONSOLE) {
          bytes32 coord_key = LibMap.hashCoord(parcelID, i, j);
          Obstruction.set(coord_key, true);
        }
        // set other terrain type
      }
    }
  }

  // function _updateParcelType(uint16 parcel2map_x, uint16 parcel2map_y, ParcelType parcelType) private {
  //   MapConfig.update(LibUtils.numberToEntityKey(parcel2map_y), parcel2map_x, uint8(parcelType));
  // }

  // function buildConsole(uint16 map_x, uint16 map_y) public {
  //   (uint16 parcel_x, uint16 parcel_y, uint16 parcel2map_x, uint16 parcel2map_y) = LibMap.coordMapToParcel(map_x, map_y);
  //   // TODO: require conditions like player access privilege and token cost
  //   // TODO: require it is an empress node on node map
  //   bytes32 parcelID = LibMap.getParcelID(parcel2map_x, parcel2map_y);
  //   bytes32 coord_key = LibMap.hashCoord(parcelID, parcel_x, parcel_y);
  //   require(!Obstruction.get(coord_key), "Parcel: cannot build console on obstruction");
    
  //   bytes memory terrainMap = ParcelTerrain.get(parcelID);
  //   terrainMap[(parcel_y * parcel_width) + parcel_x] = bytes1(uint8(TerrainType.CONSOLE));
  //   ParcelTerrain.set(parcelID, terrainMap);

  //   _updateParcelType(parcel2map_y, parcel2map_x, ParcelType.CUSTOMIZED);

  //   Obstruction.set(coord_key, true);
  // }


}
