import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { RenderMap } from "./components/Map/RenderMap";
import { useMUD } from "./MUDContext";
import { OfferList } from "./components/Reinforce/OfferList";
import { MapProvider } from "./utils/MapContext";
import { Entity, HasValue, runQuery } from "@latticexyz/recs";
import { RenderBattle } from "./components/Battle/RenderBattle";
import { BattleProvider } from "./utils/BattleContext";
import { ActiveProvider, useActiveContext } from "./utils/ActiveContext";
import { PCLoanInject } from "./components/PCLoan/PCLoanInject";
import { PCLoanMarket } from "./components/PCLoan/PCLoanMarket";
import { PCLoanTerminate } from "./components/PCLoan/PCLoanTerminate";
import { ActiveComponent } from "./utils/useActiveComponent";
import { MapMenu } from "./components/MapMenu/MapMenu";


export const GameBoard = () => {

  const {
    components: { PlayerPosition, Player, BattleWith, PCLoanAccept },
    network: { playerEntity },
    systemCalls: { spawn, addressToBytes32, respawn },
  } = useMUD();


  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;
  const isAttacker = useComponentValue(BattleWith, playerEntity)?.value !== undefined;
  const isDefender = useEntityQuery([HasValue(BattleWith, {value: addressToBytes32(playerEntity as string)})]).length !== 0
  const pcIDsInject = useEntityQuery([HasValue(PCLoanAccept, {acceptorID: addressToBytes32(playerEntity as Entity), isInjected: false})])

  const playerPosition = useComponentValue(PlayerPosition, playerEntity);
  const canReSpawn = !canSpawn && playerPosition == undefined;


  const {activeComponent, setActive} = useActiveContext();
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
        { canReSpawn ? <button className="bg-red-500" onClick={respawn}>Respawn</button> : null}
        <div className="game h-full w-full"> 
        
          {activeComponent == ActiveComponent.pcLoanMarket ? 
            <PCLoanMarket/> : null}
          
          { pcIDsInject.length !== 0 ?
            <PCLoanInject pcIDs={pcIDsInject}/> : null}
            

          {activeComponent == ActiveComponent.pcLoanTerminate ? 
            <PCLoanTerminate/> : null}

          {activeComponent == ActiveComponent.mapMenu ? 
            <MapMenu/> : null}

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
      {/* <div className="relative"><OfferList /></div> */}
    </div>

  )
}
