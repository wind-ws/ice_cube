import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { book_data } from "../../tool/sotre/store_book";
import { useEffect, useState, useRef } from "react";
import ComBookCard from "../../component/ComBookCard";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

const PageMyself = () => {
   const [names, _] = useState<string[]>(book_data.store_books.get_all_book_name());

   const ComBookCards = ({ names }: { names: string[] }) => {
      const { isOpen, onOpen, onOpenChange } = useDisclosure();
      const [book_name , set_book_name] = useState("");
      const creat_book = ()=>{
         book_data.store_books.creat_book(book_name);
      }
      return (<div className="w-full">
         {
            names.map((name, index) => <div className="inline-block min-w-[40%] max-w-[40%] mx-[5%] my-2">
               <ComBookCard key={name} names={names} index={index} ></ComBookCard>
            </div>)
         }
         <div className="inline-block min-w-[40%] max-w-[40%] mx-[5%] my-2">
            <Card isPressable fullWidth>
               <CardBody>
                  <Button onPress={onOpen} >创建单词本</Button>
               </CardBody>
            </Card>
         </div>
         <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"center"}>
            <ModalContent>
               {(onClose) => (<>
                  <ModalHeader className="flex flex-col gap-1">新建单词本</ModalHeader>
                  <ModalBody>
                     <Input value={book_name} onValueChange={set_book_name}  type="email" label="单词本名" />
                  </ModalBody>
                  <ModalFooter>
                     <Button onPress={onClose}>取消</Button>
                     <Button color="success" onPress={creat_book}>创建</Button>
                  </ModalFooter>
               </>
               )}
            </ModalContent>
         </Modal>
      </div>)
   }
   return (
      <>
         <div>
            <ComBookCards names={names}></ComBookCards>
         </div>
      </>
   )
}
export default PageMyself;