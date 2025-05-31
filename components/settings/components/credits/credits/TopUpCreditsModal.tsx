import { CreditPackageList } from '@/components/shared/CreditPackageCard';
import { createCheckoutSession } from '@/services/credits.service';
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter } from '@heroui/react';

type TopUpCreditsModalProps = {
  modal: ReturnType<typeof useDisclosure>;
};

export const TopUpCreditsModal = ({ modal }: TopUpCreditsModalProps) => {
  const { isOpen, onOpenChange } = modal;

  const handleBuy = async (credits: number) => {
    try {
      const url = await createCheckoutSession(credits);
      window.location.href = url;
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-xl font-bold">Top Up Credits</ModalHeader>
            <CreditPackageList onBuy={handleBuy} />
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
