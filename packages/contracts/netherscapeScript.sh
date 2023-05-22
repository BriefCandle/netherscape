#!/bin/bash

echo "submit ParcelTemplateNone"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateNone.s.sol:ParcelTemplateNone 

echo "submit ParcelTemplateDown"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateDown.s.sol:ParcelTemplateDown 

echo "submit ParcelTemplateLeft"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateLeft.s.sol:ParcelTemplateLeft 

echo "submit ParcelTemplateLeftDown"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateLeftDown.s.sol:ParcelTemplateLeftDown 

echo "submit ParcelTemplateLeftUp"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateLeftUp.s.sol:ParcelTemplateLeftUp 

echo "submit ParcelTemplateRight"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateRight.s.sol:ParcelTemplateRight

echo "submit ParcelTemplateRightDown"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateRightDown.s.sol:ParcelTemplateRightDown

echo "submit ParcelTemplateRightUp"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateRightUp.s.sol:ParcelTemplateRightUp

echo "submit ParcelTemplateUp"
forge script --rpc-url http://localhost:8545 --broadcast script/parcelTemplate/ParcelTemplateUp.s.sol:ParcelTemplateUp

echo "create CreateNewAttackClass"
forge script --rpc-url http://localhost:8545 --broadcast script/pc/CreateNewAttackClass.s.sol:CreateNewAttackClass 

echo "create CreateNewPCClass"
forge script --rpc-url http://localhost:8545 --broadcast script/pc/CreateNewPCClass.s.sol:CreateNewPCClass 

echo "redeploy PostDeploy"
forge script --rpc-url http://localhost:8545 --broadcast script/test/PostReDeploy.s.sol:PostReDeploy