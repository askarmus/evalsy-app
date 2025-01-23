import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) => {
  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onClose}
    >
      <ModalContent>
        {() => (
          <>
            {/* Modal Header */}
            <ModalHeader>{title}</ModalHeader>

            {/* Modal Body */}
            <ModalBody>
              <p>{description}</p>
            </ModalBody>

            {/* Modal Footer */}
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {cancelButtonText}
              </Button>
              <Button color="primary" onPress={onConfirm}>
                {confirmButtonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDialog;
