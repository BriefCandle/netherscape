import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, getComponentValue, Has, HasValue, runQuery } from "@latticexyz/recs";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMUD } from "../MUDContext";
import { ethers , BigNumber, utils} from 'ethers';
import { ActiveComponent } from "./useActiveComponent";

// import { useGetBattleID, useGetCommit, useGetEnemyTeamIndex, useGetPlayerTeamIndex, useGetPlayerTeamPokemonIDs } from "./useBattleTurn";

type BattleContextType = {
  // isPvE: boolean;
  player_pcIDs: string[];
  enemy_players: string[];
  enemy_pcIDs: any[];
  player_attackIDs: any[];
  setPlayerAttackIDs: any;
  setActive: any;
  activeComponent: any;
  message: string;
  setMessage: any;
  // commit?: number;
  // commit_action?: number;
  // selectedAction: any;
  // setSelectedAction: any;
  // selectedTarget: any;
  // setSelectedTarget: any
  // setIsBusy: any;
  // isBusy: boolean;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const BattleProvider = (props: {children: ReactNode}) => {
  // const { battleID, playerEntityId } = props;

  const currentValue = useContext(BattleContext);
  if (currentValue) throw new Error("BattleProvider can only be used once")

  const {
    components: { CommandedBy, AttackClass, PCInstance, BattleWith },
    network: { playerEntity },
    systemCalls: { addressToBytes32 },
  } = useMUD();

  const defender = useComponentValue(BattleWith, playerEntity)?.value;
  const attackers = useEntityQuery([HasValue(BattleWith, {value: addressToBytes32(playerEntity as string)})]);
  
  let enemy_players: string[] = [];
  if (attackers.length > 0) enemy_players = Array.from(attackers).map((entity) => addressToBytes32(entity as string))
  if (defender !== undefined) enemy_players.push(defender)
  // console.log("enemy_players",enemy_players)

  const player_pcIDs = useEntityQuery([HasValue(CommandedBy, {value: addressToBytes32(playerEntity as string)})]);

  // const enemies: { player: string; pcIDs: Entity[]; }[] = []
  // enemy_players.forEach((player)=> {
  //   const pcIDs = Array.from(runQuery([HasValue(CommandedBy, {value: addressToBytes32(player as string)})]));
  //   enemies.push({player: player, pcIDs: pcIDs})
  // })
  // const enemy_pcIDs = enemies.flatMap((obj) => obj.pcIDs)

  const defender_pcIDs = useEntityQuery([HasValue(CommandedBy, {value: defender ? addressToBytes32(defender): ""})])
  const attacker_pcIDs = useEntityQuery([HasValue(CommandedBy, {value: attackers[0] ? addressToBytes32(attackers[0]): ""})])
  const enemy_pcIDs = defender_pcIDs.concat(attacker_pcIDs)
  

  const [player_attackIDs, setPlayerAttackIDs] = useState([]);
  const [activeComponent, setActive] = useState()

  const [message, setMessage] = useState("");

  const value = {
    player_pcIDs,
    enemy_players,
    enemy_pcIDs,
    player_attackIDs,
    setPlayerAttackIDs,
    setActive,
    activeComponent,
    message,
    setMessage
  }
  return <BattleContext.Provider value={value}>{props.children}</BattleContext.Provider>
}

export const useBattleContext = () => {
  const value = useContext(BattleContext);
  if (!value) throw new Error("Must be used within a BattleProvider");
  return value;
};


export const findFirstNotValue = (iterable: IterableIterator<any>, notValue: any): any=> {
  for (const element of iterable) {
    if (element !== notValue) {
      return element;
    }
  }
  return undefined
}