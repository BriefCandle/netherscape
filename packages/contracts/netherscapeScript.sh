#!/bin/bash

echo "submit ParcelTemplateNone"
forge script script/parcelTemplate/ParcelTemplateNone.s.sol:ParcelTemplateNone --rpc-url http://localhost:8545 --broadcast

echo "submit ParcelTemplateDown"
forge script script/parcelTemplate/ParcelTemplateDown.s.sol:ParcelTemplateDown --rpc-url http://localhost:8545 --broadcast

echo "submit ParcelTemplateLeft"
forge script script/parcelTemplate/ParcelTemplateLeft.s.sol:ParcelTemplateLeft --rpc-url http://localhost:8545 --broadcast

echo "submit ParcelTemplateLeftDown"
forge script script/parcelTemplate/ParcelTemplateLeftDown.s.sol:ParcelTemplateLeftDown --rpc-url http://localhost:8545 --broadcast

echo "submit ParcelTemplateLeftUp"
forge script script/parcelTemplate/ParcelTemplateLeftUp.s.sol:ParcelTemplateLeftUp --rpc-url http://localhost:8545 --broadcast

echo "submit ParcelTemplateRight"
forge script script/parcelTemplate/ParcelTemplateRight.s.sol:ParcelTemplateRight --rpc-url http://localhost:8545 --broadcast

echo "submit ParcelTemplateRightDown"
forge script script/parcelTemplate/ParcelTemplateRightDown.s.sol:ParcelTemplateRightDown --rpc-url http://localhost:8545 --broadcast

echo "submit ParcelTemplateRightUp"
forge script script/parcelTemplate/ParcelTemplateRightUp.s.sol:ParcelTemplateRightUp --rpc-url http://localhost:8545 --broadcast

echo "submit ParcelTemplateUp"
forge script script/parcelTemplate/ParcelTemplateUp.s.sol:ParcelTemplateUp --rpc-url http://localhost:8545 --broadcast

echo "create CreateNewAttackClass"
forge script script/pc/CreateNewAttackClass.s.sol:CreateNewAttackClass --rpc-url http://localhost:8545 --broadcast

echo "create CreateNewPCClass"
forge script script/pc/CreateNewPCClass.s.sol:CreateNewPCClass --rpc-url http://localhost:8545 --broadcast

