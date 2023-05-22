// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ParcelType, TerrainType } from "../codegen/Types.sol";

import { PCInstance, CommandedBy, PlayerPosition } from "../codegen/Tables.sol";
import { PCLoanOffer, PCLoanOfferData } from "../codegen/tables/PCLoanOffer.sol";
import { PCLoanAccept, PCLoanAcceptData } from "../codegen/tables/PCLoanAccept.sol";

import { LibUtils } from "./LibUtils.sol";
import { LibBattle } from "./LibBattle.sol";
import { LibPCInstance } from "./LibPCInstance.sol";
import { LibCommand } from "./LibCommand.sol";
import { LibMap } from "./LibMap.sol";


// BattleWith Table: attacker -> defender
library LibPCLoan { 

  uint256 constant speed = 10;
  uint256 constant speedAdjust = 10;

  function isPCLoanOffered(bytes32 pcID) internal view returns (bool) {
    return PCLoanOffer.getOfferorID(pcID) != LibUtils.addressToEntityKey(address(0));
  }

  function isPCLoanAccepted(bytes32 pcID) internal view returns (bool) {
    return PCLoanAccept.getAcceptorID(pcID) != LibUtils.addressToEntityKey(address(0));
  }

  // BK: collateral is calculated when offer is accepted
  function calcCollateral(bytes32 pcID) internal view returns (uint256) {
    uint16 currentHP = PCInstance.getCurrentHP(pcID);
    uint256 collateral = 0;
    // TODO: collateral = $RED required to restore HP from 0 + cost to respawn from faint; and 10% bonus on top
    return collateral;   
  }

  function collateralToBonus(uint256 collateral) internal pure returns (uint256) {
    return collateral * 10 /100;
  }

  function calcInterestFee(uint256 collateral, uint256 duration) internal pure returns (uint256) {
    uint256 interestFee = collateral * duration * 10 / 100;
    return interestFee;
  }

  function getDistanceBetwenPlayers(bytes32 playerA, bytes32 playerB) internal view returns (uint16) {
    (uint16 playerA_x, uint16 playerA_y) = PlayerPosition.get(playerA);
    (uint16 playerB_x, uint16 playerB_y) = PlayerPosition.get(playerB);
    return LibMap.distance(playerA_x, playerA_y, playerB_x, playerB_y);
  }

  // can pc be injected
  function isPCArrived(uint256 startBlock, uint16 distance, uint256 currentBlock) internal pure returns (bool) {
    return (currentBlock - startBlock) * speed / speedAdjust >= distance;
  }

  // BK: valid when pcID not in battle && pcID not fainted && is being offered
  // NOT GOOD: it means player cannot go in battle, 
  // once pc's commanding rights enter into custody (offered), offer is ALWAYS VALID
  // function isOfferValid(bytes32 pcID) internal view returns (bool) {
  //   bytes32 player = LibCommand.getPlayerOfPC(pcID);
  //   return 
  //     !LibBattle.isPlayerInBattle(player) && 
  //     !LibPCInstance.isPCFainted(pcID) &&
  //     isPCOffered(pcID);
  // }
  

}