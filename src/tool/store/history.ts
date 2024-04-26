import { StoreFile, StoreValue } from "../store";

type StoreHistory = {

}

const default_store_history = (): StoreHistory => {
   return {

   }
}

export const store_setting = new StoreValue(StoreFile.History, default_store_history);


