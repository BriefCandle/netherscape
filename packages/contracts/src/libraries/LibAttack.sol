// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { AttackClass } from "../codegen/Tables.sol";
import { AttackClassData } from "../codegen/tables/AttackClass.sol";


library LibAttack {

  // uint16 constant critAdjust = 100;

  function calcDamage(bytes32 attackID, uint16 atk) internal view returns (uint16) {
    AttackClassData memory attackClass = AttackClass.get(attackID);
    bool isCrit = determCrit(attackClass.crit, attackClass.pp);
    uint16 dmg = attackClass.power * atk * getCritBonus(isCrit);
    return dmg;
  }

  function determCrit(uint16 crit, uint256 seed) internal view returns (bool) {
    uint256 rand = uint256(keccak256(abi.encode(crit, seed, block.difficulty)));
    if (uint16(rand % 100) >= crit) return false; 
    else return true;
  }

  function getCritBonus(bool isCrit) internal pure returns (uint16) {
    return isCrit ? 2 : 1;
  }

}