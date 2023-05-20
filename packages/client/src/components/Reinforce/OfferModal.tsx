
import { useMUD } from "../../MUDContext";
import pc1 from "../../assets/pokemon/1_front.png";
import pc2 from "../../assets/pokemon/2_front.png";


const HPBar = (props : {hp : number, maxHP: number}) => {

  return (
    <div className="relative mt-2">
      <span className="absolute w-full text-white text-xs font-bold justify-center text-center">{props.hp}/{props.maxHP}</span>
      <div className="h-4 w-full overflow-hidden flex rounded-xl bg-gray-200 meter">
        <span
          style={{ width: `${props.hp / props.maxHP * 100}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-400`}
        >
          
        </span>
      </div>
    </div>
  )

}
const mockPcInstance = {
  name: "fick dich",
  pcClassID: "0x1234",
  owner: "0x1234...5678",
  hp: 31,
  maxHP: 50,
  atk: 20,
  spd: 35,
  pp:20,
  debtorID:"0x23145673b2e6ede673ccb3b506ac070137448caf",
}
export const OfferCard = (props:{pcInstance : any}) => {

  const pcInstance = props.pcInstance ?? mockPcInstance

  const {
    network: { playerEntity },
  } = useMUD();

  
  return (
  <div className={`flex flex-row mt-2 px-2 pt-2 pb-3 bg-white border-2 border-${pcInstance.pcClassID == "0x1234" ? "green" : "rose"}-600 rounded-lg`}>
    <div className="flex flex-col justify-center items-center">
      <div className="text-lg font-bold w-28"> 
        <img src={pc1} className="w-28" />
      </div>
      <div className="w-full"> <HPBar hp={pcInstance.hp} maxHP={pcInstance.maxHP}/> </div>
    </div>
    <div className="flex flex-col items-center">
      <div className="flex flex-col h-28  my-auto justify-center"> 
        <div className="flex flex-row w-52">
          <div className="font-bold">
              Name:
          </div>
          <div className="ml-3 font-bold text-gray-500 grow text-right">
              {pcInstance.name}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="font-bold">
              Owner:
          </div>
          <div className="ml-2 font-bold text-gray-500 grow text-right cursor-pointer ">
            {pcInstance.owner.substr(0,6)}...{pcInstance.owner.substr(38,42)}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex">
            <div className="font-bold">
                ATK:
            </div>
            <div className="ml-2 font-bold text-gray-500 text-right cursor-pointer ">
              {pcInstance.atk}
            </div>
          </div>
          <div className="flex mx-2">
            <div className="font-bold">
                SPD:
            </div>
            <div className="ml-2 font-bold text-gray-500 text-right cursor-pointer ">
              {pcInstance.atk}
            </div>
          </div>
          <div className="flex mx-2">
            <div className="font-bold">
                PP:
            </div>
            <div className="ml-2 font-bold text-gray-500 text-right cursor-pointer ">
              {pcInstance.atk}
            </div>
          </div>
          
        </div>
      </div>
      <div className="flex mt-3 ml-auto "> 
        <button className="px-2 pb-1 my-auto bg-green-500 hover:bg-green-700 transition ease-in-out delay-75 text-white rounded text-lg font-semibold"> apply </button> 
        {pcInstance.debtorID == playerEntity && (<button className="ml-2 px-2 pb-1 my-auto bg-orange-500 hover:bg-orange-700 transition ease-in-out delay-75 text-white rounded text-lg font-semibold"> finish </button> )}
      </div>
    </div>
  </div>
  )
}