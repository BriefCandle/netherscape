import { Entity, getComponentValue } from "@latticexyz/recs";
import { useMUD } from "../../MUDContext";
import pc1 from "../../assets/pokemon/1_front.png";
import pc4 from "../../assets/pokemon/4_front.png";
import { LoadPCImage, PCImageType } from "../PCInstance/LoadPCImage";


const pcIMGs = {
  "0x0000000000000000000000000000000000000000000000000000000000000001" : pc1,
  "0x0000000000000000000000000000000000000000000000000000000000000002" : pc1,
  "0x0000000000000000000000000000000000000000000000000000000000000003" : pc4,
  "0x0000000000000000000000000000000000000000000000000000000000000004" : pc4,
}

export const HPBar = (props : {hp : number, maxHP: number}) => {

  return (
    <div className="relative mt-2">
      <span className="absolute w-full text-white text-xs font-bold justify-center text-center">{props.hp}/{props.maxHP}</span>
      <div className="h-4 w-full overflow-hidden flex rounded-xl bg-gray-300 meter">
        <span
          style={{ width: `${props.hp / props.maxHP * 100}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500`}
        >
          
        </span>
      </div>
    </div>
  )

}

export const TeamPCCard = (props:{pcInstance:any, selected: boolean, buttonSelected: boolean, loading : boolean}) => {

  const { pcInstance, selected, buttonSelected, loading } = props;

  const {
    components: { PCClass },
    network: { playerEntity },
    systemCalls: { pcLoan_offer, addressToBytes32, bytes32ToInteger },
  } = useMUD();

  const pcClass = getComponentValue(PCClass, bytes32ToInteger(pcInstance?.pcClassID) as Entity)
  console.log("classname", pcClass?.className)

  const handleOffer = () => {
    console.log(selected);
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
          <div className="attributes text-xs text-red-700 font-bold flex flex-col">ATK<span className="mx-auto"> {pcInstance.atk}</span></div>
          <div className="attributes text-xs text-green-500 font-bold flex flex-col">SPD <span className="mx-auto">{pcInstance.spd}</span></div>
          <div className="attributes text-xs text-black font-bold flex flex-col">PP <span className="mx-auto">{pcInstance.maxPP}</span></div>
          <div className="attributes text-xs flex">
          <button 
              className={`w-20 ml-2 px-2 pb-1 flex flex-row my-auto ${buttonSelected?"bg-rose-800":"bg-rose-600"} hover:bg-rose-700 transition ease-in-out delay-75 text-white rounded text-sm font-semibold`}
              onClick={handleOffer}
              disabled={loading}
              >
          {loading && (<svg className="animate-spin w-4 mt-1 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>)}
            {!loading && "$Offer"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};
