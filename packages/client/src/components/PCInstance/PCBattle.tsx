import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import { LoadPCImage, PCImageType } from "./LoadPCImage";
import { Entity, getComponentValueStrict } from "@latticexyz/recs";
import { useBlockNumber } from "../../utils/useBlockNumber";
import { spdAdjust } from "../../constant";

// copy from Reinforce/OfferCard.tsx
export const HPBar = (props : {hp : number | undefined, maxHP: number | undefined}) => {

  return (
    <div className="relative">
      <span className="absolute w-full text-black text-xs font-bold justify-center text-center text-white">{props.hp}/{props.maxHP}</span>
      <div className="h-4 w-full overflow-hidden flex rounded-xl bg-gray-300 meter">
        <span
          style={{ width: `${props.hp / props.maxHP * 100}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-black justify-center bg-red-400 transition-all duration-200 ease-in-out`}
        >
        </span>
      </div>
    </div>
  )
}

export const PCAttack = (props: {attackID: string, selected: boolean}) => {
  const { attackID, selected } = props;
  const {
    components: { AttackClass},
    systemCalls: {bytes32ToInteger}
  } = useMUD();
  const attackKey = bytes32ToInteger(attackID);
  const power = getComponentValueStrict(AttackClass, attackKey as Entity).power as number
  const pp = getComponentValueStrict(AttackClass, attackKey as Entity).pp as number
  const crit = getComponentValueStrict(AttackClass, attackKey as Entity).crit as number
  const className = getComponentValueStrict(AttackClass, attackKey as Entity).className as string
  const attackType = getComponentValueStrict(AttackClass, attackKey as Entity).attackType

  return (
    <div className="mx-1 my-1">
    <div className={`${selected? "bg-gray-400" : ""} transition-all duration-200 ease-in-out`}>
    <div className="flex flex-row">
    <div className="flex">
      <div className="font-bold">
          {className} | 
      </div>
      <div className="font-bold mx-1">
          Power:
      </div>
      <div className="ml-2 font-bold text-gray-500 text-right cursor-pointer ">
          {power}
      </div>
    </div>
    <div className="flex mx-2">
      <div className="font-bold">
          Crit: 
      </div>
      <div className="ml-2 font-bold text-gray-500 text-right cursor-pointer ">
        {crit}
      </div>
    </div>
    <div className="flex mx-2">
      <div className="font-bold">
          PP required:
      </div>
      <div className="ml-2 font-bold text-gray-500 text-right cursor-pointer ">
        {pp}
    </div>
    </div>
    </div>
    </div>

    </div>
  )
}

export const PCBattle = (props: {pcID: string, selected: boolean, imageType: PCImageType}) => {
  const {pcID, selected, imageType } = props;

  const {
    components: { PCInstance, PCClass},
    systemCalls: {bytes32ToInteger}
  } = useMUD();

  const pcClassID = useComponentValue(PCInstance, pcID as Entity)?.pcClassID;
  const pcClassName = getComponentValueStrict(PCClass, bytes32ToInteger(pcClassID) as Entity)?.className
  const hp = useComponentValue(PCInstance, pcID as Entity)?.currentHP;
  const maxHP = useComponentValue(PCInstance, pcID as Entity)?.maxHP;
  const startBlock = useComponentValue(PCInstance, pcID as Entity)?.blockStarts;
  const spd = useComponentValue(PCInstance, pcID as Entity)?.spd;
  const maxPP = useComponentValue(PCInstance, pcID as Entity)?.maxPP;
  const attackIDs = useComponentValue(PCInstance, pcID as Entity)?.attackIDs;

  const blockNumber = useBlockNumber();
  if (!blockNumber) return null;
  const blocks = blockNumber - Number(startBlock);

  const pp_accum = spd * blocks / spdAdjust
  const currentPP = pp_accum >= maxPP ? maxPP : pp_accum;

  return (
    <div className="my-auto w-32 ">
    <div className={`flex flex-col rounded-md transition ease-in-out duration-300 ${selected? "bg-gray-400 opacity-75" : ""} `}>
      <div className="mx-auto my-1">
        <LoadPCImage classIndex={pcClassName} imageType={imageType}/>
      </div>
      <div className="my-1 mx-auto w-24 shrink">
        <HPBar hp={hp} maxHP={maxHP} />
      </div>
      <div className="my-2 mx-auto flex">
        <PPLeft currentPP={currentPP} maxPP={maxPP} />
      </div>
    </div>

    </div>
  )
}








const cx = 0;
const cy = 0;
const r = 20;

export const PPLeft = (props: {currentPP: number, maxPP: number}) => {
  const {currentPP, maxPP} = props;

  const remainingPP = maxPP - currentPP;
  const perimeter = 2 * Math.PI * r; // perimeter of the circle, assuming a radius of 50 pixels
  const progress = currentPP / maxPP;
  const filledPerimeter = perimeter * progress;

  const offset = parseInt(2*Math.PI*50*(1-6/100));
  // console.log(offset)


  return (
    <svg className="w-12 h-12" >

        <circle 
          cx="24" 
          cy="24"
          r="20" 
          fill="transparent"
          stroke="currentColor" 
          strokeWidth="6"  
          strokeLinecap="round"
          strokeDasharray={`${filledPerimeter} ${perimeter}`}
          className="text-sky-400"
        ></circle>
        <text x={24} y={24} textAnchor="middle" fill="#0284c7" alignmentBaseline="middle" className="text-md font-bold">{Math.round(currentPP)}</text>
      </svg>
  );
}

