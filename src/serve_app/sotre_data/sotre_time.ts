import { Store } from "@tauri-apps/plugin-store";
import { StoreFile } from "../store";



const default_key = StoreFile.Time;
const store = new Store(StoreFile.Time);


type StoreTime = {
   
}

export const store_time: {
   value: {},
} = {
   value: {}
}
