import { motion } from 'framer-motion';

export default function SkeletonLoader({ variant = 'default' }) {
  if (variant === 'story-detail') {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse bg-white dark:bg-black">
        {/* Hero Header Skeleton */}
        <div className="bg-gray-300 dark:bg-gray-800 text-white py-8 border-b-2 border-black">
          <div className="container mx-auto px-4">
            <div className="h-4 bg-gray-400 dark:bg-gray-600 w-32 mb-4"></div>
            <div className="h-12 bg-gray-400 dark:bg-gray-600 w-3/4 mb-3"></div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-400 dark:bg-gray-600 w-20"></div>
              <div className="h-4 bg-gray-400 dark:bg-gray-600 w-24"></div>
              <div className="h-4 bg-gray-400 dark:bg-gray-600 w-28"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Story Description Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 border-2 border-black shadow-neo">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 w-48 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 w-5/6"></div>
              </div>
              <div className="flex gap-2 mt-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 w-16 border-2 border-transparent"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 w-20 border-2 border-transparent"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 w-24 border-2 border-transparent"></div>
              </div>
            </div>

            {/* Contributions Header */}
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 w-48"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 w-24"></div>
              </div>
            </div>

            {/* Contribution Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border-2 border-black p-6 shadow-neo">
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-4/5"></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 w-32"></div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 mr-2 border-2 border-transparent"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 border-2 border-black shadow-neo">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 w-24 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-20"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-gray-100 dark:bg-zinc-800 p-6 border-2 border-black">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 w-28 mb-4"></div>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 mr-3 border-2 border-black"></div>
                <div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'story-card') {
    return (
      <div className="bg-white dark:bg-zinc-900 border-2 border-black shadow-neo overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-300 dark:bg-gray-700 border-b-2 border-black"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-5/6 mb-4"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 w-16 border-2 border-transparent"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 w-20 border-2 border-transparent"></div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t-2 border-black">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default spinner loader
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "circInOut"
          }}
          className="relative w-16 h-16 mx-auto mb-4"
        >
          <div className="absolute inset-0 bg-neo-yellow border-2 border-black"></div>
          <div className="absolute inset-0 bg-neo-blue border-2 border-black translate-x-1 translate-y-1 -z-10"></div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-black dark:text-white font-bold uppercase tracking-widest"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}

// Story Grid Skeleton
export function StoryGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLoader key={i} variant="story-card" />
      ))}
    </div>
  );
}

// Page Loader with overlay
// Page Loader with overlay
export function PageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "circInOut"
          }}
          className="relative w-20 h-20 mx-auto mb-6"
        >
          <div className="absolute inset-0 bg-neo-yellow border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="absolute inset-0 bg-neo-blue border-4 border-black translate-x-2 translate-y-2 -z-10"></div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-black uppercase tracking-widest text-black dark:text-white bg-neo-green px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
