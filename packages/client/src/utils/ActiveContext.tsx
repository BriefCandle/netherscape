import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useActiveComponent } from "./useActiveComponent";


type ActiveContextType = {
  activeComponent: any;
  setActive: any;
}


const ActiveContext = createContext<ActiveContextType | undefined>(undefined);

export const ActiveProvider = (props: {children: ReactNode}) => {

  const currentValue = useContext(ActiveContext);
  if (currentValue) throw new Error("BattleProvider can only be used once")

  const { activeComponent, setActive } = useActiveComponent();

  const value = {
    activeComponent, setActive,
  }
  return <ActiveContext.Provider value={value}>{props.children}</ActiveContext.Provider>
}

export const useActiveContext = () => {
  const value = useContext(ActiveContext);
  if (!value) throw new Error("Must be used within a ActiveProvider");
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