// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { SiegedBy, SiegedByTableId, PlayerPosition, ParcelTerrain, MapConfig, Obstruction, Player } from "../codegen/Tables.sol";
import { ParcelType, TerrainType } from "../codegen/Types.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { parcel_width, parcel_height, Coord, map_width, map_height, max_width, max_height } from "../systems/MapSystem.sol";

import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { LibUtils } from "./LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";


library LibSiege { 

  function isPlayerSiege(bytes32 player) internal view returns (bool) {
    bytes32[] memory parcelIDs = getKeysWithValue(SiegedByTableId, SiegedBy.encode(player));
    return parcelIDs.length != 0;
  }

  function getPlayerFromParcelID(bytes32 parcelID) internal view returns (bytes32 player) {
    player = SiegedBy.get(parcelID);
  }

  function getPlayerFromParcelCoord(uint16 parcel2map_x, uint16 parcel2map_y) internal view returns (bytes32) {
    bytes32 parcelID = LibMap.hashParcelID(parcel2map_x, parcel2map_y);
    return getPlayerFromParcelID(parcelID);
  }

  function getPlayerFromMapCoord(uint16 map_x, uint16 map_y) internal view returns (bytes32) {
    ( , , uint16 parcel2map_x, uint16 parcel2map_y) = LibMap.coordMapToParcel(map_x, map_y);
    return getPlayerFromParcelCoord(parcel2map_x, parcel2map_y);
  }

  function isMapCoordSieged(uint16 map_x, uint16 map_y) internal view returns (bool) {
    bytes32 player = getPlayerFromMapCoord(map_x, map_y);
    return player != LibUtils.numberToEntityKey(0);
  }
}