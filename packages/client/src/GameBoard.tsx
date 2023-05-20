import { useComponentValue } from "@latticexyz/react";
import { RenderMap } from "./components/Map/RenderMap";
import { useMUD } from "./MUDContext";

export const GameBoard = () => {

  const {
    components: { PlayerPosition, Player },
    network: { playerEntity },
    systemCalls: { spawn, respawn, logout },
  } = useMUD();

  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;

  return (
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
    </div>
    <style>
      {`
        .player-console {
          height: 100px;
          position: absolute;
          width: 100%;
          bottom: 0;
          background-color: white;
          color: black;
          display: flex;
          justify-content: space-between;
          z-index: 10;
          border: 4px solid #585858;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        }
      `}
    </style>
    </>

  )
}