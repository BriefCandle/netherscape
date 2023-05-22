// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ParcelType, TerrainType } from "../codegen/Types.sol";

import { PCInstance, CommandedBy, OfferEnabled } from "../codegen/Tables.sol";
import { PCLoan, PCLoanData } from "../codegen/tables/PCLoan.sol";

import { LibUtils } from "./LibUtils.sol";

// BattleWith Table: attacker -> defender
library LibLoan { 

  function hasLoan(bytes32 pcInstanceID) internal view returns (bool) {
    return PCLoan.get(pcInstanceID).debtorID == LibUtils.addressToEntityKey(address(0));
  }

  function isDebtor(bytes32 pcInstanceID, bytes32 player) internal view returns (bool) {
    return PCLoan.get(pcInstanceID).debtorID == player;
  }

  // BK: redundant with LibCommand.getPlayerOfPC(); 
  function getCommandedOwner(bytes32 pcInstanceID) internal view returns (bytes32) {
    return CommandedBy.get(pcInstanceID);
  }

  // BK: redundant with LibCommand.isPCByPlayer(); 
  // also, use command instead of own because a pc is an independant lady ╭(○｀∀´○)╯
  function isPCOwner(bytes32 pcInstanceID, bytes32 player) internal view returns (bool) {
    return CommandedBy.get(pcInstanceID) == player;
  }

  function isLoanExpired(bytes32 pcInstanceID) internal view returns (bool) {
    PCLoanData memory loan = PCLoan.get(pcInstanceID);
    return block.number > loan.duration + loan.startBlock;
  }

  function canInjected(bytes32 pcInstanceID) internal view returns (bool) {
    PCLoanData memory loan = PCLoan.get(pcInstanceID);
    return block.number > 20 + loan.startBlock;
  }
  

}