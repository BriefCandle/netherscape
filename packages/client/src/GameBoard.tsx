import { useComponentValue } from "@latticexyz/react";
import { RenderMap } from "./components/Map/RenderMap";
import { useMUD } from "./MUDContext";
import { OfferList } from "./components/Reinforce/OfferList";
import { MapProvider } from "./utils/MapContext";


export const GameBoard = () => {

  const {
    components: { PlayerPosition, Player },
    network: { playerEntity },
    systemCalls: { spawn, respawn, logout },
  } = useMUD();

  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;

  return (
<<<<<<< HEAD
    <>
     {/* overflow: "hidden", */}
    <div style={{ position: "relative", width: "500px", height: "350px", border: "solid white 1px"}}>
      {/* {canSpawn ? <SpawnPlayer /> : null}
      {!canSpawn && canRespawn? <RespawnPlayer /> : null}
      
      { !canSpawn && !canRespawn && !battleID ? 
        <MapProvider>
          <RenderMap/>
        </MapProvider> : null}
      
      { battleID ?
        <BattleProvider battleID={battleID} playerEntityId={playerEntityId}>
          <RenderBattle /> 
        </BattleProvider>: null} */}
      
      { canSpawn ? <button onClick={spawn} className="text-lg w-full" >Spawn</button> : null}
      
      <RenderMap/>
=======
    <div className="flex flex-row  ">
      {/* overflow: "hidden", */}
      {/* <OfferList /> */}
      <div className="flex flex-col relative h-full w-full border-2 border-white rounded-lg" >
        {/* {canSpawn ? <SpawnPlayer /> : null}
        {!canSpawn && canRespawn? <RespawnPlayer /> : null}
        
        { !canSpawn && !canRespawn && !battleID ? 
          <MapProvider>
            <RenderMap/>
          </MapProvider> : null}
        
        { battleID ?
          <BattleProvider battleID={battleID} playerEntityId={playerEntityId}>
            <RenderBattle /> 
          </BattleProvider>: null} */}

        { canSpawn ? <button className="bg-green-500" onClick={spawn}>Spawn</button> : null}

        <div className="game h-full w-full"> 
        <MapProvider>
          <RenderMap />
        </MapProvider>
        
        </div>

      </div>
      <div className="relative"><OfferList /></div>
>>>>>>> reinforce
    </div>

  )
}