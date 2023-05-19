// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { PlayerPosition, ParcelTerrain, MapConfig, Obstruction, Player } from "../codegen/Tables.sol";

import { LibUtils } from "../libraries/LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";

// this is a system dedicating for player managing his position on map
contract CrawlSystem is System {

  function crawl(uint16 x, uint16 y) public {
    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));

    require(LibMap.hasPlayerPosition(player), "Crawl: player has no position");

    (uint16 from_x, uint16 from_y) = PlayerPosition.get(player);
    require(LibMap.distance(from_x, from_y, x, y) == 1, "Crawl: can only move to adjacent spaces");

    require(!LibMap.isObstruction(x, y), "Crawl: obstructed!");

    // we might allow overlapping players
    require(!LibMap.hasPlayerAtPosition(x, y), "Crawl: has player");

    require(LibMap.isWithinBoundary(x, y), "Crawl: out of boundary");

    PlayerPosition.set(player, x, y);

    // if crawls on sieged parcel

  }

  function spawn() public {
    // require(LibMap.isWithinBoundary(x, y), "Spawn: out of boundary");
    // require(!LibMap.isObstruction(x, y), "Spawn: obstructed!");

    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));
    require(!Player.get(player), "Spawn: player already exists");

    // PlayerPosition.set(player, x, y);
    LibMap.spawnPlayerOn00(player);
    
    Player.set(player, true);
  }

  function respawn() public {
    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));

    require(Player.get(player), "Respawn: player does not exist");
    
    require(!LibMap.hasPlayerPosition(player), "Respawn: player already has position");
    
    LibMap.spawnPlayerOn00(player);
  }

  function logout() public { 
    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));

    require(Player.get(player), "Logout: player does not exist");

    require(LibMap.hasPlayerPosition(player), "Logout: player has no position");

    PlayerPosition.deleteRecord(player);

  }


}