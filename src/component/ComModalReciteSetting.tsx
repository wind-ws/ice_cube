import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider, Switch } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { store_setting } from "../serve_app/sotre_data/sotre_setting"




type Props = {
   placement: "center" | "auto" | "top" | "top-center" | "bottom" | "bottom-center" | undefined,
   isOpen: boolean,
   onOpenChange: () => void
}


const ComModalReciteSetting = ({ placement, isOpen, onOpenChange }: Props) => {

   const [is_auto_pronunciation, set_is_auto_pronunciation] =
      useState(() => store_setting.value.value.recite.is_auto_pronunciation);
   useEffect(() => {
      store_setting.value.value.recite.is_auto_pronunciation = is_auto_pronunciation;
   }, [is_auto_pronunciation])
   const [is_listen_mode, set_is_listen_mode] =
      useState(() => store_setting.value.value.recite.is_listen_mode);
   useEffect(() => {
      store_setting.value.value.recite.is_listen_mode = is_listen_mode;
   }, [is_listen_mode])
   const [is_auto_show, set_is_auto_show] =
      useState(() => store_setting.value.value.recite.is_auto_show);
   useEffect(() => {
      store_setting.value.value.recite.is_auto_show = is_auto_show;
   }, [is_auto_show])
   const [auto_show_sec, set_auto_show_sec] =
      useState(() => store_setting.value.value.recite.auto_show_sec);
   useEffect(() => {
      store_setting.value.value.recite.auto_show_sec = auto_show_sec;
   }, [auto_show_sec])

   return <Modal
      isOpen={isOpen}
      placement={placement}
      onOpenChange={onOpenChange}
   >
      <ModalContent>
         {(onClose) => (
            <>
               <ModalHeader className="flex flex-col gap-1">Setting</ModalHeader>
               <ModalBody>
                  <Switch isSelected={is_auto_pronunciation} onValueChange={set_is_auto_pronunciation}
                     size="sm">自动发音</Switch>
                  <Switch isSelected={is_listen_mode} onValueChange={set_is_listen_mode}
                     size="sm">听单词模式</Switch>
                  <Switch isSelected={is_auto_show} onValueChange={set_is_auto_show}
                     size="sm">倒计时展开</Switch>
                  {
                     is_auto_show ? <Slider
                        label="设置倒计时时间(秒)"
                        step={1}
                        maxValue={10}
                        minValue={1}
                        value={auto_show_sec}
                        onChange={(v) => Array.isArray(v) ? null : set_auto_show_sec(v)}
                        className="max-w-md"
                     />:<></>
                  }
               </ModalBody>
               <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                     Close
                  </Button>
                  <Button color="success" onPress={onClose}>
                     Save
                  </Button>
               </ModalFooter>
            </>
         )}
      </ModalContent>
   </Modal>
}

export default ComModalReciteSetting