import { useComponentValue } from "@latticexyz/react";
import { Entity, getComponentValue, HasValue, runQuery } from "@latticexyz/recs";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
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
  const attackers = runQuery([HasValue(BattleWith, {value: addressToBytes32(playerEntity as string)})]);
  
  let enemy_players: string[] = [];
  if (attackers.size > 0) enemy_players = Array.from(attackers).map((entity) => addressToBytes32(entity as string))
  if (defender !== undefined) enemy_players.push(defender)
  // console.log("enemy_players",enemy_players)

  const player_pcIDs = [...runQuery([HasValue(CommandedBy, {value: addressToBytes32(playerEntity as string)})])];
  // console.log("player_pcIDs", player_pcIDs)

  const enemies: { player: string; pcIDs: Entity[]; }[] = []
  enemy_players.forEach((player)=> {
    const pcIDs = [...runQuery([HasValue(CommandedBy, {value: addressToBytes32(player as string)})])];
    enemies.push({player: player, pcIDs: pcIDs})
  })
  const enemy_pcIDs = enemies.flatMap((obj) => obj.pcIDs)


  // const player_teamIndex = useMemo(() => {
  //   const teamIndexes = getEntitiesWithValue(Team, {value: playerEntityId} as ComponentValue<{value: any}>)?.values();
  //   return teamIndexes.next().value;
  // }, [])

  // const enemy_teamIndex = useMemo(()=> {
  //   const teamBattleIndexes = getEntitiesWithValue(TeamBattle, {value: battleID})?.values();
  //   return findFirstNotValue(teamBattleIndexes, player_teamIndex);
  // }, [battleID])
  // const player_pokemonIDs = useComponentValue(TeamPokemons, player_teamIndex)?.value as EntityID[];
  // const enemy_pokemonIDs = useComponentValue(TeamPokemons, enemy_teamIndex)?.value as EntityID[];
  // const battle_pokemonIDs = useComponentValue(BattlePokemons, battleIndex)?.value as string[] | undefined;
  // const next_pokemonID = useMemo(()=> {
  //   return battle_pokemonIDs ? battle_pokemonIDs[0] : undefined;
  // },[battle_pokemonIDs]) as EntityID | undefined;
  // const player_turn_pokemon = next_pokemonID ? player_pokemonIDs.indexOf(next_pokemonID) : undefined;

  // const enemy_playerID = useComponentValue(Team, enemy_teamIndex)?.value.toString();
  // const isPvE = useMemo(() => {
  //   // const other_playerID_uint256 = BigNumber.from(other_playerID).toString();
  //   const battleSystemID = utils.keccak256(utils.toUtf8Bytes('system.Battle'));
  //   return enemy_playerID == battleSystemID ? true : false;
  // }, [battleID])

  const [player_attackIDs, setPlayerAttackIDs] = useState([]);
  const [activeComponent, setActive] = useState()
  // const [selectedAction, setSelectedAction] = useState<BattleActionType>(-1);
  // const [selectedTarget, setSelectedTarget] = useState(-1);
  // const [isBusy, setIsBusy] = useState(false);

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