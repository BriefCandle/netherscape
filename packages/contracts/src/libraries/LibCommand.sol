// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { CommandedBy, CommandedByTableId} from "../codegen/Tables.sol";
import { ParcelType, TerrainType } from "../codegen/Types.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { parcel_width, parcel_height, Coord, map_width, map_height, max_width, max_height } from "../systems/MapSystem.sol";

import { LibUtils } from "./LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";

// CommandedBy Table: pcID -> player
library LibCommand { 

  function getPCsByPlayer(bytes32 player) internal view returns (bytes32[] memory) {
    return getKeysWithValue(CommandedByTableId, CommandedBy.encode(player));
  }

  function isPCByPlayer(bytes32 player, bytes32 pcID) internal view returns (bool) {
    return player == getPlayerOfPC(pcID);
  }

  function getPlayerOfPC(bytes32 pcID) internal view returns (bytes32) {
    return CommandedBy.get(pcID);
  }
}