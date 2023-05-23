import { ActiveComponent } from "../../utils/useActiveComponent";
import { useCallback, useEffect, useState } from "react";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { useMapContext } from "../../utils/MapContext";
import { useMUD } from "../../MUDContext";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, HasValue } from "@latticexyz/recs";
import { PCLoanInject } from "../PCLoan/PCLoanInject";
import { useActiveContext } from "../../utils/ActiveContext";

const menuItems = [
  { name: "$Siege", value: "siege"},
  { name: "$Unsiege", value: "unsiege"}, // TODO: fix, check for siege condition and grey out
  { name: "PC Loan Market", value: "pcLoan"},
  { name: "PC Loan Inject", value: "pcLoanInject"},
  { name: "PC Loan Terminate", value: "pcLoanTerminate"},
  { name: "Team", value: "team"},
  // { name: "Item", value: "item"},
  { name: "Logout", value: "logout"}
]

export const MapMenu = () => {

  const { 
    components: { PCLoanOffer, PCLoanAccept, SiegedBy, BattleWith},
    network: { playerEntity },
    systemCalls: {siege, unsiege, logout,addressToBytes32}
  } = useMUD();

  const { setActive, activeComponent } = useActiveContext()

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const isAttacker = useComponentValue(BattleWith, playerEntity)?.value !== undefined;
  const isDefender = useEntityQuery([HasValue(BattleWith, {value: addressToBytes32(playerEntity as string)})]).length !== 0

  const isSieging = useEntityQuery([HasValue(SiegedBy, {value: addressToBytes32(playerEntity as Entity)})]).length !=0;

  const isAcceptor = useEntityQuery([HasValue(PCLoanAccept, {acceptorID: addressToBytes32(playerEntity as Entity), isInjected: false})]).length != 0;
  const isOfferee = useEntityQuery([HasValue(PCLoanAccept, {offerorID: addressToBytes32(playerEntity as Entity), isInjected: true})]).length != 0;

  let menuItems_update = menuItems;
  if (isSieging) {
    menuItems_update = menuItems_update.filter((obj) => obj.value !== "siege")
  } else {
    menuItems_update = menuItems_update.filter((obj) => obj.value !== "unsiege")
  }
  if (!isAcceptor) menuItems_update = menuItems_update.filter((obj) => obj.value !== "pcLoanInject")
  if (!isOfferee) menuItems_update = menuItems_update.filter((obj) => obj.value != "pcLoanTerminate")

  const press_up = () => {
    setSelectedItemIndex((selectedItemIndex)=> 
      selectedItemIndex === 0 ? selectedItemIndex : selectedItemIndex - 1
    )
  }

  const press_down = () => {
    setSelectedItemIndex((selectedItemIndex)=> 
      selectedItemIndex === menuItems_update.length - 1 ? selectedItemIndex : selectedItemIndex + 1
    )
  }

   const press_a = useCallback(async () => {
      const item = menuItems_update[selectedItemIndex];
      switch (item.value) {
        case "siege":
          siege();
          return setActive(ActiveComponent.map);
        case "unsiege":
          unsiege();
          return setActive(ActiveComponent.map);        
        case "team":
          return setActive(ActiveComponent.team);
        case "pcLoan":
          return setActive(ActiveComponent.pcLoanMarket)
        case "pcLoanInject":
            return setActive(ActiveComponent.pcLoanInject)
        case "pcLoanTerminate":
            return setActive(ActiveComponent.pcLoanTerminate)
        case "item":
          return console.log("Item");
        case "logout":
          await logout();
          return setActive(ActiveComponent.map)
      }
    }, [press_up, press_down]);

    const press_b = () => {
      setActive(ActiveComponent.map);
    }

    const press_left = () => { return; };
    const press_right = () => { return; };
    const press_start = () => { 
      if (isAttacker || isDefender) setActive(ActiveComponent.battle)
      else setActive(ActiveComponent.map)
    };

  useKeyboardMovement(activeComponent == ActiveComponent.mapMenu, 
    press_up, press_down, press_left, press_right, press_a, press_b, press_start)

  
  return (
    <>
      <div className="menu">
        {menuItems_update.map((item, index) => (
          <div 
            key={item.value}
            className={`menu-item ${index === selectedItemIndex ? "selected" : ""}`}
          >
            {item.name}
          </div>
        ))}
      </div>
      <style>
      {`
        .menu {
          display: flex;
          flex-direction: column;
          top: 50px;
          right: 0px;
          background-color: white;
          border: 4px solid #585858;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
          position: absolute; /* Add this to allow z-index */
          z-index: 30; /* Add this to set the z-index */
        }
        
        .menu-item {
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Press Start 2P", sans-serif;
          font-size: 16px;
          color: black;
          padding: 8px;
          margin: 4px; /* Update this to have smaller margins */
          border-radius: 12px;
          box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25); /* Add text shadow for effect */
        }
        
        .selected {
          color: #ffd700;
          background-color: #585858;
        }
      `}
      </style>
    </>
  )
}
