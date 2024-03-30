#!/bin/sh

npx hardhat run scripts/deploy.js --network topos
npx hardhat run scripts/initialize.js --network topos