import { motion } from 'framer-motion';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function TermsOfService() {
  return (
    <Layout title="Terms of Service | StoryCollab">
      <Head>
        <meta name="description" content="Terms of Service for StoryCollab. Read our user agreement and content policies." />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-gray-800 px-8 py-12 text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-gray-300 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-primary-600 hover:prose-a:text-primary-700">
                <p className="lead text-xl text-gray-700 mb-8">
                  Please read these Terms of Service carefully before using the StoryCollab website operated by us.
                </p>
                
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using StoryCollab, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>

                <h2>2. User Conduct</h2>
                <p>
                  You agree to use the website only for lawful purposes. You are prohibited from posting on or transmitting through the website any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, sexually explicit, profane, hateful, racially, ethnically, or otherwise objectionable of any kind.
                </p>

                <h2>3. Intellectual Property</h2>
                <p>
                  <strong>Your Content:</strong> You retain ownership of the stories and contributions you create. However, by posting content on StoryCollab, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                </p>
                <p>
                  <strong>Collaborative Works:</strong> For stories created collaboratively, all contributors grant a license to the story creator and other contributors to use their contributions within the context of that specific story.
                </p>

                <h2>4. Account Security</h2>
                <p>
                  You are responsible for maintaining the confidentiality of your login credentials and are fully responsible for all activities that occur under your account. You agree to immediately notify us of any unauthorized use, or suspected unauthorized use of your account or any other breach of security.
                </p>

                <h2>5. Termination</h2>
                <p>
                  We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h2>6. Limitation of Liability</h2>
                <p>
                  In no event shall StoryCollab, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>

                <h2>7. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
                </p>
                
                <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mt-0">Questions?</h3>
                  <p className="mb-0">
                    If you have any questions about these Terms, please <a href="/contact">contact us</a>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
