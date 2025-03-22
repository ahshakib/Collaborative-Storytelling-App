import Head from 'next/head';
import Layout from '../components/Layout';

export default function AboutUs() {
  return (
    <Layout title="About Us | StoryCollab">
      <Head>
        <meta name="description" content="Learn more about StoryCollab, our mission, and the team behind the collaborative storytelling platform." />
      </Head>

      <div className="bg-gradient-to-b from-primary-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About StoryCollab
            </h1>
            <p className="text-xl text-gray-600">
              Bringing writers together to create amazing stories
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              StoryCollab was founded with a simple but powerful mission: to create a space where writers from all backgrounds and skill levels can come together to collaborate on stories that might never exist otherwise.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We believe that storytelling is one of humanity's oldest and most important traditions. Stories help us make sense of the world, connect with others, and imagine new possibilities. By enabling collaborative storytelling, we're helping to keep this tradition alive in the digital age.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How StoryCollab Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">Create</h3>
                <p className="text-gray-600">Start a new story with a title, description, and opening paragraph. Set the genre and establish the foundation for others to build upon.</p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
                <p className="text-gray-600">Other writers can contribute to your story with their own paragraphs, taking the narrative in exciting new directions.</p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">Vote</h3>
                <p className="text-gray-600">Community members vote on contributions to determine which ones become part of the official story, ensuring quality and coherence.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 mb-4">
              StoryCollab began as a passion project by a small team of writers and developers who wanted to create the collaborative writing platform they wished existed. Launched in 2023, our community has grown to include thousands of writers from around the world.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              What started as an experiment has evolved into a vibrant community where amateur writers can gain confidence, experienced authors can experiment with new ideas, and readers can enjoy stories that evolve in unexpected ways.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Our Community</h2>
            <p className="text-lg text-gray-700 mb-4">
              Whether you're an experienced writer looking to collaborate with others or someone who's always wanted to try writing but hasn't known where to start, StoryCollab is the perfect place for you.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our supportive community welcomes writers of all skill levels and backgrounds. We believe that everyone has a story to tell, and sometimes the best stories come from unexpected collaborations.
            </p>
            <div className="mt-8 text-center">
              <a href="/register" className="btn-primary inline-block">
                Sign Up Now
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}