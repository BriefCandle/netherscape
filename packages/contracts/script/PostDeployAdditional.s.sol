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

import { ParcelTemplateDown1 } from "./ParcelTemplate/ParcelTemplateDown1.s.sol";
import { ParcelTemplateLeft1 } from "./ParcelTemplate/ParcelTemplateLeft1.s.sol";
import { ParcelTemplateRight1 } from "./ParcelTemplate/ParcelTemplateRight1.s.sol";
import { ParcelTemplateUp1 } from "./ParcelTemplate/ParcelTemplateUp1.s.sol";
import { ParcelTemplateNone1 } from "./ParcelTemplate/ParcelTemplateNone1.s.sol";
import { ParcelTemplateLeftDown1 } from "./ParcelTemplate/ParcelTemplateLeftDown1.s.sol";
import { ParcelTemplateLeftUp1 } from "./ParcelTemplate/ParcelTemplateLeftUp1.s.sol";
import { ParcelTemplateRightUp1 } from "./ParcelTemplate/ParcelTemplateRightUp1.s.sol";
import { ParcelTemplateRightDown1 } from "./ParcelTemplate/ParcelTemplateRightDown1.s.sol";

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

    new ParcelTemplateDown1().run();
    new ParcelTemplateLeft1().run();
    new ParcelTemplateRight1().run();
    new ParcelTemplateUp1().run();
    new ParcelTemplateNone1().run();
    new ParcelTemplateLeftDown1().run();
    new ParcelTemplateLeftUp1().run();
    new ParcelTemplateRightUp1().run();
    new ParcelTemplateRightDown1().run();

    new CreateNewPCClass().run();
    new CreateNewAttackClass().run();

    new MockOffer(worldAddress).run();

  }

}
