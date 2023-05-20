// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
// import { PlayerPosition, ParcelTerrain, MapConfig, Obstruction, Player, CommandedBy, OfferEnabled, PCLoan } from "../codegen/Tables.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { LibUtils } from "../libraries/LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";
// import { LibBattle } from "../libraries/LibBattle.sol";

import { PCSystem } from "./PCSystem.sol";

// this is a system dedicating for player managing his position on map
contract ReinforceSystem is System {

  // function offer(bytes32 pcInstanceID) public {
  //   require(!OfferEnabled.get(pcInstanceID), "already enabled");

  //   bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));
  //   require(!LibBattle.isPlayerInBattle(player), "player in battle");
  //   require(CommandedBy.get(pcInstanceID) == player, "not your PC!");

  //   OfferEnabled.set(pcInstanceID, true);
  // }

  // function rescind(bytes32 pcInstanceID) public {
  //   require(OfferEnabled.get(pcInstanceID), "not enabled");
    
  //   //OfferEnabled.set(pcInstanceID, false);
  // }




}