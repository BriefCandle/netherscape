# netherscape
<img width="1630" alt="netherscape_hackathon2" src="https://github.com/BriefCandle/netherscape/assets/47695827/762bed17-6414-401a-9165-395ac28339ce">

The above entity-functionality is followed and to be completed.

### Branch
The most current version is on the playerName branch (as of May 27 2023). We will force push it to the main branch soon. 

To try this project, ``pnpm install`` and then ``pnpm run dev``

The final version is currently under development with more mechanisms being added.


## Overview
This is a project dedicated to the AW hackathon 2023, demonstrating what can be completed using mud v2. To make a full, finalized game, published onchain, more works need to be done.

Three main features being built here:
1) torus-shape map for players to crawl
2) block-based battle 
3) reinforcement = loan


## Map - Parcel - Terrain for players to crawl
Netherscape's map is composed of 32x32 parcels, each of which is composed of 5x5 terrain types. 

### Map   
When deployed, a 32x32 matrix with uint8 as cell is stored in MapConfig table. The matrix is pre-computed using maze-generation code with python. 

### Parcel
There are 10 main parcel types and 9 accessory parcel types. Parcel type is defined in accordance with its boundary types. For example, if a parcel has boundary on top and left, its type name is LEFTUP. 

To make the map to appear more dynamic, more accessory parcel types can be introduced. For example, there could be many different types of LEFTUP.

CUSTOMIZED parcel type is reserved to record any change on the parcel. It means that during the game, if a player changes a terrain value on the parcel, its parcel type is changed to "CUSTOMIZED" with new terrain values being stored with key being the hash of the parcel coordinate.

### Terrain
There are two categoris of terrain types, 1) view, and 2) obstruction. A third type, such as buildings, can be added in future work: 3) functional.

## Commandable Playable Characters (PC)
A PC instance is spawned using its PC class as the template. 

### PC Class
The class template for a playable character, specifying battle stats, such as maxHP. It is worth nothing that each PC class defines two attackIDs for a PC to use.

### PC Instance
The PC instance inherits all of its class template's battle stats, but it is open for players and game mechanisms to change each stats individually. Each PC instance also has attributes such as blockstarts and currentHP to be used in battle 

## Block-Based Battle
A player may initiates a battle against another player by calling siege(): any other playing moving on the same parcel will enter battle with player.

During battle, each PC accumulates energy to spend on attacks on opponent PCs. Some PC accumulates PP faster, some has higher max PP cap. Some attack class consumes higher PP, but they will also have higher crit chance or higher normal damage. 

## Reinforcement = Loan
During battle or not, a player can always check on the loan market to find other players' offers as reinforcement to be added into his team. 

### Collateral

### Interest

### Blocks 
For reinforcement to arrive, there is a traveling time, measured in blocks, calculated by the distance between players divided by a traveling speed constant.

## Future Work
More work needs to be done because the current rule sets isn't enough to support an autonmous world. 

Stay tuned. 
