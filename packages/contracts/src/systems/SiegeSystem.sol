// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { SiegedBy, SiegedByTableId, PlayerPosition, ParcelTerrain, MapConfig, Obstruction, Player } from "../codegen/Tables.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { LibUtils } from "../libraries/LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";
import { LibSiege } from "../libraries/LibSiege.sol";
import { LibBattle }from "../libraries/LibBattle.sol";

import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";


contract SiegeSystem is System { 

  function siege() public {
    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));

    require(!LibSiege.isPlayerSiege(player), "Siege: player has already siege");

    require(!LibBattle.isPlayerInBattle(player), "Siege: player is in battle");

    bytes32 parcelID = LibMap.getPlayerParcelID(player);

    require(!LibSiege.isParcelSieged(parcelID), "Siege: parcel is sieged");

    // TODO: add other requires
    
    SiegedBy.set(parcelID, player);
  }

  function unsiege() public {
    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));
    
    bytes32[] memory parcelIDs = getKeysWithValue(SiegedByTableId, SiegedBy.encode(player));
    require(parcelIDs.length != 0, "Unsiege: player has no siege");

    SiegedBy.deleteRecord(parcelIDs[0]);
  }
}