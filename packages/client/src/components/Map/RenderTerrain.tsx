import flower from "../../assets/tiles/flower.gif"
import grass_rustle00 from "../../assets/tiles/grass_rustle00.png"
import grass_rustle10 from "../../assets/tiles/grass_rustle10.png"
import grass_tall from "../../assets/tiles/grass_tall.png";
import grass from "../../assets/tiles/grass.png";
import gravel from "../../assets/tiles/gravel.png";
import level_check from "../../assets/tiles/level_check.png";
import path from "../../assets/tiles/path.png";
import pc00 from "../../assets/tiles/pc00.png";
import pc01 from "../../assets/tiles/pc01.png";
import pc10 from "../../assets/tiles/pc10.png";
import pc11 from "../../assets/tiles/pc11.png";
import tree_short00 from "../../assets/tiles/tree_short00.png";
import tree_short01 from "../../assets/tiles/tree_short01.png";
import tree_short10 from "../../assets/tiles/tree_short10.png";
import tree_short11 from "../../assets/tiles/tree_short11.png";
import water from "../../assets/tiles/water.gif";
import none from "../../assets/tiles/none.png";

import {  terrain_width, terrain_height, TerrainType, terrainTypes } from "../../constant";


export const images = {flower, grass_rustle00, grass_rustle10, grass_tall, grass, gravel, path, 
  pc00, pc01, pc10, pc11, level_check, tree_short00,
  tree_short01, tree_short10, tree_short11, water, none}

export const RenderTerrain = (props: {rowIndex: number, columnIndex: number, terrainValue: number}) => {
  const {terrainValue} = props
  const rows = new Array(2).fill(null);
  const columns = new Array(2).fill(null);

  const tiles = rows.map((y, rowIndex) =>
    columns.map((x, columnIndex) => {
      const tile_type = "tile" + columnIndex.toString() + rowIndex.toString()
      const tile_prop = terrainTypes[terrainValue as TerrainType][tile_type]
      const imageSrc = images[tile_prop]

      return (
        <img key={`${columnIndex},${rowIndex}`}
        src={imageSrc}  
        // style={{gridColumn: x + 1, gridRow: y + 1, width:terrainWidth/2, grid:"none"}}
        style={{position: 'relative', left: terrain_width/2*x, top: terrain_width/2*y,
        width: terrain_width/2, height: terrain_width/2,
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', }}
        /> 
      )}
    )
  )

  return (
    <div
        style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', }}
    >
      {tiles}
    </div>
  )
  return (
  <>
  </>
  )
}