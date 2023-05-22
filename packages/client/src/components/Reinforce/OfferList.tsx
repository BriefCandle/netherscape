import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import {useState} from 'react';
import { useMUD } from "../../MUDContext";
import { OfferCard } from "./OfferCard";
import { OfferModal } from "./OfferModal";

export const OfferList = (props:any) => {

  const [collapsed, setCollapsed] = useState(false);

  const {
    components: { OfferEnabled, PCInstance},
    network: { playerEntity },
    systemCalls: { wrapParcel2Map, crawlBy },
  } = useMUD();

  const offers = useEntityQuery([Has(OfferEnabled), Has(PCInstance)]);
  const pcInstances = offers.map( offer => {return  {...getComponentValueStrict(PCInstance, offer), id:offer };});


  console.log("offers1111111111111111", offers, pcInstances)

  const mockPcInstances = [
    {
      name: "fick dich",
      pcClassID: "0x1234",
      owner: "0x23145673b2e6ede673ccb3b506ac070137448caf",
      hp: 31,
      maxHP: 50,
      atk: 20,
      spd: 35,
      pp:20,
      debtorID:"0x23145673b2e6ede673ccb3b506ac070137448caf",
    },
    {
      name: "fick dich2",
      pcClassID: "0x1235",
      owner: "0x23145673b2e6ede673ccb3b506ac070137448cad",
      hp: 25,
      maxHP: 52,
      atk: 21,
      spd: 30,
      pp:15,
      debtorID:"0x23145673b2e6ede673ccb3b506ac070137448cad",
    },
    {
      name: "fick dich",
      pcClassID: "0x1234",
      owner: "0x23145673b2e6ede673ccb3b506ac070137448cae",
      hp: 11,
      maxHP: 51,
      atk: 25,
      spd: 45,
      pp:25,
      debtorID:"0x23145673b2e6ede673ccb3b506ac070137448cae",
    },
    {
      name: "fick dich",
      pcClassID: "0x1234",
      owner: "0x23145673b2e6ede673ccb3b506ac070137448cae",
      hp: 11,
      maxHP: 51,
      atk: 25,
      spd: 45,
      pp:25,
      debtorID:"0x23145673b2e6ede673ccb3b506ac070137448cae",
    }
  ]

  const handleCollapse = () => {
    setCollapsed(prev=>!prev);
    console.log(collapsed)
  }
 
  return (
  <div className="absolute mx-2 bg-lime-200 text-black rounded-lg" >
    <div className={`p-2 bg-lime-200 text-black rounded-lg overflow-scroll no-scrollbar ${collapsed ? "w-10" : "w-full"} transition-width transition-slowest ease`}  style={{height:604}}>
      <div className="header">
        <span className="text-lg font-bold mr-2 cursor-pointer select-none" onClick={handleCollapse} >{collapsed? "➕" : "—"}</span>
        <span className="text-teal-600 font-bold">Reinforcement</span>
      </div>
      {collapsed ? null : pcInstances.map(pc=>(
        <div className="">
          <OfferCard pcInstance={pc} />
        </div>
      ))}
    </div>
  </div>
  )
}