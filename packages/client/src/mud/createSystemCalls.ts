import { Entity, getComponentValue } from "@latticexyz/recs";
import { Has, HasValue, runQuery } from "@latticexyz/recs";
import { uuid, awaitStreamValue, hexToArray } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { max_width, max_height, map_height, map_width, parcel_width, parcel_height, TerrainType } from "../constant";

import { ethers, utils } from "ethers";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { singletonEntity, playerEntity, worldSend, txReduced$ }: SetupNetworkResult,
  { PlayerPosition, Player, MapConfig, ParcelTerrain, Obstruction }: ClientComponents
) {

  const addressToBytes32 = (address: string) => {
    return ethers.utils.hexZeroPad(ethers.utils.hexlify(address), 32);
  }

  const bytes32ToInteger = (bytes32: string): string => {
    const bigNumber = ethers.BigNumber.from(bytes32);
    const paddedNumberString = ethers.utils.hexZeroPad(bigNumber.toHexString(), 1);
    return paddedNumberString
  }

  // comply with LibMap.distance
  const wrapPosition = (x: number, y: number) => {
    const wrappedX = x < 0 ? max_width - 1: (x > max_width - 1 ? 0 : x);
    const wrappedY = y < 0 ? max_height - 1 : (y > max_height - 1 ? 0: y);
    return [wrappedX, wrappedY]
  }

  const wrapParcel2Map = (x: number, y: number) => {
    const wrappedX = x < 0 ? map_width - 1: (x > map_width - 1 ? 0 : x);
    const wrappedY = y < 0 ? map_height - 1 : (y > map_height - 1 ? 0: y);
    return [wrappedX, wrappedY]
  }

  // TODO: do it according to LibMap.isObstruction()
  const isObstructed = (x: number, y: number) => {

    const map_matrix = [...MapConfig.values.parcelTypes.entries()].map(v=>v[1]);
    const parcel2map_x = Math.floor(x / parcel_width);
    const parcel2map_y = Math.floor(y / parcel_height);
    const parcel_x = x % parcel_width;
    const parcel_y = y % parcel_height;
    // const bytes32Value = `0x${map_matrix[parcel2map_y][parcel2map_x].toString(16).padStart(2, '0')}`;
    // const terrainMap = getComponentValue(ParcelTerrain, bytes32Value as Entity)?.value

    // const terrainValues: number[][] = Array.from({ length: parcel_width }, () =>
    // Array.from({ length: parcel_height }, () => 0)
    // );
    // Array.from(hexToArray(terrainMap as string)).forEach((value, index) => {
    //   const x = index % parcel_width;
    //   const y = Math.floor(index / parcel_width);
    //   terrainValues[y][x] = value
    // });

    // return terrainValues[parcel_y][parcel_x] as TerrainType == TerrainType.TREE;
    

    //大概是需要HasValue联合查询出位置的entityId然后才能找到Obstruction的记录，由于没有记录Position所以不行？
    //runQuery([Has(Obstruction), HasValue(Position, { x, y })]).size > 0;


    //需要自己拼entityId
    const obEntity = `0x${map_matrix[parcel2map_y][parcel2map_x].toString(16).padStart(64, '0')}${parcel_x.toString(16).padStart(64, '0')}${parcel_y.toString(16).padStart(64, '0')}`;
    const ob = getComponentValue(Obstruction, utils.keccak256(obEntity) as Entity)?.value
    return ob;

  };

  const crawlTo = async (x: number, y: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const [wrappedX, wrappedY] = wrapPosition(x, y);
    if (isObstructed(wrappedX, wrappedY)) {
      console.warn("cannot move to obstructed space");
      return;
    }

    // const inEncounter = !!getComponentValue(Encounter, playerEntity);
    // if (inEncounter) {
    //   console.warn("cannot move while in encounter");
    //   return;
    // }

    const positionId = uuid();
    PlayerPosition.addOverride(positionId, {
      entity: playerEntity,
      value: { x: wrappedX, y: wrappedY },
    });

    try {
      const tx = await worldSend("netherscape_CrawlSystem_crawl", [wrappedX, wrappedY]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      PlayerPosition.removeOverride(positionId);
    }
  };

  const crawlBy = async (deltaX: number, deltaY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const playerPosition = getComponentValue(PlayerPosition, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }

    await crawlTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };
  
  const spawn = async() => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const canSpawn = getComponentValue(Player, playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }

    try {
      const tx = await worldSend("netherscape_CrawlSystem_spawn", []);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      console.log("spawn succesffully")
    }
  
  }

  const siege = async() => {
    try {
      const tx = await worldSend("netherscape_SiegeSystem_siege", []);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      console.log("siege successfully");
    }
  }

  const unsiege = async() => {
    try {
      const tx = await worldSend("netherscape_SiegeSystem_unsiege", []);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      console.log("unsiege successfully");
    }
  }

  const logout = async() => {
    try {
      const tx = await worldSend("netherscape_CrawlSystem_logout", []);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      console.log("logout successfully");
    }
  }

  const attack = async(attacker_pcID: string, target_pcID: string, attackID: string) => {
    try {
      const tx = await worldSend("netherscape_BattleSystem_attack", [attacker_pcID, target_pcID, attackID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      console.log("attack successfully");
    }
  }


  const applyOffer = async (entityId: string, duration: number) => {
    try {
      const tx = await worldSend("netherscape_ReinforceSystem_accept", [entityId, duration]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      console.log("apply successfully");
    }
  }


  return {
    spawn,
    crawlBy,
    wrapParcel2Map,
    siege,
    unsiege,
    logout,
    attack,
    addressToBytes32,
    bytes32ToInteger,
    applyOffer
  };
}
