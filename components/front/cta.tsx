import { Button } from "@nextui-org/react";

export default function CTA() {
  return (
    <section className="py-24 px-4 text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">
        Ready to Transform Your Hiring Process?
      </h2>
      <p className="text-xl mb-8">
        Join thousands of companies already using AI Interview Pro to make
        smarter hiring decisions.
      </p>
      <Button size="lg" color="primary">
        Get Started Now
      </Button>
    </section>
  );
}
