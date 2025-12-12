import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy | StoryCollab">
      <Head>
        <meta name="description" content="Privacy Policy for StoryCollab. Learn how we collect, use, and protect your data." />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-primary-600 px-8 py-12 text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-primary-100 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-primary-600 hover:prose-a:text-primary-700">
                <p className="lead text-xl text-gray-700 mb-8">
                  Welcome to StoryCollab. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you as to how we look after your personal data when you visit our website 
                  and tell you about your privacy rights and how the law protects you.
                </p>
                
                <h2>1. Introduction</h2>
                <p>
                  This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                </p>

                <h2>2. Data We Collect</h2>
                <p>
                  We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul>
                  <li><strong>Identity Data:</strong> includes username, first name, last name.</li>
                  <li><strong>Contact Data:</strong> includes email address.</li>
                  <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                  <li><strong>Profile Data:</strong> includes your username and password, stories you created, contributions, and votes.</li>
                </ul>

                <h2>3. How We Use Your Data</h2>
                <p>
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul>
                  <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                  <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                  <li>Where we need to comply with a legal or regulatory obligation.</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                </p>

                <h2>5. Your Legal Rights</h2>
                <p>
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                </p>

                <h2>6. Contact Us</h2>
                <p>
If you have any questions about this privacy policy or our privacy practices, please contact us via our <Link href="/contact" className="text-primary-600 hover:text-primary-700">Contact page</Link>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
