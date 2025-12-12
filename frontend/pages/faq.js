import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../components/Layout';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'What is StoryCollab?',
          answer: 'StoryCollab is a collaborative storytelling platform where writers from around the world can create stories together. You can start your own story or contribute to existing ones, with the community voting on the best contributions.'
        },
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the navigation bar, fill in your email, username, and password, and you\'re ready to start writing! It\'s completely free to join.'
        },
        {
          question: 'Is StoryCollab free to use?',
          answer: 'Yes! StoryCollab is completely free. You can create unlimited stories, contribute to as many stories as you like, and participate in the community without any cost.'
        }
      ]
    },
    {
      category: 'Creating Stories',
      questions: [
        {
          question: 'How do I start a new story?',
          answer: 'Once logged in, click "Create Story" in the navigation. Fill in your story title, description, genre, and write your opening paragraph. You can also set whether your story is public or private.'
        },
        {
          question: 'Can I edit my story after publishing?',
          answer: 'Yes! As the story creator, you can edit your story\'s title, description, and opening content at any time from your dashboard.'
        },
        {
          question: 'What genres are supported?',
          answer: 'We support a wide range of genres including Fantasy, Science Fiction, Mystery, Romance, Horror, Adventure, Historical Fiction, and more. You can select the genre that best fits your story.'
        },
        {
          question: 'Can I make my story private?',
          answer: 'Yes, you can set your story as private when creating it. Private stories are only visible to you and won\'t appear in public listings.'
        }
      ]
    },
    {
      category: 'Contributing',
      questions: [
        {
          question: 'How do I contribute to a story?',
          answer: 'Browse available stories, select one you\'re interested in, and click "Add Your Contribution." Write your continuation and submit it for community voting.'
        },
        {
          question: 'How does the voting system work?',
          answer: 'Community members can upvote or downvote contributions. The contribution with the most votes typically becomes the canonical continuation of the story. Story creators have the final say on which contributions to accept.'
        },
        {
          question: 'Can I edit my contribution after submitting?',
          answer: 'Yes, you can edit your contribution before it\'s accepted by the story creator. Once a contribution is accepted and becomes part of the official story, it cannot be edited.'
        },
        {
          question: 'Is there a limit to how many contributions I can make?',
          answer: 'No! You can contribute to as many stories as you like. However, you can only have one pending contribution per story at a time.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      questions: [
        {
          question: 'How do I update my profile?',
          answer: 'Click on your username in the navigation bar and select "Profile." From there, you can update your bio, profile picture, and other information.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account from the profile settings. Please note that this action is permanent and your stories and contributions will be removed.'
        },
        {
          question: 'I forgot my password. What should I do?',
          answer: 'Click "Login" and then "Forgot Password." Enter your email address and we\'ll send you instructions to reset your password.'
        }
      ]
    },
    {
      category: 'Community & Safety',
      questions: [
        {
          question: 'What are the community guidelines?',
          answer: 'We expect all users to be respectful, avoid plagiarism, and refrain from posting offensive or inappropriate content. Stories and contributions that violate our terms may be removed.'
        },
        {
          question: 'How do I report inappropriate content?',
          answer: 'Each story and contribution has a report button. Click it to flag content for review by our moderation team. We take all reports seriously.'
        },
        {
          question: 'Can I collaborate with specific writers?',
          answer: 'While our platform is designed for open collaboration, you can make your story private and share it with specific users if you prefer working with a select group.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          question: 'The site isn\'t loading properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, or try accessing the site in an incognito/private window. If the problem persists, contact our support team.'
        },
        {
          question: 'Which browsers are supported?',
          answer: 'StoryCollab works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser up to date for the best experience.'
        },
        {
          question: 'Can I use StoryCollab on mobile?',
          answer: 'Yes! Our platform is fully responsive and works on mobile devices. You can read and contribute to stories from your phone or tablet.'
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <Layout title="FAQ - StoryCollab">
      <Head>
        <title>Frequently Asked Questions - StoryCollab</title>
        <meta name="description" content="Find answers to common questions about StoryCollab, collaborative storytelling, and how to use our platform." />
      </Head>

      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-100 text-center max-w-2xl mx-auto"
          >
            Find answers to common questions about StoryCollab
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <motion.div 
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const currentIndex = globalIndex++;
                  return (
                    <div 
                      key={questionIndex}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleFAQ(currentIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        <svg 
                          className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform ${openIndex === currentIndex ? 'transform rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {openIndex === currentIndex && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4 text-gray-600 border-t border-gray-100"
                        >
                          <p className="pt-4">{faq.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <Link href="/contact" className="btn-primary inline-block">
            Contact Support
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
