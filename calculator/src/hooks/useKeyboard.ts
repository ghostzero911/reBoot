import { useEffect } from "react";

function useKeyboard(fn: (e: Event) => void) {
  useEffect(() => {
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  });
}

export default useKeyboard