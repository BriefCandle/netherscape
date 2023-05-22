// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { CommandedBy, BattleWith, PlayerPosition, SiegedBy, SiegedByTableId } from "../codegen/Tables.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { LibUtils } from "../libraries/LibUtils.sol";
import { LibMap } from "../libraries/LibMap.sol";
import { LibSiege } from "../libraries/LibSiege.sol";
import { LibCommand } from "../libraries/LibCommand.sol";
import { LibAttack } from "../libraries/LibAttack.sol";
import { LibPCInstance } from "../libraries/LibPCInstance.sol";
import { LibBattle } from "../libraries/LibBattle.sol";

import { AttackClass, PCInstance } from "../codegen/Tables.sol";

contract BattleSystem is System { 

  function attack(bytes32 attacker_pcID, bytes32 target_pcID, bytes32 attackID) public {
    bytes32 playerA = LibUtils.addressToEntityKey(address(_msgSender()));
    bytes32 playerB = LibCommand.getPlayerOfPC(target_pcID);

    require(LibCommand.isPCByPlayer(playerA, attacker_pcID), "Attack: player does not command");

    require(LibBattle.isPlayersInBattle(playerA, playerB), "Attack: not in battle together");

    require(LibPCInstance.isAttackIDFromPC(attackID, attacker_pcID), "Attack: pc has no such attack");

    require(LibPCInstance.getCurrentPP(attacker_pcID) >= AttackClass.getPp(attacker_pcID), "Attack: pc has not enough pp");

    // TODO?: attack type, such as paralysis

    // reset attacker's PP/blockStarts
    uint16 pp_attack = AttackClass.getPp(attackID);
    uint256 newBlockStarts = LibPCInstance.getNewBlockStarts(attacker_pcID, pp_attack);
    PCInstance.setBlockStarts(attacker_pcID, newBlockStarts); 

    // reset target's HP
    uint16 targetHP = PCInstance.getCurrentHP(target_pcID);
    uint16 attackerAtk = PCInstance.getAtk(attacker_pcID);
    uint16 dmg = LibAttack.calcDamage(attackID, attackerAtk);
    uint16 targetHP_now = dmg >= targetHP ? 0 : (targetHP - dmg);
    PCInstance.setCurrentHP(target_pcID, targetHP_now);

    if (targetHP_now == 0) {
      _handleFaint(playerB, target_pcID);

      if (LibCommand.getPCsByPlayer(playerB).length == 0) {
        _handleDefeat(playerB);
      }
    }
  }

  // fainted PC is no longer commanded, better luck getting her back lolol
  function _handleFaint(bytes32 player, bytes32 pcID) private {
    CommandedBy.deleteRecord(pcID);
  }

  function _handleDefeat(bytes32 player) private {
    // if attacker, delete(defeated) player as key
    if (LibBattle.isPlayerAttacker(player)) BattleWith.deleteRecord(player);
    
    // if defender, multiple delete
    bytes32[] memory attackers = LibBattle.getAttackersFromDefender(player);
    if (attackers.length != 0) {
      for (uint i = 0; i < attackers.length; i++) {
        BattleWith.deleteRecord(attackers[i]);
      }
    }
    
    // unsiege any siege
    bytes32[] memory parcelIDs = getKeysWithValue(SiegedByTableId, SiegedBy.encode(player));
    if (parcelIDs.length != 0) SiegedBy.deleteRecord(parcelIDs[0]);
    
    // TODO?: penalty?
    PlayerPosition.deleteRecord(player);
  }
}