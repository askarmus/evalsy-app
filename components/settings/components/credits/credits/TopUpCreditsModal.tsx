import { createCheckoutSession } from '@/services/credits.service';
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Card, CardBody, Button, ModalFooter, Chip } from '@heroui/react';

type TopUpCreditsModalProps = {
  modal: ReturnType<typeof useDisclosure>;
};

export const TopUpCreditsModal = ({ modal }: TopUpCreditsModalProps) => {
  const { isOpen, onOpenChange } = modal;

  const packages = [
    {
      credits: 50,
      price: 1000, // $10.00
      description: 'Best for light hiring or quick interview sessions.',
      popular: false,
    },
    {
      credits: 200,
      price: 3500, // $35.00
      description: 'Great value for regular hiring needs and mid-sized teams.',
      popular: true,
    },
    {
      credits: 500,
      price: 7500, // $75.00
      description: 'Ideal for agencies and high-volume hiring pipelines.',
      popular: false,
    },
  ];

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
            <ModalBody>
              {packages.map(({ credits, price, description, popular }) => (
                <Card radius="sm" shadow="sm" key={credits} className="mb-2">
                  <CardBody className="flex flex-row justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{credits} Credits</span>
                        {popular && (
                          <Chip color="success" className="text-white">
                            Popular
                          </Chip>
                        )}
                      </div>
                      <p className="text-sm text-default-500">${(price / 100).toFixed(2)}</p>
                      <p className="text-sm text-default-500">{description}</p>
                    </div>
                    <Button variant="bordered" radius="full" color="success" onPress={() => handleBuy(credits)}>
                      Buy
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </ModalBody>
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
