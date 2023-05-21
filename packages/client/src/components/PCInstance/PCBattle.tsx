import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import { LoadPCImage, PCImageType } from "./LoadPCImage";
import { Entity, getComponentValueStrict } from "@latticexyz/recs";
import { useBlockNumber } from "../../utils/useBlockNumber";
import { spdAdjust } from "../../constant";

// copy from Reinforce/OfferCard.tsx
export const HPBar = (props : {hp : number | undefined, maxHP: number | undefined}) => {

  return (
    <div className="relative mt-2">
      <span className="absolute w-full text-black text-xs font-bold justify-center text-center">{props.hp}/{props.maxHP}</span>
      <div className="h-4 w-full overflow-hidden flex rounded-xl bg-gray-200 meter">
        <span
          style={{ width: `${props.hp / props.maxHP * 100}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-black justify-center bg-red-400`}
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
    <>
    <div className={`${selected? "selected" : ""}`}>
    <div className="flex flex-row">
    <div className="flex">
      <div className="font-bold">
          {className} | 
      </div>
      <div className="font-bold">
          Power:
      </div>
      <div className="ml-2 font-bold text-gray-500 text-right cursor-pointer ">
          {power}
      </div>
    </div>
    <div className="flex mx-2">
      <div className="font-bold">
          crit: 
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
    <style>
      {`
      // .pc-battle {
      //   display: flex;
      //   align-items: center;
      //   flex-direction: column;
      //   margin: 5px;
      //   color: black;
      //   font-size: 12px;
      // }
      .selected {
        color: #ffd700;
        background-color: #585858;
      }
      `}
    </style>
    </>
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
    <>
    <div className={`pc-battle ${selected? "selected" : ""}`}>
      <div className="pc-pic">
        <LoadPCImage classIndex={pcClassName} imageType={imageType}/>
      </div>
      <HPBar hp={hp} maxHP={maxHP} />
      <PPLeft currentPP={currentPP} maxPP={maxPP} />
    </div>
    <style>
      {`
      .pc-battle {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 5px;
        color: black;
        font-size: 12px;
      }
      .selected {
        color: #ffd700;
        background-color: #585858;
      }
      `}
    </style>
    </>
  )
}

const cx = 30;
const cy = 30;
const r = 15;

export const PPLeft = (props: {currentPP: number, maxPP: number}) => {
  const {currentPP, maxPP} = props;

  const remainingPP = maxPP - currentPP;
  const perimeter = 2 * Math.PI * r; // perimeter of the circle, assuming a radius of 50 pixels
  const progress = currentPP / maxPP;
  const filledPerimeter = perimeter * progress;


  return (
    <svg width="100" height="100" >
      <circle cx={cx} cy={cy} r={r} stroke="#ccc" strokeWidth="2" fill="none" />
      <circle cx={cx} cy={cy} r={r} stroke="green" strokeWidth="3" strokeDasharray={`${filledPerimeter} ${perimeter}`} transform={`rotate(-90 ${cx} ${cy})`} fill="none" />
      <text x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" fontSize="10">{Math.round(currentPP)}</text>
    </svg>
  );
}

