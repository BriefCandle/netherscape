import { useState } from "react";

// mainly for user input
export enum ActiveComponent {
  "map",
  "mapMenu",
  "pcLoanMarket",
  "pcLoanInject",
  "pcLoanTerminate",
  "team",
  "menu",
  "terrainConsole",
  "nurse",
  "pc",
  "pcTeam",
  "pcTeamMenu",
  "pcTeamSelect",
  "pcOwned",
  "pcOwnedMenu",
  "pcPokemon",
  "pcSwitch",
  "otherPlayerMenu",
  "offerorWait",
  "offereeMenu",
  
  "teamSwitch",
  "teamPokemonMenu",
  "teamPokemon",
  "pokemonClass",
  "battle",
  "battlePlayerPCSelected",
  "battlePlayerAttackSelected",
  "battlePlayerReveal"
}

export const useActiveComponent = () => {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent | null>(null);

  const setActive = (component: any) => {
    setActiveComponent(component);
  };

  return {activeComponent, setActive};
}