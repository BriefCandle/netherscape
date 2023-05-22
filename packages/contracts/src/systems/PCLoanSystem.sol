// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { PCSystem } from "./PCSystem.sol";
import { Player, CommandedBy, OfferEnabled } from "../codegen/Tables.sol";
import { PCLoanOffer, PCLoanOfferData } from "../codegen/tables/PCLoanOffer.sol";
import { PCLoanAccept, PCLoanAcceptData } from "../codegen/tables/PCLoanAccept.sol";

import { LibUtils } from "../libraries/LibUtils.sol";
import { LibCommand } from "../libraries/LibCommand.sol";
import { LibBattle } from "../libraries/LibBattle.sol";
import { LibPCLoan } from "../libraries/LibPCLoan.sol";

// PC loan is a loan of PC's commanding rights
contract PCLoanSystem is System {

  // only the current commander (not in battle) can bestow PCLoanSystem the right to loan out commanding rights
  function offer(bytes32 pcID, bytes32 offereeID, uint256 duration, uint32 interestRate) public {
    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));
    require(player == LibCommand.getPlayerOfPC(pcID), "Offer: player not commander");

    require(!LibBattle.isPlayerInBattle(player), "Offer: player is in a battle");

    CommandedBy.deleteRecord(pcID);

    PCLoanOffer.set(pcID, PCLoanOfferData(player, offereeID, duration, interestRate));
  }

  // player gets back pc's commanding rights
  function rescind(bytes32 pcID) public {
    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));
    require(player == PCLoanOffer.getOffereeID(pcID), "Rescind: player not offeror");

    // this technically allows player to "reinforce" himself
    require(!LibBattle.isPlayerInBattle(player), "Rescind: player is in a battle");

    PCLoanOffer.deleteRecord(pcID);
    
    CommandedBy.set(pcID, player);
  }


  function accept(bytes32 pcID) public {
    PCLoanOfferData memory pcLoanOffer = PCLoanOffer.get(pcID);
    require(pcLoanOffer.offerorID != LibUtils.addressToEntityKey(address(0)), "Accept: offer not exist");
    
    bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));
    if (pcLoanOffer.offereeID != LibUtils.addressToEntityKey(address(0))) {
      require(player == pcLoanOffer.offereeID, "Accept: player is not supposed to accept");
    }

    uint256 collateral = LibPCLoan.calcCollateral(pcID);
    // TODO: require player pays collateral (=+ 10% bonus) to an address of "PCLoanSystem"

    uint256 interestFee = LibPCLoan.calcInterestFee(collateral, pcLoanOffer.duration);
    // TODO: require player pays interest fee to pcLoanOffer.offeror

    uint16 distance = LibPCLoan.getDistanceBetwenPlayers(player, pcLoanOffer.offerorID);

    PCLoanOffer.deleteRecord(pcID);
    
    PCLoanAccept.set(pcID, PCLoanAcceptData(
      pcLoanOffer.offerorID,
      player,
      block.number,
      pcLoanOffer.duration,
      collateral,
      distance,
      false  
    ));
  }

  function inject(bytes32 pcID) public {
    PCLoanAcceptData memory pcLoanAccept = PCLoanAccept.get(pcID);

    require(pcLoanAccept.isInjected == false, "Inject: pc has been injected");

    // note: anyone may inject pc for player??
    // bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));
    // require(player == pcLoanAccept.acceptorID, "Inject: player is not acceptor");

    require(LibPCLoan.isPCArrived(pcLoanAccept.startBlock, pcLoanAccept.distance, block.number), "Inject: pc has not arrived");

    PCLoanAccept.setIsInjected(pcID, true);

    CommandedBy.set(pcID, pcLoanAccept.acceptorID);
  }

  // anyone may call to: 1) return pc to offeror, 2) calculate deducted collateral, 3) transfer bonus
  function terminate(bytes32 pcID) public {
    PCLoanAcceptData memory pcLoanAccept = PCLoanAccept.get(pcID);

    if (pcLoanAccept.acceptorID != LibCommand.getPlayerOfPC(pcID)) {
      inject(pcID);
    }

    require(pcLoanAccept.startBlock + pcLoanAccept.duration > block.number, "Terminate: loan not due yet");
    // TODO: implement grace period where only acceptor can call to get bonus back

    // TODO: calculate amount of collateral and bonus; and send them to different parties
    
    PCLoanAccept.deleteRecord(pcID);

    CommandedBy.set(pcID, pcLoanAccept.offerorID); // it DOES matter if pc is injected?
  }


}