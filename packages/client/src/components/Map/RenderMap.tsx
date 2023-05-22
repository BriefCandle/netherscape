import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { ethers } from 'ethers';
import { useMUD } from "../../MUDContext";

import ethan_up from "../../assets/player/ethan_up.png";
import ethan_down from "../../assets/player/ethan_down.png";
import ethan_left from "../../assets/player/ethan_left.png";
import ethan_right from "../../assets/player/ethan_right.png";



import { ParcelType, TerrainType, NodeType, parcel_width, parcel_height, map_width, map_height, max_width, max_height, Coord, terrain_width, terrain_height } from "../../constant";

import { RenderParcel } from "./RenderParcel";
import { RenderPlayer, getInteractCoord } from "./RenderPlayer";

import { MapProvider, PlayerDirection, useMapContext } from "../../utils/MapContext";
import { useState, useEffect, useCallback } from "react";
import { ActiveComponent } from "../../utils/useActiveComponent";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { MapMenu } from "../MapMenu/MapMenu";

import { TeamList } from "../Team/TeamList";
import { PCLoanMarket } from "../PCLoan/PCLoanMarket";
import { PCLoanInject } from "../PCLoan/PCLoanInject";

export const RenderMap = () => {

  const {
    components: { MapConfig, ParcelTerrain, Player, PlayerPosition},
    network: { playerEntity },
    systemCalls: { wrapParcel2Map, crawlBy },
  } = useMUD();

  const hasPlayer = playerEntity !== undefined;
  const hasPlayerPosition = hasPlayer ? getComponentValue(PlayerPosition, playerEntity) !== undefined : false
  const playerPosition = useComponentValue(PlayerPosition, playerEntity) // : {x:0, y:0};

  const otherPlayers = useEntityQuery([Has(Player), Has(PlayerPosition)])
    .filter((entity) => entity !== playerEntity)
    .map((entity) => {
      const position = getComponentValueStrict(PlayerPosition, entity);
      return {
        entity,
        position,
      };
  });

  console.log('---- other players ----')
  console.log(otherPlayers)

  

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
  console.log("MapConfig", MapConfig)

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
    const parcelType = map_matrix[wrappedY][wrappedX];
    const parcelID = getParcelID(wrappedX, wrappedY, parcelType);
    const terrainMap = getComponentValue(ParcelTerrain, parcelID as Entity)?.value
    return {terrainMap: terrainMap, coord: {x: wrappedX, y: wrappedY}}
  }))

  console.log("map_screen_terrainMaps", map_screen_terrainMaps)

  const {activeComponent, setActive, interactCoord, setInteractCoord} = useMapContext();
  const [playerDirection, setPlayerDirection] = useState<PlayerDirection>(PlayerDirection.Up);
  const [playerImage,setPlayerImage] = useState(ethan_up);

  useEffect(() => {
    setActive(ActiveComponent.map);
  },[]);
  
    // ------ key inputs ------
    const press_up = () => {
      console.log("test")
      setPlayerDirection(PlayerDirection.Up);
      setPlayerImage(ethan_up);
      crawlBy(0, -1);}
  
    const press_down = () => {
      setPlayerDirection(PlayerDirection.Down);
      setPlayerImage(ethan_down);
      crawlBy(0, 1);}
  
    const press_left = () => {
      setPlayerDirection(PlayerDirection.Left);
      setPlayerImage(ethan_left);
      crawlBy(-1, 0);}
  
    const press_right = () => {
      setPlayerDirection(PlayerDirection.Right);
      setPlayerImage(ethan_right);
      crawlBy(1, 0);}
    
    const press_a = useCallback(() => {
      // if (playerPosition !== undefined && playerDirection !== undefined) {
      //   const coord = getInteractCoord(playerPosition, playerDirection)
      //   console.log("coord", coord)
      //   setInteractCoord(coord)
      //   setActive(ActiveComponent.terrainConsole)
      // }
    },[interactCoord, playerDirection, playerPosition])
  
    
    const press_b = () => {return;}
    const press_start = () => {
      setActive(ActiveComponent.mapMenu)
    };
  
    useKeyboardMovement(activeComponent == ActiveComponent.map, 
      press_up, press_down, press_left, press_right, press_a, press_b, press_start)
    


      
  return (  
        <div className="w-full relative flex flex-col">
          {activeComponent == ActiveComponent.mapMenu ? 
            <MapMenu/> : null}

          {activeComponent == ActiveComponent.team ? <TeamList /> : null}

          {activeComponent == ActiveComponent.pcLoan ? 
            <PCLoanMarket/> : null}
          
          {activeComponent == ActiveComponent.pcLoanInject ? 
            <PCLoanInject/> : null}

          {map_screen_terrainMaps.map((row, rowIndex) => (
            <div key={rowIndex} className="relative flex flex-row">
              {row.map((terrainInfo, columnIndex) => (
                <div key={columnIndex} 
                className="relative flex flex-row">
                  {playerPosition && rowIndex === Math.floor(screen_height / 2) && columnIndex === Math.floor(screen_width / 2) ?
                    <RenderPlayer parcel_x={parcel_x} parcel_y={parcel_y} playerPosition={playerPosition} playerImage={playerImage} />
                    : null}

                  {
                    otherPlayers.map((otherPlayer) => {
                      const {parcel_x, parcel_y, parcel2map_x, parcel2map_y} = coordMapToParcel(otherPlayer.position.x, otherPlayer.position.y);
                      if(parcel2map_x == terrainInfo.coord.x && parcel2map_y == terrainInfo.coord.y)
                        return (<RenderPlayer parcel_x={parcel_x} parcel_y={parcel_y} playerPosition={otherPlayer.position} playerImage={ethan_down}/>)
                      return null;
                    })
                  }

                  <RenderParcel rowIndex={rowIndex} columnIndex={columnIndex} terrainInfo={terrainInfo} />
                </div>
              ))}
            </div>
          ))}
        </div>
  )
}