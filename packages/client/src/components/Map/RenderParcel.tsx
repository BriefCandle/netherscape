import { ParcelType, TerrainType, NodeType, parcel_width, parcel_height, map_width, map_height, max_width, max_height, Coord, terrain_width, terrain_height } from "../../constant";
import { hexToArray } from "@latticexyz/utils";
import { RenderTerrain } from "./RenderTerrain";
import { useMUD } from "../../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { ethers } from 'ethers';
import { Entity, getComponentValue } from "@latticexyz/recs";


export const RenderParcel = (props: {rowIndex: number, columnIndex: number, terrainInfo: any}) => {
  const { terrainInfo } = props; 

  const {
    components: { SiegedBy }
  } = useMUD();
  
  const { terrainMap, coord } = terrainInfo;

  const encodedData = ethers.utils.defaultAbiCoder.encode(['uint16', 'uint16'], [coord.x, coord.y]);
  const hash = ethers.utils.keccak256(encodedData);
  const isSieged = useComponentValue(SiegedBy, hash as Entity)?.value !== undefined;

  // const terrainValues = Array.from(hexToArray(terrainMap as string)).map((value, index) => ({
  //   x: index % parcel_width,
  //   y: Math.floor(index / parcel_width),
  //   value,
  //   // type: value in TerrainType ? terrainTypes[value as TerrainType] : null,
  // }));

  const terrainValues: number[][] = Array.from({ length: parcel_width }, () =>
    Array.from({ length: parcel_height }, () => 0)
  );
  Array.from(hexToArray(terrainMap as string)).forEach((value, index) => {
    const x = index % parcel_width;
    const y = Math.floor(index / parcel_width);
    terrainValues[y][x] = value
  });

  return (
  <>
  <div>
    { isSieged ?     
      <div className="absolute z-30 bg-red-600 opacity-50" style={{
        width: terrain_width * parcel_width,
        height: terrain_height * parcel_height,
      }}></div> : null}

    {terrainValues.map((row, rowIndex) => (
      <div key={rowIndex} className="w-auto h-auto flex flex-row">
        {row.map((terrainValue, columnIndex) => (
          <div key={columnIndex} 
            className="relative flex flew-col"
            style={{
              width: terrain_width, height: terrain_height,}}
            >
            <RenderTerrain rowIndex={rowIndex} columnIndex={columnIndex} terrainValue={terrainValue}/>
          </div>
        ))}
      </div>
    ))}
  </div>
  </>
  )
}