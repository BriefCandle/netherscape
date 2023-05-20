import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { ethers } from 'ethers';
import { useMUD } from "../../MUDContext";
import { ParcelType, TerrainType, NodeType, parcel_width, parcel_height, map_width, map_height, max_width, max_height, Coord, terrain_width, terrain_height } from "../../constant";

export const OfferList = () => {

  const {
    components: { MapConfig, ParcelTerrain, PlayerPosition},
    network: { playerEntity },
    systemCalls: { wrapParcel2Map },
  } = useMUD();

  const hasPlayer = playerEntity !== undefined;
  const hasPlayerPosition = hasPlayer ? getComponentValue(PlayerPosition, playerEntity) !== undefined : false
  const playerPosition = useComponentValue(PlayerPosition, playerEntity) // : {x:0, y:0};

 
  return (
  <>
    <div className="flex flex-col justify-center items-center rounded-xl bg-gray-200 h-full p-2">
      <div className="text-lg font-bold"> 123 </div>
      <div className="text-lg font-bold"> 123 </div>
      <div className="text-lg font-bold"> 123 </div>
      <div className="text-lg font-bold"> 123 </div>
    </div>
  </>
  )
}