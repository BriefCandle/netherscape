import { useMUD } from "../../MUDContext";
import { getComponentValue } from "@latticexyz/recs";
import pc1 from "../../assets/pokemon/1_front.png";
import pc4 from "../../assets/pokemon/4_front.png";


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
    components: { PCLoan, CommandedBy },
    network: { playerEntity },
  } = useMUD();

  const pcLoan = getComponentValue(PCLoan, pcInstance.id);
  // console.log("pcloan", pcLoan);
  const owner = getComponentValue(CommandedBy, pcInstance.id)?.value.substr(26,64);
  
  return (
  <div className={`flex flex-row mt-2 pl-2 pr-3 pt-1 pb-3 bg-white border-2 ${pcInstance.pcClassID == "0x1234" ? "border-green-500" : "border-rose-400"} rounded-lg`}>
    <div className="flex flex-col justify-center items-center">
      <div className="text-lg font-bold w-28"> 
        <img src={ pcInstance.pcClassID == "0x0000000000000000000000000000000000000000000000000000000000000004" ? pc4 : pc1 } className="w-28" />
      </div>
      <div className="w-full"> <HPBar hp={pcInstance.currentHP} maxHP={pcInstance.maxHP}/> </div>
    </div>
    <div className="flex flex-col items-center">
      <div className="flex flex-col h-28  my-auto justify-center "> 
        <div className="flex flex-row w-52  mt-3">
          <div className="font-bold">
              Name:
          </div>
          <div className="ml-3 font-bold text-gray-500 grow text-right">
              {/* {pcInstance.name} */}
              Good Boy
          </div>
        </div>
        <div className="flex flex-row">
          <div className="font-bold">
              Owner:
          </div>
          <div className="ml-2 font-bold text-gray-500 grow text-right cursor-pointer ">
            0x{owner.substr(0,4)}...{owner.substr(36,40)}
          </div>
        </div>
        <div className="flex flex-row mt-1">
          <div className="flex text-red-600">
            <div className="font-bold">
                ATK:
            </div>
            <div className="ml-2 font-bold text-right cursor-pointer ">
              {pcInstance.atk}
            </div>
          </div>
          <div className="flex mx-2 text-cyan-600">
            <div className="font-bold">
                SPD:
            </div>
            <div className="ml-2 font-bold text-right cursor-pointer ">
              {pcInstance.spd}
            </div>
          </div>
          <div className="flex mx-2">
            <div className="font-bold">
                PP:
            </div>
            <div className="ml-2 font-bold text-right cursor-pointer ">
              {pcInstance.maxPP}
            </div>
          </div>
          
        </div>
      </div>
      <div className="flex mt-3 ml-auto "> 
        <button className="px-2 pb-1 my-auto bg-green-500 hover:bg-green-700 transition ease-in-out delay-75 text-white rounded text-lg font-semibold"> Apply </button> 
        {pcLoan?.debtorID == playerEntity && (<button className="ml-2 px-2 pb-1 my-auto bg-orange-500 hover:bg-orange-700 transition ease-in-out delay-75 text-white rounded text-lg font-semibold"> Finish </button> )}
      </div>
    </div>
  </div>
  )
}