import React from 'react';
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import {IRole} from '../models/IRole';
import { EditUserRoleForm } from '../components/admin-panel/EditUserRoleForm';
import {EditOrderStatusForm} from "../components/admin-panel/EditOrderStatusForm";

interface SettingsModalProps {
    roles: IRole[],
    isOpen: boolean,
    onClose: () => void,
    onEditUserRole: (values: any) => void,
    onEditOrderStatus: (values: any) => void,
}

const SettingsModal = ({
                           roles,
                           isOpen,
                           onClose,
                           onEditUserRole,
                           onEditOrderStatus
                       }: SettingsModalProps) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.4)'}}/>
            <ModalContent borderRadius='2xl' minW='500px' maxW='600px'>
                <ModalHeader>Настройки</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Tabs variant='soft-rounded' colorScheme='gray'>
                        <TabList flexWrap='wrap'>
                            <Tab>Права пользователя</Tab>
                            <Tab>Изменение статуса заказа</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                               <EditUserRoleForm roles={roles} onEditUserRole={onEditUserRole} onClose={onClose}/>
                            </TabPanel>
                            <TabPanel>
                                <EditOrderStatusForm roles={roles} onEditOrderStatus={onEditOrderStatus} onClose={onClose}/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SettingsModal;