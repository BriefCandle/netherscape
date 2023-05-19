import { getComponentValue } from "@latticexyz/recs";
import { uuid, awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { max_width, max_height } from "../constant";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { singletonEntity, playerEntity, worldSend, txReduced$ }: SetupNetworkResult,
  { PlayerPosition, Player }: ClientComponents
) {

  // comply with LibMap.distance
  const wrapPosition = (x: number, y: number) => {
    const wrappedX = x < 0 ? max_width - 1: (x > max_width - 1 ? 0 : x);
    const wrappedY = y < 0 ? max_height - 1 : (y > max_height - 1 ? 0: y);
    return [wrappedX, wrappedY]
  }

  // TODO: get it according to LibMap.isObstruction()
  const isObstructed = (x: number, y: number) => {
    return false;
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
      const tx = await worldSend("netherscape_CrawlSystem_crawl", [x, y]);
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
    crawlBy
  };
}
