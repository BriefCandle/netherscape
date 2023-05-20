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

export const MapMenu = () => {

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
          return setActive(ActiveComponent.map);
        case "unsiege":
          unsiege();
          return setActive(ActiveComponent.map);        
        case "team":
          // setThatPlayerIndex(playerEntity);
          //  setActive(ActiveComponent.team);
          return console.log("team")
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
    <>
      <div className="menu">
        {menuItems.map((item, index) => (
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
          z-index: 10; /* Add this to set the z-index */
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
