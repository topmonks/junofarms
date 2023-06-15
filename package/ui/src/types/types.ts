export interface ClickEvent {
  type: "click";
  x: number;
  y: number;
}

export interface HoverEvent {
  type: "hover";
  x: number;
  y: number;
}

export interface LeaveEvent {
  type: "leave";
}

export type Event = ClickEvent | HoverEvent | LeaveEvent;
