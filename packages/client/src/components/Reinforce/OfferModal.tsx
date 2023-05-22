import { ActiveComponent } from "../../utils/useActiveComponent";
import { useCallback, useEffect, useState } from "react";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { useMapContext } from "../../utils/MapContext";
import { useMUD } from "../../MUDContext";

const menuItems = [
  { name: "$Siege", value: "siege"},
  { name: "$Unsiege", value: "unsiege"}, // TODO: fix, check for siege condition and grey out
  { name: "Team", value: "team"},
  { name: "Item", value: "item"},
  { name: "Logout", value: "logout"}
]

export const OfferModal = (props: {show: boolean}) => {

  const { systemCalls: {siege, unsiege, logout}} = useMUD();

  const { setActive, activeComponent } = useMapContext()

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const press_up = () => {
    setSelectedItemIndex((selectedItemIndex)=> 
      selectedItemIndex === 0 ? selectedItemIndex : selectedItemIndex - 1
    )
  }

  const press_down = () => {
    setSelectedItemIndex((selectedItemIndex)=> 
      selectedItemIndex === menuItems.length - 1 ? selectedItemIndex : selectedItemIndex + 1
    )
  }

  const press_a = useCallback(async () => {
      const item = menuItems[selectedItemIndex];
      switch (item.value) {
        case "siege":
          siege();
          return console.log("siege");
        case "unsiege":
          unsiege();
          return console.log("unsiege");
        case "team":
          // setThatPlayerIndex(playerEntity);
          return setActive(ActiveComponent.team);
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
    const press_start = () => { setActive(ActiveComponent.map);};

  useKeyboardMovement(activeComponent == ActiveComponent.mapMenu, 
    press_up, press_down, press_left, press_right, press_a, press_b, press_start)

  
  return (
    <div className={`${props?.show ? "" : "hidden"}`}>
      <div className="absolute flex flex-col top-1/4 left-1/2 z-20 bg-white rounded-lg border-2 border-gray-500 p-2 shadow-2xl">
        <div className="header text-black"> aaa </div>
      </div>
    </div>
  )
}
