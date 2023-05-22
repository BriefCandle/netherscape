import { useComponentValue } from "@latticexyz/react";
import { SyncState } from "@latticexyz/network";
import { useMUD } from "./MUDContext";
import { GameBoard } from "./GameBoard";
import "./theme/tailwind.css";

export const App = () => {
  const {
    components: { LoadingState },
    network: { singletonEntity },
  } = useMUD();

  // const counter = useComponentValue(Counter, singletonEntity);

  const loadingState = useComponentValue(LoadingState, singletonEntity, {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center" style={{fontFamily: "Joystix" }}>
      {loadingState.state !== SyncState.LIVE  ? (
        <div>
          {loadingState.msg} ({Math.floor(loadingState.percentage)}%)
        </div>
      ) : (
        <GameBoard />
      )}
    </div>
  );
};
