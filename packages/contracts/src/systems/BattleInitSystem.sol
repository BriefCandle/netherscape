// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BattleWith, PCInstance } from "../codegen/Tables.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";

import { LibCommand } from "../libraries/LibCommand.sol";

import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

// this is a subsystem only accessible through CrawlSystem
contract BattleInitSystem is System { 
  
  function battleInit(bytes32 attacker, bytes32 defender) public {
    BattleWith.set(attacker, defender);
    _resetCommandedBlock(attacker);
    _resetCommandedBlock(defender);
  }

  function _resetCommandedBlock(bytes32 player) private {
    bytes32[] memory pcIDs = LibCommand.getPCsByPlayer(player);
    for (uint i = 0; i < pcIDs.length; i++) {
      _resetBlockStarts(pcIDs[i]);
    }
  }

  function _resetBlockStarts(bytes32 pcID) private {
    PCInstance.setBlockStarts(pcID, block.number);
  }
}