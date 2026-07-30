'use client'

import { useState } from 'react'

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is IIPEC?',
      answer: 'IIPEC (International Institute of Prison & Evangelical Chaplaincy) is a movement equipping chaplains to serve with excellence and compassion worldwide.',
    },
    {
      question: 'How can I become a member?',
      answer: 'You can become a member by registering on our website. Simply click the "Register" button and fill in your details to create an account.',
    },
    {
      question: 'What programs do you offer?',
      answer: 'We offer comprehensive chaplain training programs including Prison Chaplaincy, Evangelical Outreach, Pastoral Counseling, and general Chaplain Training.',
    },
    {
      question: 'How can I support the ministry?',
      answer: 'You can support us through donations, partnerships, volunteering, or sponsoring a chaplain in training. Visit our Support page for more details.',
    },
    {
      question: 'Where are you located?',
      answer: 'We have operations across Nigeria with our headquarters in Lagos. We also have a growing presence across Africa and worldwide.',
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="section-padding">
      <div className="container-custom max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 mb-12">
          Find answers to common questions about IIPEC.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <button
                className="w-full p-6 text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-primary">{faq.question}</span>
                <span className="text-2xl text-accent">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}