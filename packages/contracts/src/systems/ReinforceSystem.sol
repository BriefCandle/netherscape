// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { PCSystem } from "./PCSystem.sol";
import { Player, CommandedBy, OfferEnabled } from "../codegen/Tables.sol";
import { PCLoan, PCLoanData } from "../codegen/tables/PCLoan.sol";

import { LibUtils } from "../libraries/LibUtils.sol";
import { LibBattle } from "../libraries/LibBattle.sol";
import { LibLoan } from "../libraries/LibLoan.sol";

contract ReinforceSystem is System {

    //temporary const, will be removed
    uint256 public constant Duration = 1000;
    uint256 public constant BaseCollateral = 1000 * 10 ** 18;   // 1000 $RED
    uint32 public constant InterestRate = 200;              // 200 / 10000 = 2%
    uint256 public constant BlockPerDay = 200;

    // should delete in prod
    function mockOffer(bytes32 pcInstanceID) public {
        
        OfferEnabled.set(pcInstanceID, true);
    }

    function offer(bytes32 pcInstanceID) public {
        require(!OfferEnabled.get(pcInstanceID), "already enabled");

        bytes32 player = LibUtils.addressToEntityKey(address(_msgSender()));
        require(!LibBattle.isPlayerInBattle(player), "player in battle");
        require(LibLoan.isPCOwner(pcInstanceID, player), "not your PC!");

        OfferEnabled.set(pcInstanceID, true);
        // price set?

    }

    function rescind(bytes32 pcInstanceID) public {
        require(OfferEnabled.get(pcInstanceID), "not enabled");
        require(LibLoan.hasLoan(pcInstanceID), "still have loan");

        OfferEnabled.set(pcInstanceID, false);
    }


    function accept(bytes32 pcInstanceID, uint256 duration) public {
        require(OfferEnabled.get(pcInstanceID), "not enabled");
        require(LibLoan.hasLoan(pcInstanceID), "already have loan");
        // acceptor need have less than 4 pcs
        // require(LibPC.getPCCount(debtor) < 4, "not enough pcs");

        bytes32 debtor = LibUtils.addressToEntityKey(address(_msgSender()));
        // acceptor need have less than 4 pcs
        // require(LibPC.getPCCount(debtor) < 4, "not enough pcs");

        // transfer in Collateral, ceil
        uint256 interestDay = (duration + BlockPerDay - 1) / BlockPerDay;
        uint256 collateral = BaseCollateral * ( 10000 + InterestRate * interestDay ) / 10000;         // linear or compound
        collateral = collateral * 110 / 100;    // 10% penalty

        // LibLoan.transfer(pcInstanceID, collateral);


        PCLoanData memory loan = PCLoanData(debtor, block.number, duration, collateral, InterestRate);
        PCLoan.set(pcInstanceID, loan);

    }
    

    // is this necessary ?
    // BK: yes, because offeree needs to call inject to obtain pc's commanding rights
    function inject(bytes32 pcInstanceID) public {
        require(LibLoan.canInjected(pcInstanceID), "not yet reached");
    }




    function liquidate(bytes32 pcInstanceID) public {

        require(LibLoan.isLoanExpired(pcInstanceID), "not yet expired");

        PCLoanData memory loan = PCLoan.get(pcInstanceID);

        //transfer collateral and bonus?

        PCLoan.deleteRecord(pcInstanceID);

        // auto disable offer?
        // OfferEnabled.set(pcInstanceID, false);
    }




}