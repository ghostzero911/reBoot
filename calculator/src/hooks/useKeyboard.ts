import { useEffect } from "react";

function useKeyboard(fn: (e: KeyboardEvent) => void) {
  useEffect(() => {
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  });
}

export default useKeyboard