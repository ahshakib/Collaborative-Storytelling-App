import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Cookies() {
  const sections = [
    {
      title: 'What Are Cookies?',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <>
          <p className="mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
          <p>
            Cookies help us understand how you use our site, remember your preferences, and improve your overall experience on StoryCollab.
          </p>
        </>
      )
    },
    {
      title: 'How We Use Cookies',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <>
          <p className="mb-4">We use cookies for the following purposes:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li><strong className="text-gray-900">Authentication:</strong> To keep you logged in and remember your session across pages</li>
            <li><strong className="text-gray-900">Preferences:</strong> To remember your settings and personalization choices</li>
            <li><strong className="text-gray-900">Security:</strong> To protect your account and detect fraudulent activity</li>
            <li><strong className="text-gray-900">Analytics:</strong> To understand how users interact with our platform and improve our services</li>
            <li><strong className="text-gray-900">Performance:</strong> To ensure the site loads quickly and works properly</li>
          </ul>
        </>
      )
    },
    {
      title: 'Types of Cookies We Use',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">1. Essential Cookies (Required)</h4>
            <p className="text-gray-600">
              These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and accessibility. The website cannot function properly without these cookies.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">2. Performance Cookies</h4>
            <p className="text-gray-600">
              These cookies collect information about how you use our website, such as which pages you visit most often. This data helps us optimize our platform and improve user experience.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">3. Functionality Cookies</h4>
            <p className="text-gray-600">
              These cookies allow the website to remember choices you make (such as your username or language) and provide enhanced, personalized features.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">4. Analytics Cookies</h4>
            <p className="text-gray-600">
              We use analytics cookies to understand how visitors interact with our website. This helps us analyze traffic patterns, track errors, and improve our services.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Third-Party Cookies',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      content: (
        <>
          <p className="mb-4">
            In addition to our own cookies, we may use various third-party cookies to report usage statistics and deliver personalized content. These may include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Google Analytics for website traffic analysis</li>
            <li>Social media cookies if you share our content</li>
            <li>Authentication providers (if using social login)</li>
          </ul>
          <p className="mt-4 text-gray-600">
            These third parties may use cookies to track your activity across different websites. Please refer to their respective privacy policies for more information.
          </p>
        </>
      )
    },
    {
      title: 'Managing Your Cookie Preferences',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: (
        <>
          <p className="mb-4">
            You have several options to manage cookies:
          </p>
          <div className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">Browser Settings</h4>
              <p className="text-gray-600 text-sm">
                Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. However, if you block or delete cookies, some features of our website may not function properly.
              </p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">Opt-Out</h4>
              <p className="text-gray-600 text-sm">
                You can opt out of certain third-party cookies by visiting the third party&apos;s website and following their opt-out instructions. For analytics cookies, you can use browser extensions or the third party&apos;s opt-out tools.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Please note: Disabling cookies may impact your experience on StoryCollab and limit the functionality available to you.
          </p>
        </>
      )
    },
    {
      title: 'Cookie Retention',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <>
          <p className="mb-4">
            Cookies are stored on your device for different periods of time:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li><strong className="text-gray-900">Session Cookies:</strong> Deleted automatically when you close your browser</li>
            <li><strong className="text-gray-900">Persistent Cookies:</strong> Remain on your device until they expire or you delete them manually</li>
            <li><strong className="text-gray-900">Authentication Tokens:</strong> Typically last 30 days or until you log out</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <Layout title="Cookie Policy - StoryCollab">
      <Head>
        <title>Cookie Policy - StoryCollab</title>
        <meta name="description" content="Learn about how StoryCollab uses cookies to improve your experience and protect your privacy." />
      </Head>

      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block p-3 bg-white/10 rounded-full mb-6">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Learn how we use cookies to enhance your experience on StoryCollab
            </p>
            <p className="text-sm text-primary-200 mt-4">
              Last updated: November 21, 2024
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-12"
          >
            <p className="text-gray-700">
              <strong className="text-gray-900">Quick Summary:</strong> We use cookies to keep you logged in, remember your preferences, analyze how you use our site, and improve your experience. Essential cookies are required for the site to work, while others help us make StoryCollab better for you.
            </p>
          </motion.div>

          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mr-4">
                  {section.icon}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <div className="text-gray-700 leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us About Cookies</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about how we use cookies or our cookie policy, please don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary inline-block text-center">
                Contact Support
              </Link>
              <Link href="/privacy" className="btn-outline inline-block text-center">
                Privacy Policy
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500"
          >
            <p>
              By continuing to use StoryCollab, you consent to our use of cookies as described in this policy.
              <br />
              This policy may be updated from time to time. Please check back regularly for any changes.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
