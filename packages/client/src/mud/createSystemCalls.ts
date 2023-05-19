import { Entity, getComponentValue } from "@latticexyz/recs";
import { Has, HasValue, runQuery } from "@latticexyz/recs";
import { uuid, awaitStreamValue, hexToArray } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { max_width, max_height, map_height, map_width, parcel_width, parcel_height, TerrainType } from "../constant";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { singletonEntity, playerEntity, worldSend, txReduced$ }: SetupNetworkResult,
  { PlayerPosition, Player, MapConfig, ParcelTerrain }: ClientComponents
) {

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
    const bytes32Value = `0x${map_matrix[parcel2map_y][parcel2map_x].toString(16).padStart(2, '0')}`;
    const terrainMap = getComponentValue(ParcelTerrain, bytes32Value as Entity)?.value

    const terrainValues: number[][] = Array.from({ length: parcel_width }, () =>
    Array.from({ length: parcel_height }, () => 0)
    );
    Array.from(hexToArray(terrainMap as string)).forEach((value, index) => {
      const x = index % parcel_width;
      const y = Math.floor(index / parcel_width);
      terrainValues[y][x] = value
    });

    // const obKey = bytes32Value;
    // const ob = getComponentValue(Obstruction, obKey as Entity)?.value
    
    return terrainValues[parcel_y][parcel_x] as TerrainType == TerrainType.TREE;
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

  return {
    spawn,
    crawlBy,
    wrapParcel2Map
  };
}
