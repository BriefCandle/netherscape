import { ActiveComponent } from "../../utils/useActiveComponent";
import { useCallback, useEffect, useState } from "react";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { useMapContext } from "../../utils/MapContext";
import { useMUD } from "../../MUDContext";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Has, HasValue, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";

import { TeamPCCard } from "./TeamPCCard";

export const TeamList = () => {
  const {
    components: { CommandedBy, PCInstance},
    network: { playerEntity },
    systemCalls: { pcLoan_offer, addressToBytes32 },
  } = useMUD();

  const { setActive, activeComponent } = useMapContext();

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [buttonSelected, setButtonSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  // const pcInstanceIDs = useEntityQuery([Has(PCInstance), HasValue(CommandedBy, {value:addressToBytes32(playerEntity)})]);
  // const pcInstances = pcInstanceIDs.map( (id : string) => {return  {...getComponentValueStrict(PCInstance, id), id:id };});
  const pcIDs = useEntityQuery([HasValue(CommandedBy, {value: addressToBytes32(playerEntity as string)})]);
  const pcInstances = pcIDs?.map((pcID) => {
    return getComponentValue(PCInstance, pcID)
  })
  
  console.log("my pcs", pcIDs, pcInstances);

  // ------- key input -------

  const press_up = () => {
    setButtonSelected(false);
    setLoading(false);
    setSelectedItemIndex((selectedItemIndex) =>
      selectedItemIndex === 0 ? selectedItemIndex : selectedItemIndex - 1
    );
  };

  const press_down = () => {
    setButtonSelected(false);
    setLoading(false);
    setSelectedItemIndex((selectedItemIndex) =>
      selectedItemIndex === pcInstances.length - 1
        ? selectedItemIndex
        : selectedItemIndex + 1
    );
  };

  const press_a = useCallback(async () => {
    const pcID = pcIDs[selectedItemIndex];
    buttonSelected && !loading && pcLoan_offer(pcID);
  }, [press_up, press_down]);

  const press_b = () => {
    setActive(ActiveComponent.map);
  };

  const press_left = () => {
    setButtonSelected(false);
  };
  const press_right = () => {
    setButtonSelected(true);
  };
  const press_start = () => {
    return setActive(ActiveComponent.map)
  };

  useKeyboardMovement(
    activeComponent == ActiveComponent.team,
    press_up,
    press_down,
    press_left,
    press_right,
    press_a,
    press_b,
    press_start
  );

  
  // const handleOffer = (pcID) => {
  //   setLoading(true);
  //   console.log(pcID);

  //   setTimeout(() => {
  //     setLoading(false);
  //   },3000)
  // }


  return (
    <>
      <div className="absolute flex flex-col top-1/4 left-[30%] bg-white border-2  box-shadow-xl z-40 rounded-lg" style={{width: "27rem"}}>

        {pcInstances.map((pcInstance,i)=>(
          <TeamPCCard key={i} pcInstance={pcInstance} selected={selectedItemIndex==i} buttonSelected={selectedItemIndex==i && buttonSelected} loading={ selectedItemIndex==i && loading} />
        ))}

      </div>
    </>
  );
};
