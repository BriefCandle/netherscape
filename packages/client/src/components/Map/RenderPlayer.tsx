
import { terrain_width, terrain_height } from "../../constant";
import { PlayerDirection, useMapContext } from "../../utils/MapContext";
import { useCallback, useEffect, useState } from "react";
import { useMUD } from "../../MUDContext";
import { ActiveComponent } from "../../utils/useActiveComponent";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { MapMenu } from "../MapMenu/MapMenu";

export const getInteractCoord = (coord: {x: number, y: number}, direction: PlayerDirection):{x: number, y: number} => {
  switch (direction) {
    case PlayerDirection.Up:
      return {x: coord.x, y: coord.y-1};
    case PlayerDirection.Down:
      return {x: coord.x, y: coord.y+1};
    case PlayerDirection.Left:
        return {x: coord.x-1, y: coord.y};
    case PlayerDirection.Right:
      return {x: coord.x+1, y: coord.y};
    default:
      return {x: coord.x, y: coord.y};
  }
}




export const RenderPlayer = (props: {parcel_x:number, parcel_y:number, playerPosition: any,playerImage:any}) => {
  const {parcel_x, parcel_y, playerPosition, playerImage} = props;
  console.log(parcel_x, parcel_y, playerPosition)
  const {x, y} = playerPosition;

 

 

  return (
  <>
    { activeComponent == ActiveComponent.mapMenu ? <MapMenu /> : null}
    <div 
      className="flex flex-row flex-wrap justify-center items-center z-10 absolute"
      style={{
        left: terrain_width * parcel_x,
        top: terrain_height * parcel_y,
        width: terrain_width, height: terrain_height,
    }}>
      <img style={{width: '45px', height: "35px"}} src={playerImage} alt="" />
    </div> 
  </>
  )
}