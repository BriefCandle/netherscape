import { Entity, getComponentValue } from "@latticexyz/recs";
import { useMUD } from "../../MUDContext";
import { HPBar } from "../Team/TeamPCCard";
import { LoadPCImage, PCImageType } from "../PCInstance/LoadPCImage";

// structually same as TeamPCCard.tsx, difference being this "Accept" PCLoanOffer
export const PCLoanPCCard = (props: {pcID: any, selected: boolean, buttonSelected: boolean, loading: boolean}) => {
  
  const { pcID, selected, buttonSelected, loading } = props;

  const {
    components: { PCInstance, PCClass, PCLoanOffer },
    network: { playerEntity },
    systemCalls: { pcLoan_accept, pcLoan_rescind, addressToBytes32, bytes32ToInteger },
  } = useMUD();

  const pcLoanOffer = getComponentValue(PCLoanOffer, pcID);
  const isOfferor = pcLoanOffer?.offerorID == addressToBytes32(playerEntity as Entity)
  // console.log("isOfferor", isOfferor)
  const pcInstance = getComponentValue(PCInstance, pcID);
  if (!pcInstance) return null;
  const pcClass = getComponentValue(PCClass, bytes32ToInteger(pcInstance?.pcClassID) as Entity)  

  const handleClick = () => {
    console.log(pcLoanOffer);
    
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
          <div className="attributes text-xs text-red-700 font-bold flex flex-col">Duration<span className="mx-auto"> {Number(pcLoanOffer?.duration)}</span></div>
          <div className="attributes text-xs text-green-500 font-bold flex flex-col">Int Rate <span className="mx-auto">{Number(pcLoanOffer?.interestRate)}</span></div>
          {/* <div className="attributes text-xs text-black font-bold flex flex-col">Distance <span className="mx-auto">{Number(pcLoanOffer?.duration)}</span></div> */}
          <div className="attributes text-xs flex">
          <button 
              className={`min-w-22 ml-2 px-2 pb-1 flex flex-row my-auto ${buttonSelected?"bg-rose-800":"bg-rose-600"} hover:bg-rose-700 transition ease-in-out delay-75 text-white rounded text-sm font-semibold`}
              onClick={handleClick}
              disabled={loading}
              >
          {loading && (<svg className="animate-spin w-4 mt-1 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>)}
            {!loading && (isOfferor ? "Rescind" : "Accept")}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}