import { useComponentValue } from "@latticexyz/react";
import { RenderMap } from "./components/Map/RenderMap";
import { useMUD } from "./MUDContext";
import { OfferList } from "./components/Reinforce/OfferList";


export const GameBoard = () => {

  const {
    components: { PlayerPosition, Player },
    network: { playerEntity },
    systemCalls: { spawn },
  } = useMUD();

  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;

  return (
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

        <div className="game h-full w-full"> <RenderMap /></div>

      </div>
      <div className="relative"><OfferList /></div>
    </div>

  )
}