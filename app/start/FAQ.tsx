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

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative overflow-hidden bg-darkbase-sec py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="  text-center lg:mx-0 mb-8">
          <h2 id="faq-title" className="font-display text-4xl font-bold text-white sm:text-4xl">
            What people are saying about us.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">If you cant find what you are looking for, email our support team.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion variant="splitted" className="text-white">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                title={item.question}
                className="bg-darkbase   rounded-xl px-6 shadow-sm"
                classNames={{
                  title: 'text-white', // ✅ this changes the title color
                  trigger: 'text-white', // optional: if you want the chevron icon to be white too
                }}
              >
                <p className="text-white">{item.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
