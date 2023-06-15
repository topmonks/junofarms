import { useEffect } from "react";
import { Event } from "../types/types";

const listener = new EventTarget();

export function dispatchEvent(type: Event["type"], detail: any) {
  listener.dispatchEvent(new CustomEvent(type, { detail }));
}

export default function useCanvasBridge(type: Event["type"], fn: any) {
  useEffect(() => {
    listener.addEventListener(type, fn);

    return () => {
      listener.removeEventListener(type, fn);
    };
  }, [type, fn]);
}
