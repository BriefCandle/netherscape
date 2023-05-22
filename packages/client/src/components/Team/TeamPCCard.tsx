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

export const TeamPCCard = (props:{pc:any, selected: boolean, buttonSelected: boolean}) => {

  const { pc, selected, buttonSelected } = props;


  const handleOffer = () => {
    console.log(selected);
  }

  return (
    <div className={`flex flex-row flex-nowrap p-3 border rounded-md ${selected?"bg-blue-700":"bg-blue-500"} hover:bg-blue-700 select-none transition ease-in-out delay-75`}>
      <div className="avatar">
        <img src={pcIMGs[pc.pcClassID] ?? pc1 } className="w-14" />
      </div>
      <div className="name-lv flex flex-col ml-1 my-auto w-9 overflow-hidden">
        <div className="name text-xl">{ ["alex", "Bob", "Eve"][pc.pcClassID?.substr(65,1) % 3] }</div>
        <div className="level text-sm">Lv.1</div>
      </div>

      <div className="hp-attrs flex flex-col grow ml-3 my-auto">
        <HPBar hp={pc.currentHP} maxHP={pc.maxHP} />
        <div className="flex flex-row justify-between mt-2">
          <div className="attributes text-sm text-red-700 font-bold">ATK: {pc.atk}</div>
          <div className="attributes text-sm text-green-500 font-bold">SPD: {pc.spd}</div>
          <div className="attributes text-sm text-black font-bold">PP: {pc.maxPP}</div>
          <div className="attributes text-sm">
          <button 
              className={`ml-2 px-2 pb-1 flex flex-row my-auto ${buttonSelected?"bg-rose-800":"bg-rose-600"} hover:bg-rose-700 transition ease-in-out delay-75 text-white rounded text-sm font-semibold`}
              onClick={handleOffer}
              >
            Offer
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};
