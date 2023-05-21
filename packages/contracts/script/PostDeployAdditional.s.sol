// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

import { ParcelTemplateDown } from "./ParcelTemplate/ParcelTemplateDown.s.sol";
import { ParcelTemplateLeft } from "./ParcelTemplate/ParcelTemplateLeft.s.sol";
import { ParcelTemplateRight } from "./ParcelTemplate/ParcelTemplateRight.s.sol";
import { ParcelTemplateUp } from "./ParcelTemplate/ParcelTemplateUp.s.sol";
import { ParcelTemplateNone } from "./ParcelTemplate/ParcelTemplateNone.s.sol";
import { ParcelTemplateLeftDown } from "./ParcelTemplate/ParcelTemplateLeftDown.s.sol";
import { ParcelTemplateLeftUp } from "./ParcelTemplate/ParcelTemplateLeftUp.s.sol";
import { ParcelTemplateRightUp } from "./ParcelTemplate/ParcelTemplateRightUp.s.sol";
import { ParcelTemplateRightDown } from "./ParcelTemplate/ParcelTemplateRightDown.s.sol";

import { CreateNewPCClass } from "./pc/CreateNewPCClass.s.sol";
import { CreateNewAttackClass } from "./pc/CreateNewAttackClass.s.sol";

import { MockOffer } from "./loan/MockOffer.s.sol";

contract PostDeployAdditional is Script {
  function run(address worldAddress) external {
    IWorld world = IWorld(worldAddress);
    
    new ParcelTemplateDown().run();
    new ParcelTemplateLeft().run();
    new ParcelTemplateRight().run();
    new ParcelTemplateUp().run();
    new ParcelTemplateNone().run();
    new ParcelTemplateLeftDown().run();
    new ParcelTemplateLeftUp().run();
    new ParcelTemplateRightUp().run();
    new ParcelTemplateRightDown().run();

    new CreateNewPCClass().run();
    new CreateNewAttackClass().run();

    new MockOffer(worldAddress).run();

  }

}
