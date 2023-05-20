import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { ethers } from 'ethers';
import { useMUD } from "../../MUDContext";
import { ParcelType, TerrainType, NodeType, parcel_width, parcel_height, map_width, map_height, max_width, max_height, Coord, terrain_width, terrain_height } from "../../constant";

import { RenderParcel } from "./RenderParcel";
import { RenderPlayer } from "./RenderPlayer";
import { MapProvider } from "../../utils/MapContext";

export const RenderMap = () => {

  const {
    components: { MapConfig, ParcelTerrain, PlayerPosition},
    network: { playerEntity },
    systemCalls: { wrapParcel2Map },
  } = useMUD();

  const hasPlayer = playerEntity !== undefined;
  const hasPlayerPosition = hasPlayer ? getComponentValue(PlayerPosition, playerEntity) !== undefined : false
  const playerPosition = useComponentValue(PlayerPosition, playerEntity) // : {x:0, y:0};

  // --------- get player's coord on map: 1 absolute coord -> 2 x relative ---------
  const coordMapToParcel = (map_x: number, map_y: number) => {
    const parcel2map_x = Math.floor(map_x / parcel_width);
    const parcel2map_y = Math.floor(map_y / parcel_height);
    const parcel_x = map_x % parcel_width;
    const parcel_y = map_y % parcel_height;
    return {parcel_x, parcel_y, parcel2map_x, parcel2map_y}
  }

  const {parcel_x, parcel_y, parcel2map_x, parcel2map_y} = playerPosition ? coordMapToParcel(playerPosition.x, playerPosition.y) : coordMapToParcel(0,0);

  // --------- get map's original parcel matrix ---------
  const parcelTypes = MapConfig.values.parcelTypes.values();

  const convertMapIteratorToArray = (mapIterator: IterableIterator<number[]>) => {
    const matrix = [];
    for (const array of mapIterator) {
      matrix.push([...array]);
    }
    return matrix;
  }

  const map_matrix = convertMapIteratorToArray(parcelTypes);
  console.log("map_matrix", map_matrix)

  // --------- get a smaller map based on player's parcel coord ---------
  const loopMap = (parcel2map_coord: Coord) => {
    const x = parcel2map_coord.x >= 0 ? parcel2map_coord.x : map_width + parcel2map_coord.x
    const y = parcel2map_coord.y >= 0 ? parcel2map_coord.y : map_height + parcel2map_coord.y
    return {x: x, y: y}
  }

  const map_screen: Coord[][] = [];
  const screen_width = 5;
  const screen_height = 3;
  for (let j = 0; j < screen_height; j++) {
    map_screen[j] = [];
    for (let i = 0; i< screen_width; i++) {
      map_screen[j][i] = loopMap({x: parcel2map_x - Math.floor(screen_width/2) + i, y: parcel2map_y - Math.floor(screen_height/2) + j})
    }
  }
  console.log("map_screen", map_screen)

  // --------- get terrainMap for map_screen ---------
  const getParcelID = (parcel2map_x: number, parcel2map_y: number, parcelType: number) => {
    // need to pad it because we do bytes32(uint256(parcelType)); on enum
    // TODO: account for CUSTOMIZED; change it to hexToArray
    const bytes32Value = `0x${parcelType.toString(16).padStart(2, '0')}`;
    return bytes32Value
  }

  const integerToBytes32 = (number: number) => {
    return `0x${number.toString(16).padStart(2, '0')}`;
  }

  const map_screen_terrainMaps = map_screen.map(row => row.map((coord)=>{
    const [wrappedX, wrappedY] = wrapParcel2Map(coord.x, coord.y);
    console.log(wrappedX, wrappedY)
    const parcelType = map_matrix[wrappedY][wrappedX];
    const parcelID = getParcelID(wrappedX, wrappedY, parcelType);
    const terrainMap = getComponentValue(ParcelTerrain, parcelID as Entity)?.value
    return {terrainMap: terrainMap, coord: {x: wrappedX, y: wrappedY}}
  }))

  console.log("map_screen_terrainMaps", map_screen_terrainMaps)

  return (
  <>
  <div>
    {
      <div>
        {map_screen_terrainMaps.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((terrainInfo, columnIndex) => (
              <div key={columnIndex} style={{
                position: 'relative', 
                left: columnIndex * parcel_width* terrain_width, 
                top: rowIndex * parcel_height * terrain_height
              }}>
                { playerPosition && rowIndex === Math.floor(screen_height/2) && columnIndex === Math.floor(screen_width/2) ? 
                <MapProvider>
                  <RenderPlayer parcel_x={parcel_x} parcel_y={parcel_y} playerPosition={playerPosition}/>
                </MapProvider>
                 : null}

                <RenderParcel rowIndex={rowIndex} columnIndex={columnIndex} terrainInfo={terrainInfo}/>
              </div>
            ))}
          </div>
        ))}
      </div>
    }
  </div>
  <style>
  {`
  .parcel {
    position: 'relative', 
    left: columnIndex * parcel_width* terrain_width, 
    top: rowIndex * parcel_height * terrain_height
  }
  `}
  </style>
  </>
  )
}