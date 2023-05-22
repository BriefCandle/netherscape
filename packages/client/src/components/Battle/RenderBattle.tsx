import { useState, useCallback, useEffect } from "react";
import { useMUD } from "../../MUDContext";
import { useBattleContext } from "../../utils/BattleContext";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { PCImageType } from "../PCInstance/LoadPCImage";
import { PCAttack, PCBattle } from "../PCInstance/PCBattle";
import { ActiveComponent } from "../../utils/useActiveComponent";
import { Entity, getComponentValueStrict } from "@latticexyz/recs";

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
  const [activeComponent, setActive] = useState(ActiveComponent.battle);

  console.log("attack PC", player_pcIDs[playerPCIndex])
  console.log("attack ID", pcAttackIDs[attackIDIndex])

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
      playerPCIndex === player_pcIDs.length -1 ? playerPCIndex : playerPCIndex+1)
    } else if (activeComponent == ActiveComponent.battlePlayerAttackSelected) {
      setEnemyPCIndex((enemyPCIndex) =>
      enemyPCIndex === enemy_pcIDs.length - 1 ? enemyPCIndex : enemyPCIndex + 1)
    }
  },[activeComponent])

  const press_a = useCallback(async () => {
    if (activeComponent == ActiveComponent.battle) {
      const pcID = player_pcIDs[playerPCIndex];
      console.log("selected pcid: ", pcID) 
      setPCAttackIDs(getComponentValueStrict(PCInstance, pcID as Entity).attackIDs) 
      return setActive(ActiveComponent.battlePlayerPCSelected);
    } else if (activeComponent == ActiveComponent.battlePlayerPCSelected) {
      return setActive(ActiveComponent.battlePlayerAttackSelected)
    } else if (activeComponent == ActiveComponent.battlePlayerAttackSelected) {
      console.log(player_pcIDs[playerPCIndex], "attacks", enemy_pcIDs[enemyPCIndex], "with", pcAttackIDs[attackIDIndex])
      attack(player_pcIDs[playerPCIndex], enemy_pcIDs[enemyPCIndex], pcAttackIDs[attackIDIndex])
      return setActive(ActiveComponent.battle);
    }

  }, [activeComponent]);

  const press_b = () => { 
    if (activeComponent == ActiveComponent.battlePlayerPCSelected) {
      return setActive(ActiveComponent.battle);
    } else if (activeComponent == ActiveComponent.battlePlayerAttackSelected) {
      return setActive(ActiveComponent.battlePlayerPCSelected)
    } 
  }
  const press_up = () => { 
    if (activeComponent == ActiveComponent.battlePlayerPCSelected) {
      setAttackIDIndex((attackIDIndex)=> 
      attackIDIndex === 0 ? attackIDIndex : attackIDIndex - 1)
    }
  };
  const press_down = () => { 
    if (activeComponent == ActiveComponent.battlePlayerPCSelected) {
      setAttackIDIndex((attackIDIndex)=> 
      attackIDIndex === pcAttackIDs.length -1 ? attackIDIndex : attackIDIndex+1)
    }
   };

  // TODO?: bring up the market info
  const press_start = () => { return; };

  useKeyboardMovement(true, 
    press_up, press_down, press_left, press_right, press_a, press_b, press_start)



  return (
    <>
    <div  className="w-full relative flex flex-col" style={{width: 1000, height: 600 }}>
      <div className="enemy-pcs">
        { enemy_pcIDs.map((pcID, index) =>(
          <PCBattle key={index} pcID={pcID} selected={index == enemyPCIndex} imageType={PCImageType.front}/>
        ))}
      </div>
      <div className="player-pcs">
        { player_pcIDs.map((pcID, index) => (
          <PCBattle key={index} pcID={pcID} selected={index == playerPCIndex} imageType={PCImageType.back}/>
        ))}
      </div>
      <div className="attack">
        { activeComponent == ActiveComponent.battlePlayerPCSelected ? 
        pcAttackIDs.map((attackID, index) => (
          <PCAttack key={index} selected={index == attackIDIndex} attackID={attackID}/>
        )) : null}
      </div>
    </div>
    <style>
      {`
        .enemy-pcs {
          height: 200px;
          background-color: white;
          display: flex;
          justify-content: flex-end;
        }
        .player-pcs {
          height: 200px;
          background-color: white;
          display: flex;
          justify-content: flex-start;
        }
        .attack {
          height: 200px;
          background-color: black;
          // display: flex;
          // justify-content: flex-start;
        }
      `}
    </style>
    </>
  )
}