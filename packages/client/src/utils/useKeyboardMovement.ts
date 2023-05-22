import { useEffect } from "react";

export const useKeyboardMovement = (
  trigger: boolean,
  press_up: any,
  press_down: any,
  press_left: any,
  press_right: any,
  press_a: any,
  press_b: any,
  press_start: any
) => {

  useEffect(() => {
    if (trigger) {
      const listener = (e: KeyboardEvent) => {
        if (e.key === "w") {
          press_up();
        }
        if (e.key === "s") {
          press_down();
        }
        if (e.key === "a") {
          press_left();
        }
        if (e.key === "d") {
          press_right();
        }
        if (e.key === "j") {
          press_a();
        }
        if (e.key === "k") {
          press_b();
        }
        if (e.key === "Enter") {
          press_start();
        }
      };
      window.addEventListener("keydown", listener);
      return () => window.removeEventListener("keydown", listener);
    }
  }, [press_up, press_down, press_left, press_right,press_a, press_b, press_start, trigger]);

}