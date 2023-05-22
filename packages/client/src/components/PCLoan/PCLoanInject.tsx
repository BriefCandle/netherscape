import { useState, useCallback } from "react";
import { useMUD } from "../../MUDContext";
import { useMapContext } from "../../utils/MapContext";
import { ActiveComponent } from "../../utils/useActiveComponent";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { Entity, Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";

export const PCLoanInject = () => {

  const { 
    components: { PCLoanOffer, PCInstance, PCLoanAccept },
    network: { playerEntity },
    systemCalls: {addressToBytes32, pcLoan_inject }
  } = useMUD();


  const pcIDs = useEntityQuery([HasValue(PCLoanAccept, {acceptorID: addressToBytes32(playerEntity as Entity), isInjected: false})])
  console.log(pcIDs)

  const pcInstances = pcIDs?.map((pcID) => {
    return getComponentValue(PCInstance, pcID)
  })
  

  const { setActive, activeComponent } = useMapContext()

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const press_up = () => {
    setSelectedItemIndex((selectedItemIndex)=> 
      selectedItemIndex === 0 ? selectedItemIndex : selectedItemIndex - 1
    )
  }

  const press_down = () => {
    setSelectedItemIndex((selectedItemIndex)=> 
      selectedItemIndex === pcInstances.length - 1 ? selectedItemIndex : selectedItemIndex + 1
    )
  }

  const press_a = useCallback(async () => {
    const pcID = pcIDs[selectedItemIndex];
    pcLoan_inject(pcID)
      // return setActive(ActiveComponent.map)
  }, [press_up, press_down]);

    const press_b = () => {
      setActive(ActiveComponent.map);
    }

    const press_left = () => { return; };
    const press_right = () => { return; };
    const press_start = () => { setActive(ActiveComponent.map);};

  useKeyboardMovement(activeComponent == ActiveComponent.pcLoanInject, 
    press_up, press_down, press_left, press_right, press_a, press_b, press_start)


  return (
    <>
      Press A to inject PC into your command
          <div className="menu">
        {pcInstances.map((pcInstance, index) => (
          <div 
            key={pcInstance?.pcClassID}
            className={`menu-item ${index === selectedItemIndex ? "selected" : ""}`}
          >
            {pcInstance?.pcClassID}
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

