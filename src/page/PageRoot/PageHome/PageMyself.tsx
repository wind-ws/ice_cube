import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import ComBookCard from "../../../component/ComBookCard";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { translate_text_url } from "../../../serve_app/translation";
import { fetch } from '@tauri-apps/plugin-http';

const PageMyself = () => {
   const navigate = useNavigate();


   return (
      <>
         <div>

         </div>
      </>
   )
}
export default PageMyself;