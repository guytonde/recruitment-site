'use client';

import { useState } from 'react';

const FAQS = [
  {
    question: 'Do I need prior experience?',
    answer: 'No! We welcome students of all experience levels. We have mentors to help you learn and grow.'
  },
  {
    question: 'What majors can apply?',
    answer: 'Any major! We need Mechanical, Electrical, Computer, Physics, Materials, and more. All disciplines welcome.'
  },
  {
    question: 'What year can I apply?',
    answer: 'Freshman through Senior. We recruit every year and value members at every level.'
  },
  {
    question: 'How much time commitment is required?',
    answer: 'It varies by role and season. Average is 10-15 hours per week during the academic year, more during competition season.'
  },
  {
    question: 'Can I be on multiple teams?',
    answer: 'You can apply to up to 3 systems across teams. We match you based on skills and team needs.'
  },
  {
    question: 'When is the application deadline?',
    answer: 'Check the recruitment timeline on the homepage. Applications typically open in Fall and Spring.'
  },
  {
    question: 'What happens after I submit my application?',
    answer: 'Our team reviews all applications, conducts interviews, and makes final decisions within 2-3 weeks.'
  },
  {
    question: 'Can I interview for multiple teams?',
    answer: 'Yes! If you apply to multiple teams and get selected, you can interview with each one.'
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-12">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left font-bold text-lg hover:bg-gray-800 transition flex justify-between items-center"
              >
                <span>{faq.question}</span>
                <span className={`transform transition ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-950 border-t border-gray-800 text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
          <p className="text-gray-400 mb-4">
            Have a question that isn't answered here?
          </p>
          <a 
            href="mailto:recruitment@example.com"
            className="text-teal-400 hover:text-teal-300 font-bold"
          >
            Contact us at recruitment@example.com
          </a>
        </div>
      </div>
    </div>
  );
}
