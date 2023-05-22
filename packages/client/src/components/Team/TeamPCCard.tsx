import pc1 from "../../assets/pokemon/1_front.png";
import pc4 from "../../assets/pokemon/4_front.png";


const pcIMGs = {
  "0x0000000000000000000000000000000000000000000000000000000000000001" : pc1,
  "0x0000000000000000000000000000000000000000000000000000000000000002" : pc1,
  "0x0000000000000000000000000000000000000000000000000000000000000003" : pc4,
  "0x0000000000000000000000000000000000000000000000000000000000000004" : pc4,
}

const HPBar = (props : {hp : number, maxHP: number}) => {

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

export const TeamPCCard = (props:{pc:any, selected: boolean, buttonSelected: boolean, loading : boolean}) => {

  const { pc, selected, buttonSelected, loading } = props;


  const handleOffer = () => {
    console.log(selected);
  }

  return (
    <div className={`flex flex-row flex-nowrap p-3 border rounded-md ${selected?"bg-blue-700":"bg-blue-500"} hover:bg-blue-700 select-none transition ease-in-out delay-75`}>
      <div className="avatar flex">
        <img src={pcIMGs[pc.pcClassID] ?? pc1 } className="w-20 my-auto" />
      </div>
      <div className="name-lv flex flex-col ml-1 my-auto w-14 overflow-hidden">
        <div className="name text-lg">{ ["alex", "Bob", "Eve"][pc.pcClassID?.substr(65,1) % 3] }</div>
        <div className="level text-xs">Lv.1</div>
      </div>

      <div className="hp-attrs flex flex-col grow ml-3 my-auto">
        <HPBar hp={pc.currentHP} maxHP={pc.maxHP} />
        <div className="flex flex-row justify-between mt-2">
          <div className="attributes text-xs text-red-700 font-bold flex flex-col">ATK<span className="mx-auto"> {pc.atk}</span></div>
          <div className="attributes text-xs text-green-500 font-bold flex flex-col">SPD <span className="mx-auto">{pc.spd}</span></div>
          <div className="attributes text-xs text-black font-bold flex flex-col">PP <span className="mx-auto">{pc.maxPP}</span></div>
          <div className="attributes text-xs flex">
          <button 
              className={`w-20 ml-2 px-2 pb-1 flex flex-row my-auto ${buttonSelected?"bg-rose-800":"bg-rose-600"} hover:bg-rose-700 transition ease-in-out delay-75 text-white rounded text-sm font-semibold`}
              onClick={handleOffer}
              disabled={loading}
              >
          {loading && (<svg class="animate-spin w-4 mt-1 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>)}
            {!loading && "Offer"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};
