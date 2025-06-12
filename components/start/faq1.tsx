'use client';

import { Accordion, AccordionItem, Button, Chip, cn } from '@heroui/react';
import { HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: 'What is Evalsy and how does it work?',
    answer: 'Evalsy is an AI-powered recruitment platform that automates candidate screening, conducts intelligent interviews, and provides data-driven insights to help you hire the best talent faster.',
  },
  {
    question: 'How does the AI interviewing process work?',
    answer: 'Our AI conducts initial interviews via text or voice, asking role-specific questions and follow-ups based on candidate responses.',
  },
  {
    question: 'Is Evalsy suitable for all company sizes?',
    answer: 'Yes, Evalsy is designed to scale for startups to enterprises, adapting to your recruitment workflow.',
  },
  {
    question: 'How does Evalsy ensure fairness and reduce bias in hiring?',
    answer: 'Evalsy uses objective data like skills and performance and supports anonymized screening to reduce bias.',
  },
  {
    question: 'What kind of roles can Evalsy help recruit for?',
    answer: 'Evalsy supports roles across industries, including tech, marketing, sales, and support — with customizable assessments.',
  },
  {
    question: 'How does the credit-based pricing work?',
    answer: 'You buy credits for actions like screenings or interviews. Credits don’t expire, and a free trial includes complimentary credits.',
  },
];

export function FaqHeroSection() {
  return (
    <section id="pricing" className="bg-darkbase-sec py-20 sm:py-32  ">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Chip className="mb-4 md:mb-6 py-1 px-2 md:py-1.5 md:px-3 text-xs font-medium border-primary/30 bg-primary/10 text-white mx-auto lg:mx-0"> Frequently Asked Questions</Chip>

          <h2 className="font-display text-4xl font-bold  tracking-tight text-white sm:text-4xl mt-4">How AI Interviewer Works</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion variant="splitted">
            {faqData.map((item, index) => (
              <AccordionItem key={index} title={item.question} className="border border-default-200 rounded-xl shadow-sm">
                <p className="text-default-500 text-base">{item.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
