import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useActiveComponent } from "./useActiveComponent";
// import { useMUD } from "../MUDContext";

export enum PlayerDirection {
  Up,
  Down,
  Left,
  Right
}

type MapContextType = {
  activeComponent: any;
  setActive: any;

  playerDirection: any;
  setPlayerDirection: any;

  interactCoord: any;
  setInteractCoord: any;

  // playerIndex: any;
  // setPlayerIndex: any;
}


const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = (props: {children: ReactNode}) => {

  const currentValue = useContext(MapContext);
  if (currentValue) throw new Error("BattleProvider can only be used once")

  // const {
  //   network: { playerEntity },
  // } = useMUD();

  const { activeComponent, setActive } = useActiveComponent();
  const [playerDirection, setPlayerDirection] = useState<PlayerDirection>(PlayerDirection.Up);
  const [interactCoord, setInteractCoord] = useState<{x: number, y: number}>()
  // const [thatPlayerIndex, setThatPlayerIndex] = useState<EntityIndex | null>(playerEntity)

  const value = {
    activeComponent, setActive,
    playerDirection, setPlayerDirection,
    interactCoord, setInteractCoord,
    // thatPlayerIndex, setThatPlayerIndex
  }
  return <MapContext.Provider value={value}>{props.children}</MapContext.Provider>
}

export const useMapContext = () => {
  const value = useContext(MapContext);
  if (!value) throw new Error("Must be used within a MapProvider");
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