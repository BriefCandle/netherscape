import { useState, useCallback } from "react";
import { useMUD } from "../../MUDContext";
import { useMapContext } from "../../utils/MapContext";
import { ActiveComponent } from "../../utils/useActiveComponent";
import { useKeyboardMovement } from "../../utils/useKeyboardMovement";
import { Entity, Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { useBlockNumber } from "../../utils/useBlockNumber";
import { pcLoanSpeed, pcLoanSpeedAdjust } from "../../constant";
import { LoadPCImage, PCImageType } from "../PCInstance/LoadPCImage";
import { HPBar } from "../Team/TeamPCCard";
import { useActiveContext } from "../../utils/ActiveContext";

export const PCLoanInject = (props: {pcIDs: any[]}) => {

  const {pcIDs} = props;
  
  // const { 
  //   components: { PCLoanOffer, PCInstance, PCLoanAccept },
  //   network: { playerEntity },
  //   systemCalls: {addressToBytes32, pcLoan_inject }
  // } = useMUD();

  // const { setActive, activeComponent } = useActiveContext()

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [buttonSelected, setButtonSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  // const pcIDs = useEntityQuery([HasValue(PCLoanAccept, {acceptorID: addressToBytes32(playerEntity as Entity), isInjected: false})])
  
  // const pcInstances = pcIDs?.map((pcID) => {return getComponentValue(PCInstance, pcID)})
  // const pcLoanAccepts = pcIDs?.map((pcID) => {return getComponentValue(PCLoanAccept, pcID)});
  
  const blockNumber = useBlockNumber();
  
  // const press_up = () => {
  //   setSelectedItemIndex((selectedItemIndex)=> 
  //     selectedItemIndex === 0 ? selectedItemIndex : selectedItemIndex - 1
  //   )
  // }

  // const press_down = () => {
  //   setSelectedItemIndex((selectedItemIndex)=> 
  //     selectedItemIndex === pcIDs.length - 1 ? selectedItemIndex : selectedItemIndex + 1
  //   )
  // }

  // const press_a = useCallback(async () => {
  //   const pcID = pcIDs[selectedItemIndex];
  //   pcLoan_inject(pcID)
  //     // return setActive(ActiveComponent.map)
  // }, [press_up, press_down]);

  //   const press_b = () => {
  //     setActive(ActiveComponent.battle);
  //   }

  //   const press_left = () => { return; };
  //   const press_right = () => { return; };
  //   const press_start = () => { setActive(ActiveComponent.map);};

  // useKeyboardMovement(activeComponent == ActiveComponent.pcLoanInject, 
  //   press_up, press_down, press_left, press_right, press_a, press_b, press_start)

  return (
    <>
      <div className="absolute flex flex-col top-1/4 left-[30%] bg-white border-2  box-shadow-xl z-40 rounded-lg" style={{width: "27rem"}}>
      <div className="name text-lg bg-black">PCs to be injected:</div>
        {pcIDs.map((pcID,i)=>(
          <PCInjectPCCard key={i} pcID={pcID} blockNumber={blockNumber} selected={selectedItemIndex==i} buttonSelected={selectedItemIndex==i && buttonSelected} loading={ selectedItemIndex==i && loading} />
      ))}
      </div>
    </>
  )
}



export const PCInjectPCCard = (props: {pcID: any, blockNumber: any, selected: boolean, buttonSelected: boolean, loading: boolean}) => {
  const { pcID, blockNumber, selected, buttonSelected, loading } = props;

  const { 
    components: { PCLoanOffer, PCInstance, PCLoanAccept, PCClass },
    network: { playerEntity },
    systemCalls: {addressToBytes32, bytes32ToInteger, pcLoan_inject }
  } = useMUD();

  const pcInstance = getComponentValue(PCInstance, pcID)
  if (!pcInstance) return null;
  const pcClass = getComponentValue(PCClass, bytes32ToInteger(pcInstance?.pcClassID) as Entity)  
  const pcLoanAccept = getComponentValue(PCLoanAccept, pcID)
  const pcLoanRequiredBlock = Math.floor(pcLoanAccept?.distance / (pcLoanSpeed/ pcLoanSpeedAdjust))
  const pcLoanTraveledBlock = (blockNumber - Number(pcLoanAccept?.startBlock));

  const pcArrivedIn = pcLoanTraveledBlock >= pcLoanRequiredBlock ? 0 : (pcLoanRequiredBlock - pcLoanTraveledBlock)

  if (pcArrivedIn == 0) {
    pcLoan_inject(pcID)
  }

  const handleClick = () => {
    console.log();
    
  }

  return (
    <div className={`flex flex-row flex-nowrap p-3 border rounded-md ${selected?"bg-blue-700":"bg-blue-500"} hover:bg-blue-700 select-none transition ease-in-out delay-75`}>
      <div className="avatar flex">
        <LoadPCImage classIndex={pcClass?.className} imageType={PCImageType.front}/>
        {/* <img src={pcIMGs[pc.pcClassID] ?? pc1 } className="w-20 my-auto" /> */}
      </div>
      <div className="name-lv flex flex-col ml-1 my-auto w-14 overflow-hidden">
        <div className="name text-lg">{ pcClass?.className }</div>
        {/* <div className="level text-xs">Lv.1</div> */}
      </div>

      <div className="hp-attrs flex flex-col grow ml-3 my-auto">
        <HPBar hp={pcInstance.currentHP} maxHP={pcInstance.maxHP} />
        <div className="flex flex-row justify-between mt-2">
          <div className="attributes text-xs flex w-full">
          <button 
              className={`min-w-24 px-2 pb-1 flex flex-row my-auto ml-auto ${buttonSelected?"bg-rose-800":"bg-rose-600"} hover:bg-rose-700 transition ease-in-out delay-75 text-white rounded text-sm font-semibold`}
              onClick={handleClick}
              disabled={loading}
              >
          {loading && (<svg className="animate-spin w-4 mt-1 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>)}
            {!loading && (pcArrivedIn == 0 ? "$Inject" : pcArrivedIn )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
