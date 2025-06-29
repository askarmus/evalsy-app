'use client';

import { Accordion, AccordionItem, Button, Chip, cn } from '@heroui/react';
import { HelpCircle } from 'lucide-react';
import { FaArrowRight, FaCheckDouble, FaSortAlphaDownAlt } from 'react-icons/fa';

const faqData = [
  {
    question: 'What is Evalsy and how does it work?',
    answer: 'Evalsy is an AI-powered video interviewing platform that automates candidate screening, analysis, and hiring decisions using real-time conversational AI.',
  },
  {
    question: 'How does the AI interviewing process work?',
    answer: 'Candidates record their responses to AI-led questions, where natural language processing and behavioral analytics evaluate their performance.',
  },
  {
    question: 'Is Evalsy suitable for companies of all sizes?',
    answer: 'Yes, from startups to large enterprises, our scalable AI interview solution supports any hiring volume.',
  },
  {
    question: 'How does Evalsy reduce bias and ensure fairness?',
    answer: 'Our platform uses standardized scoring algorithms and objective data to evaluate each candidate fairly, without the influence of unconscious bias.',
  },
  {
    question: 'What roles can Evalsy help recruit for?',
    answer: 'Evalsy can support hiring for a wide range of roles, from customer support to technical positions, or any job that requires interview-based screening.',
  },
  {
    question: 'How does credit-based pricing work?',
    answer: 'Credits are used for interviews, with one credit covering a five-minute AI video interview. They never expire and offer flexible usage.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="  text-center lg:mx-0 mb-8">
          <h2 className="   text-4xl font-semibold  sm:text-4xl text-[#262626] text-center mb-5">
            Frequently Asked <span className="gradients-primary-2-text-hard">Questions</span>
          </h2>
          <p className="mt-4 text-lg tracking-tighter">If you cant find what you are looking for, email our support team.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion variant="splitted" className="w-full space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem indicator={<FaArrowRight className="text-gray-900" />} key={index} title={<span className="text-black">{item.question}</span>} className=" text-black  shadow-2xl rounded-2xl bg-white px-6 font-semibold hover:no-underline">
                <p>{item.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
