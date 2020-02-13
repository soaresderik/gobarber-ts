import { History, LocationState } from "history";

export interface GlobalProps {
  history?: History<LocationState>;
}
