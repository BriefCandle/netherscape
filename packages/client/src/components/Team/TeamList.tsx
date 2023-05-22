import { ActiveComponent } from "../../utils/useActiveComponent";
import { useCallback, useEffect, useState } from "react";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { useMapContext } from "../../utils/MapContext";
import { useMUD } from "../../MUDContext";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";

import { TeamPCCard } from "./TeamPCCard";

const menuItems = [
  { name: "$Siege", value: "siege" },
  { name: "$Unsiege", value: "unsiege" }, // TODO: fix, check for siege condition and grey out
  { name: "Team", value: "team" },
  { name: "Item", value: "item" },
  { name: "Logout", value: "logout" },
];

export const TeamList = () => {
  const {
    components: { CommandedBy, PCInstance},
    network: { playerEntity },
    systemCalls: { siege, unsiege, logout, addressToBytes32 },
  } = useMUD();

  const { setActive, activeComponent } = useMapContext();

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [buttonSelected, setButtonSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const pcInstanceIDs = useEntityQuery([Has(PCInstance), HasValue(CommandedBy, {value:addressToBytes32(playerEntity)})]);
  const pcInstances = pcInstanceIDs.map( (id : string) => {return  {...getComponentValueStrict(PCInstance, id), id:id };});

  console.log("my pcs", pcInstanceIDs, pcInstances);

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
    const item = pcInstances[selectedItemIndex];
    console.log(item);

    buttonSelected && !loading && handleOffer(pcInstances[selectedItemIndex].id);
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
    buttonSelected && !loading && handleOffer(pcInstances[selectedItemIndex].id);
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

  
  const handleOffer = (pcID) => {
    setLoading(true);
    console.log(pcID);

    setTimeout(() => {
      setLoading(false);
    },3000)
  }


  return (
    <>
      <div className="absolute flex flex-col top-1/4 left-[30%] bg-white border-2  box-shadow-xl z-20 rounded-lg" style={{width: "27rem"}}>

        {pcInstances.map((pc,i)=>(
          <TeamPCCard pc={pc} selected={selectedItemIndex==i} buttonSelected={selectedItemIndex==i && buttonSelected} loading={ selectedItemIndex==i && loading} />
        ))}

      </div>
    </>
  );
};
