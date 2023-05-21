// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { MapConfig, ParcelTerrain, PlayerPosition, PlayerPositionTableId, Obstruction } from "../codegen/Tables.sol";
import { ParcelType, TerrainType } from "../codegen/Types.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { parcel_width, parcel_height, Coord, map_width, map_height, max_width, max_height } from "../systems/MapSystem.sol";
import { hasKey } from "@latticexyz/world/src/modules/keysintable/hasKey.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { LibUtils } from "./LibUtils.sol";

library LibMap { 

  // // parcel coord to parcel template ID
  // function packCoord(uint16 x, uint16 y) internal pure returns (bytes32) {
  //   uint256 packed = uint256(x) << 128 | uint256(y);
  //   return bytes32(packed);
  // }

  // // parcel template ID to parcel coord
  // function unpackCoord(bytes32 packed) internal pure returns (uint16 x, uint16 y) {
  //   uint256 packedUint = uint256(packed);
  //   x = uint16(packedUint >> 128);
  //   y = uint16(packedUint);
  // }

  // mainly to lodge obstruction
  function hashCoord(bytes32 parcelID, uint16 parcel_x, uint16 parcel_y) internal pure returns (bytes32 hashValue) {
    bytes memory data = abi.encode(parcelID, parcel_x, parcel_y);
    hashValue = keccak256(data);
  }

  // -------------- parcel2map coord -> terrainMap | parcelID | parcel type --------------

  // parcel2map coord -> parcel's terrainMap
  function getParcelTerrain(uint16 parcel2map_x, uint16 parcel2map_y) internal view returns (bytes memory) {
    return parcelIDToTerrain(getParcelID(parcel2map_x, parcel2map_y));
  }

  // parcel2map coord -> parcel ID
  // note: parcelID is its parcel type if NOT CUSTOMIZED; otherwise, it is its parcel2map coord hash
  function getParcelID(uint16 parcel2map_x, uint16 parcel2map_y) internal view returns (bytes32) {
    ParcelType parcelType = getParcelType(parcel2map_x, parcel2map_y);
    if (parcelType == ParcelType.CUSTOMIZED) return hashParcelID(parcel2map_x, parcel2map_y);
    else return parcelTypeToTemplateID(parcelType);
  }

  // parcel2map coord -> parcel type
  function getParcelType(uint16 parcel2map_x, uint16 parcel2map_y) internal view returns (ParcelType) {
    return ParcelType(MapConfig.get(LibUtils.numberToEntityKey(parcel2map_y))[parcel2map_x]);
  }

  function hashParcelID(uint16 parcel2map_x, uint16 parcel2map_y) internal pure returns (bytes32) {
    return keccak256(abi.encode(parcel2map_x, parcel2map_y));
  }

  function parcelIDToTerrain(bytes32 parcelID) internal view returns (bytes memory) {
    return ParcelTerrain.get(parcelID);
  }

  function parcelTypeToTemplateID(ParcelType parcelType) internal pure returns (bytes32) {
    // require parcelType != CUSTOMIZED
    return bytes32(uint256(parcelType)); // or bytes32(uint256(abi.encodePacked(parcelType)));?
  }

  // function getParcelTypeHash(uint8 number) internal pure returns (bytes32) {
  //   // require(number <= uint8(ParcelType.LEFTDOWN), "Invalid ParcelType number");
  //   ParcelType parcelType = ParcelType(number);
  //   return keccak256(abi.encodePacked(parcelType));
  // }




  function coordParcelToMap(uint16 parcel_x, uint16 parcel_y, uint16 parcel2map_x, uint16 parcel2map_y) view internal returns (uint16 map_x, uint16 map_y) { }

  function coordMapToParcel(
    uint16 map_x, uint16 map_y
  ) pure internal returns (uint16 parcel_x, uint16 parcel_y, uint16 parcel2map_x, uint16 parcel2map_y) {
    parcel2map_x = map_x / parcel_width;
    parcel_x = (map_x + parcel_width) % parcel_width;
    parcel2map_y = map_y / parcel_height;
    parcel_y = (map_y + parcel_height) % parcel_height;
  }

  function isObstruction(uint16 map_x, uint16 map_y) internal view returns (bool) {
    (uint16 parcel_x, uint16 parcel_y, uint16 parcel2map_x, uint16 parcel2map_y) = coordMapToParcel(map_x, map_y);
    bytes32 parcelID = getParcelID(parcel2map_x, parcel2map_y);
    bytes32 coord_key = LibMap.hashCoord(parcelID, parcel_x, parcel_y);
    return Obstruction.get(coord_key);
  }

  function getTerrainType(uint16 map_x, uint16 map_y) internal view returns (TerrainType terrainType) {
    (uint16 parcel_x, uint16 parcel_y, uint16 parcel2map_x, uint16 parcel2map_y) = coordMapToParcel(map_x, map_y);
    bytes memory terrainMap = getParcelTerrain(parcel2map_x, parcel2map_y);
    terrainType = TerrainType(uint8(terrainMap[(parcel_y * parcel_width) + parcel_x]));
  }

  // TODO: change to querry 
  function getPlayersAtPosition(uint16 map_x, uint16 map_y) internal view returns (bytes32[] memory keysAtPosition) {
    keysAtPosition = getKeysWithValue(PlayerPositionTableId, PlayerPosition.encode(map_x, map_y));
  }

  // player ->  parcel2map coord
  function getPlayerParcelCoord(bytes32 player) internal view returns (uint16 parcel2map_x, uint16 parcel2map_y) {
    (uint16 map_x, uint16 map_y) = PlayerPosition.get(player);
    ( , , parcel2map_x, parcel2map_y) = coordMapToParcel(map_x, map_y);
  }

  // player -> parcel2map coord -> parcelID
  function getPlayerParcelID(bytes32 player) internal view returns (bytes32 parcelID) {
    (uint16 parcel2map_x, uint16 parcel2map_y) = getPlayerParcelCoord(player);
    parcelID = hashParcelID(parcel2map_x, parcel2map_y);
  }


  function distance(uint16 from_x, uint16 from_y, uint16 to_x, uint16 to_y) internal pure returns (uint16) {
    uint16 deltaX = from_x > to_x ? from_x - to_x : to_x - from_x;
    uint16 deltaY = from_y > to_y ? from_y - to_y : to_y - from_y;
    if (deltaX == max_width - 1) deltaX = 1; // works when combined with isWithinBoundary
    if (deltaY == max_height - 1) deltaY = 1;
    return deltaX + deltaY;
  }

  function isWithinBoundary(uint16 to_x, uint16 to_y) internal pure returns (bool) {
    return to_x < max_width && to_y < max_height;
  }

  function hasPlayerPosition(bytes32 player) internal view returns (bool) {
    bytes32[] memory keyTuple = new bytes32[](1);
    keyTuple[0] = player;
    return hasKey(PlayerPositionTableId, keyTuple);
  }

  function hasPlayerAtPosition(uint16 x, uint16 y) internal view returns (bool) {
    bytes32[] memory players = getKeysWithValue(PlayerPositionTableId, PlayerPosition.encode(x,y));
    return players.length > 0 ? true : false;
  }

  function spawnPlayerOn00(bytes32 player) internal {
    for (uint16 j=0; j<parcel_height; j++) {
      for (uint16 i=0; i<parcel_width; i++) {
        if (!isObstruction(i, j)) {
          PlayerPosition.set(player, i, j);
          return;
        }
      }
    }
    revert("No place to spawn on 00");
  }

}