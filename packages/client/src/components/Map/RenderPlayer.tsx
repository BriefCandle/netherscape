import ethan_up from "../../assets/player/ethan_up.png";
import ethan_down from "../../assets/player/ethan_down.png";
import ethan_left from "../../assets/player/ethan_left.png";
import ethan_right from "../../assets/player/ethan_right.png";
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

export const RenderPlayer = (props: {parcel_x:number, parcel_y:number, playerPosition: any}) => {
  const {parcel_x, parcel_y, playerPosition} = props;
  console.log(parcel_x, parcel_y, playerPosition)
  const {x, y} = playerPosition;

  const {
    systemCalls: { crawlBy },
  } = useMUD();

  const {activeComponent, setActive, interactCoord, setInteractCoord} = useMapContext();
  const [playerDirection, setPlayerDirection] = useState<PlayerDirection>(PlayerDirection.Up);

  useEffect(() => {
    setActive(ActiveComponent.map);
  },[]);
  
    // ------ key inputs ------
    const press_up = () => {
      setPlayerDirection(PlayerDirection.Up);
      crawlBy(0, -1);}
  
    const press_down = () => {
      setPlayerDirection(PlayerDirection.Down);
      crawlBy(0, 1);}
  
    const press_left = () => {
      setPlayerDirection(PlayerDirection.Left);
      crawlBy(-1, 0);}
  
    const press_right = () => {
      setPlayerDirection(PlayerDirection.Right);
      crawlBy(1, 0);}
    
    const press_a = useCallback(() => {
      if (playerPosition !== undefined && playerDirection !== undefined) {
        const coord = getInteractCoord(playerPosition, playerDirection)
        console.log("coord", coord)
        setInteractCoord(coord)
        setActive(ActiveComponent.terrainConsole)
      }
    },[interactCoord, playerDirection, playerPosition])
  
    
    const press_b = () => {return;}
    const press_start = () => setActive(ActiveComponent.mapMenu);
  
    useKeyboardMovement(activeComponent == ActiveComponent.map, 
      press_up, press_down, press_left, press_right, press_a, press_b, press_start)
    

  return (
  <>
    <div 
      className="flex flex-row flex-wrap justify-center items-center z-10 absolute"
      style={{
        left: terrain_width * parcel_x,
        top: terrain_height * parcel_y,
        width: terrain_width, height: terrain_height,
    }}>
      <img style={{width: '45px', height: "35px"}} src={ethan_down} alt="" />
    </div> 
  </>
  )
}