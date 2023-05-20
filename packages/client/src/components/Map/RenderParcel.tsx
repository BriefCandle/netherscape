import { ParcelType, TerrainType, NodeType, parcel_width, parcel_height, map_width, map_height, max_width, max_height, Coord, terrain_width, terrain_height } from "../../constant";
import { hexToArray } from "@latticexyz/utils";
import { RenderTerrain } from "./RenderTerrain";

export const RenderParcel = (props: {rowIndex: number, columnIndex: number, terrainMap: string | undefined}) => {
  const { terrainMap } = props; 

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
  <div >
    {terrainValues.map((row, rowIndex) => (
      <div key={rowIndex} className="w-auto h-auto flex flex-row">
        {row.map((terrainValue, columnIndex) => (
          <div key={columnIndex} 
            className="relative flex flew-col"
            style={{

              width: terrain_width, height: terrain_height,
          }}>
            <RenderTerrain rowIndex={rowIndex} columnIndex={columnIndex} terrainValue={terrainValue}/>
          </div>
        ))}
      </div>
    ))}
  </div>
  )
}