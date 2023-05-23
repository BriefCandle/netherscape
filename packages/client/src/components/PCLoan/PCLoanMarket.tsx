import { useState, useCallback } from "react";
import { useMUD } from "../../MUDContext";
import { useMapContext } from "../../utils/MapContext";
import { ActiveComponent } from "../../utils/useActiveComponent";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { Entity, Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { TeamPCCard } from "../Team/TeamPCCard";
import { PCLoanPCCard } from "./PCLoanPCCard";

// structurally the same as TeamList
export const PCLoanMarket = () => {

  const { 
    components: { PCLoanOffer, PCInstance, PCLoanAccept, PCClass },
    network: { playerEntity },
    systemCalls: {addressToBytes32, pcLoan_accept, pcLoan_rescind}
  } = useMUD();

  const { setActive, activeComponent } = useMapContext()

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [buttonSelected, setButtonSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: combine pcIDs that are 1) with player's playerEntity and 2) with 0 playerEntity 
  const pcIDs = useEntityQuery([Has(PCLoanOffer)])
  const test_pcIDs = runQuery([HasValue(PCLoanAccept, {acceptorID: addressToBytes32(playerEntity as Entity)})])
  console.log(test_pcIDs)
  

  // ------- key input -------

  const press_up = () => {
    setSelectedItemIndex((selectedItemIndex)=> 
      selectedItemIndex === 0 ? selectedItemIndex : selectedItemIndex - 1
    )
  }

  const press_down = () => {
    setSelectedItemIndex((selectedItemIndex)=> 
      selectedItemIndex === pcIDs.length - 1 ? selectedItemIndex : selectedItemIndex + 1
    )
  }

  const press_a = useCallback(async () => {
    const pcID = pcIDs[selectedItemIndex];
    buttonSelected && !loading &&  acceptOrRescind(pcID)
      // return setActive(ActiveComponent.map)
  }, [press_up, press_down]);

  // TODO: how to return to battle?
  const press_b = () => {
    setActive(ActiveComponent.map);
  }
  const press_start = () => { setActive(ActiveComponent.map);};

  const press_left = () => {
    setButtonSelected(false);
  };
  const press_right = () => {
    setButtonSelected(true);
  };
  

  useKeyboardMovement(activeComponent == ActiveComponent.pcLoanMarket, 
    press_up, press_down, press_left, press_right, press_a, press_b, press_start)
  
  // TODO: wrap it in PCLoanPCCard
  const acceptOrRescind = (pcID: any) => {
    const pcLoanOffer = getComponentValue(PCLoanOffer, pcID);
    const isOfferor = pcLoanOffer?.offerorID == addressToBytes32(playerEntity as Entity)
    if (isOfferor) pcLoan_rescind(pcID);
    else pcLoan_accept(pcID)
  }

  return (
    <>
      <div className="absolute flex flex-col top-1/4 left-[30%] bg-white border-2  box-shadow-xl z-40 rounded-lg" style={{width: "27rem"}}>
      <div className="name text-lg bg-black">PCs on loan market:</div>
        {pcIDs.map((pcID,i)=>(
          <PCLoanPCCard key={i} pcID={pcID} selected={selectedItemIndex==i} buttonSelected={selectedItemIndex==i && buttonSelected} loading={ selectedItemIndex==i && loading} />
      ))}
      </div>
    </>
  )
}

