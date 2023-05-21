import { useComponentValue } from "@latticexyz/react";
import { RenderMap } from "./components/Map/RenderMap";
import { useMUD } from "./MUDContext";
import { OfferList } from "./components/Reinforce/OfferList";
import { MapProvider } from "./utils/MapContext";
import { Entity, HasValue, runQuery } from "@latticexyz/recs";
import { RenderBattle } from "./components/Battle/RenderBattle";
import { BattleProvider } from "./utils/BattleContext";


export const GameBoard = () => {

  const {
    components: { PlayerPosition, Player, BattleWith },
    network: { playerEntity },
    systemCalls: { spawn, addressToBytes32 },
  } = useMUD();


  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;
  const isAttacker = useComponentValue(BattleWith, playerEntity)?.value !== undefined;
  const isDefender = runQuery([HasValue(BattleWith, {value: addressToBytes32(playerEntity as string)})]) .size !== 0
  console.log("isAttacker", isAttacker)
  console.log("isDefender", isDefender)


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
          </MapProvider> : null} */}
        


        { canSpawn ? <button className="bg-green-500" onClick={spawn}>Spawn</button> : null}

        <div className="game h-full w-full"> 

        { isAttacker || isDefender ?
          <BattleProvider >
            <RenderBattle /> 
          </BattleProvider>: null} 

        { !(isAttacker || isDefender) ?
        <MapProvider>
          <RenderMap />
        </MapProvider>: null}
        
        </div>

      </div>
      <OfferList />
    </div>

  )
}