import { motion } from 'framer-motion';

export default function SkeletonLoader({ variant = 'default' }) {
  if (variant === 'story-detail') {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        {/* Hero Header Skeleton */}
        <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-white py-8 rounded-t-xl">
          <div className="container mx-auto px-4">
            <div className="h-4 bg-white/20 rounded w-32 mb-4"></div>
            <div className="h-12 bg-white/30 rounded w-3/4 mb-3"></div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-white/20 rounded w-20"></div>
              <div className="h-4 bg-white/20 rounded w-24"></div>
              <div className="h-4 bg-white/20 rounded w-28"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Story Description Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="flex gap-2 mt-6">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>

            {/* Contributions Header */}
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            {/* Contribution Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-300 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="h-6 bg-gray-300 rounded w-28 mb-4"></div>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-300"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
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
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-16 h-16 mx-auto mb-4"
        >
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-gray-600 font-medium"
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
export function PageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-20 h-20 mx-auto mb-4"
        >
          <svg className="w-full h-full text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-semibold text-gray-700"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
