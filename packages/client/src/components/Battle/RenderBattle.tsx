import { useState, useCallback, useEffect } from "react";
import { useMUD } from "../../MUDContext";
import { useBattleContext } from "../../utils/BattleContext";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { PCImageType } from "../PCInstance/LoadPCImage";
import { PCAttack, PCBattle } from "../PCInstance/PCBattle";
import { ActiveComponent } from "../../utils/useActiveComponent";
import { Entity, getComponentValueStrict } from "@latticexyz/recs";
import { useActiveContext } from "../../utils/ActiveContext";

export const RenderBattle = () => {

  const {
    components: { CommandedBy, AttackClass, PCInstance, BattleWith },
    network: { playerEntity },
    systemCalls: { addressToBytes32, attack },
  } = useMUD();

  const {player_pcIDs, enemy_players, enemy_pcIDs} = useBattleContext();


    // ----- key input functions -----
  const [playerPCIndex, setPlayerPCIndex] = useState(0);
  const [enemyPCIndex, setEnemyPCIndex] = useState(0);
  const [pcAttackIDs, setPCAttackIDs] = useState([""]);
  const [attackIDIndex, setAttackIDIndex] = useState(0);

  const {activeComponent, setActive} = useActiveContext();
  
  useEffect(() => {
    setActive(ActiveComponent.battle);
  },[]);
  // console.log("attack PC", player_pcIDs[playerPCIndex])
  // console.log("attack ID", pcAttackIDs[attackIDIndex])

  const press_left = useCallback(() => {
    if (activeComponent == ActiveComponent.battle) {
      setPlayerPCIndex((playerPCIndex)=> 
      playerPCIndex === 0 ? playerPCIndex : playerPCIndex - 1)
    } else if (activeComponent == ActiveComponent.battlePlayerAttackSelected) {
      setEnemyPCIndex((enemyPCIndex) =>
      enemyPCIndex === 0 ? enemyPCIndex : enemyPCIndex - 1)
    }
  },[activeComponent])

  const press_right = useCallback(() => {
    if (activeComponent == ActiveComponent.battle) {
      setPlayerPCIndex((playerPCIndex)=> 
      playerPCIndex === player_pcIDs.length ? playerPCIndex : playerPCIndex+1)
    } else if (activeComponent == ActiveComponent.battlePlayerAttackSelected) {
      setEnemyPCIndex((enemyPCIndex) =>
      enemyPCIndex === enemy_pcIDs.length - 1 ? enemyPCIndex : enemyPCIndex + 1)
    }
  },[activeComponent])

  const press_a = useCallback(async () => {
    if (activeComponent == ActiveComponent.battle) {
      if(playerPCIndex == player_pcIDs.length){
        //reinforce
        console.log("reinforce");
        return setActive(ActiveComponent.pcLoanMarket)
      }
      else{
        const pcID = player_pcIDs[playerPCIndex];
        // console.log("selected pcid: ", pcID) 
        setPCAttackIDs(getComponentValueStrict(PCInstance, pcID as Entity).attackIDs) 
        return setActive(ActiveComponent.battlePlayerPCSelected);
      }
    } else if (activeComponent == ActiveComponent.battlePlayerPCSelected) {
      return setActive(ActiveComponent.battlePlayerAttackSelected)
    } else if (activeComponent == ActiveComponent.battlePlayerAttackSelected) {
      console.log(player_pcIDs[playerPCIndex], "attacks", enemy_pcIDs[enemyPCIndex], "with", pcAttackIDs[attackIDIndex])
      attack(player_pcIDs[playerPCIndex], enemy_pcIDs[enemyPCIndex], pcAttackIDs[attackIDIndex])
      return setActive(ActiveComponent.battle);
    }

  }, [activeComponent, playerPCIndex, attackIDIndex]);

  const press_b = () => { 
    if (activeComponent == ActiveComponent.battlePlayerPCSelected) {
      return setActive(ActiveComponent.battle);
    } else if (activeComponent == ActiveComponent.battlePlayerAttackSelected) {
      return setActive(ActiveComponent.battlePlayerPCSelected)
    } 
  }
  const press_up = useCallback(() => { 
    if (activeComponent == ActiveComponent.battlePlayerPCSelected) {
      setAttackIDIndex((attackIDIndex)=> 
      attackIDIndex === 0 ? attackIDIndex : attackIDIndex - 1)
    }
  }, [activeComponent])

  const press_down = useCallback(() => { 
    if (activeComponent == ActiveComponent.battlePlayerPCSelected) {
      setAttackIDIndex((attackIDIndex)=> 
      attackIDIndex === pcAttackIDs.length -1 ? attackIDIndex : attackIDIndex+1)
    }
  }, [activeComponent])

  // TODO?: bring up the market info
  const press_start = () => { return setActive(ActiveComponent.pcLoanMarket) };

  useKeyboardMovement(true, 
    press_up, press_down, press_left, press_right, press_a, press_b, press_start)



  return (
    <>
    <div  className="w-full relative flex flex-col bg-battle" style={{width: 1000, height: 600, }}>
      <div className="h-1/3 flex flex-row justify-end ">
        { enemy_pcIDs.map((pcID, index) =>(
          <PCBattle key={index} pcID={pcID} selected={index == enemyPCIndex} imageType={PCImageType.front}/>
        ))}
      </div>
      <div className="h-1/3 flex flex-row ">
        { player_pcIDs.map((pcID, index) => (
          <PCBattle key={index} pcID={pcID} selected={index == playerPCIndex} imageType={PCImageType.back}/>
        ))}
        <div className={`my-auto flex w-24 h-[10.5rem] rounded-md transition-all ease-in-out ${playerPCIndex == player_pcIDs.length ? "bg-gray-400 opacity-75":""}`}>
          <svg className={`w-12 h-12 mx-auto my-auto transition-all ease-in-out ${playerPCIndex == player_pcIDs.length ? "invert":""}`} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024"xmlns="http://www.w3.org/2000/svg"><path d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512 282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01 0-247.024 200.976-448 448-448s448 200.977 448 448-200.976 449.01-448 449.01zM736 480H544V288c0-17.664-14.336-32-32-32s-32 14.336-32 32v192H288c-17.664 0-32 14.336-32 32s14.336 32 32 32h192v192c0 17.664 14.336 32 32 32s32-14.336 32-32V544h192c17.664 0 32-14.336 32-32s-14.336-32-32-32z"></path></svg>
        </div>
      </div>

      <div className="h-1/3 flex flex-col bg-black rounded-md">
        { activeComponent == ActiveComponent.battlePlayerPCSelected ? 
        pcAttackIDs.map((attackID, index) => (
          <PCAttack key={index} selected={index == attackIDIndex} attackID={attackID}/>
        )) : null}
      </div>
    </div>
    </>
  )
}