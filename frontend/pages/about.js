import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Layout title="About Us | StoryCollab">
      <Head>
        <meta name="description" content="Learn more about StoryCollab, our mission, and the team behind the collaborative storytelling platform." />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-secondary-900 mix-blend-multiply"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Weaving Stories <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Together</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              StoryCollab is a platform where imagination meets collaboration. We bring writers together to create stories that are greater than the sum of their parts.
            </p>
            <Link href="/register" className="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Join the Community
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto"
        >
          {/* Mission Section */}
          <motion.section variants={itemVariants} className="mb-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              StoryCollab was founded with a simple but powerful mission: to create a space where writers from all backgrounds and skill levels can come together to collaborate on stories that might never exist otherwise. We believe that storytelling is one of humanity's oldest traditions, and we're modernizing it for the digital age.
            </p>
          </motion.section>

          {/* How It Works Cards */}
          <motion.section variants={itemVariants} className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">How StoryCollab Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6 shadow-md">1</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Create</h3>
                  <p className="text-gray-600">Start a new story with a title, description, and opening paragraph. Set the genre and establish the foundation for others to build upon.</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-secondary-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-secondary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6 shadow-md">2</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Collaborate</h3>
                  <p className="text-gray-600">Other writers can contribute to your story with their own paragraphs, taking the narrative in exciting new directions.</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6 shadow-md">3</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Vote</h3>
                  <p className="text-gray-600">Community members vote on contributions to determine which ones become part of the official story, ensuring quality.</p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Story Section */}
          <motion.section variants={itemVariants} className="mb-20">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    StoryCollab began as a passion project by a small team of writers and developers who wanted to create the collaborative writing platform they wished existed. Launched in 2023, our community has grown to include thousands of writers from around the world.
                  </p>
                  <p className="text-lg text-gray-700">
                    What started as an experiment has evolved into a vibrant community where amateur writers can gain confidence, experienced authors can experiment with new ideas, and readers can enjoy stories that evolve in unexpected ways.
                  </p>
                </div>
                <div className="relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-center p-8">
                    <div>
                      <p className="text-5xl font-bold mb-2">10k+</p>
                      <p className="text-xl opacity-80">Stories Created</p>
                      <div className="my-8 border-t border-white/20 w-1/2 mx-auto"></div>
                      <p className="text-5xl font-bold mb-2">50k+</p>
                      <p className="text-xl opacity-80">Contributions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section variants={itemVariants} className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Writing?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're an experienced writer or just starting out, there's a place for you here. Join us and see where the story takes you.
            </p>
            <Link href="/register" className="btn-primary text-lg px-8 py-3 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50">
              Sign Up Now
            </Link>
          </motion.section>
        </motion.div>
      </div>
    </Layout>
  );
}