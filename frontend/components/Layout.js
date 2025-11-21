import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, title = 'Collaborative Storytelling' }) => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(data.data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationOpen(false);
  }, [router.pathname]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen || isNotificationOpen) {
        const dropdownElements = document.querySelectorAll('.profile-dropdown, .notification-dropdown');
        let clickedInside = false;
        
        dropdownElements.forEach(element => {
          if (element.contains(event.target)) {
            clickedInside = true;
          }
        });
        
        if (!clickedInside) {
          setIsProfileDropdownOpen(false);
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isNotificationOpen]);

  const isActive = (path) => router.pathname === path;

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(''), 3000);
      return;
    }

    try {
      // For now, just simulate a successful subscription
      // In production, you'd send this to your backend API
      setNewsletterStatus('loading');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNewsletterStatus('success');
      setNewsletterEmail('');
      
      // Reset status after 3 seconds
      setTimeout(() => setNewsletterStatus(''), 3000);
    } catch (error) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {/* Improved Sticky Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hover:scale-105 transition-transform">
              StoryCollab
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                href="/stories" 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/stories') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'}`}
              >
                Browse Stories
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/stories/create" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/stories/create') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'}`}
                  >
                    Create Story
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/dashboard') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'}`}
                  >
                    Dashboard
                  </Link>
                  
                  {/* Notification Bell */}
                  <div className="relative notification-dropdown ml-2">
                    <button 
                      className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all relative"
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {isNotificationOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                        <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="text-xs text-primary-600 hover:text-primary-800 font-semibold"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-sm text-gray-500 text-center">No notifications</p>
                          ) : (
                            notifications.map(notification => (
                              <div 
                                key={notification._id} 
                                className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                              >
                                <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative profile-dropdown ml-2">
                    <button 
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">{user?.username}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 animate-fadeIn">
                        <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2 ml-2">
                  <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 space-y-1 border-t border-gray-100">
              <Link 
                href="/stories" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive('/stories') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Browse Stories
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/stories/create" 
                    className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive('/stories/create') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Create Story
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive('/profile') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all">
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">StoryCollab</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                A collaborative platform where imagination meets community. Create, contribute, and weave stories together with writers from around the world.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08zm1.772 12.315c-1.243 0-2.25-1.007-2.25-2.25s1.007-2.25 2.25-2.25 2.25 1.007 2.25 2.25-1.007 2.25-2.25 2.25zm-4.675-2.25c0 2.582 2.093 4.675 4.675 4.675s4.675-2.093 4.675-4.675-2.093-4.675-4.675-4.675-4.675 2.093-4.675 4.675zm8.945-5.625c0 .621-.504 1.125-1.125 1.125s-1.125-.504-1.125-1.125.504-1.125 1.125-1.125 1.125.504 1.125 1.125z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> Home
                  </Link>
                </li>
                <li>
                  <Link href="/stories" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> Browse Stories
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> About Us
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                    <span className="mr-2">›</span> FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Stay Updated</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Subscribe to our newsletter for the latest stories and writing tips.
              </p>
              <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none text-white placeholder-gray-500 transition-colors ${
                    newsletterStatus === 'error' ? 'border-red-500' : 
                    newsletterStatus === 'success' ? 'border-green-500' : 
                    'border-gray-700 focus:border-primary-500'
                  }`}
                />
                <button 
                  type="submit" 
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    newsletterStatus === 'loading' ? 'bg-gray-600 cursor-wait' :
                    newsletterStatus === 'success' ? 'bg-green-600 hover:bg-green-700' :
                    'btn-primary'
                  }`}
                >
                  {newsletterStatus === 'loading' ? 'Subscribing...' :
                   newsletterStatus === 'success' ? '✓ Subscribed!' :
                   'Subscribe'}
                </button>
                {newsletterStatus === 'error' && (
                  <p className="text-red-400 text-sm">Please enter a valid email address</p>
                )}
                {newsletterStatus === 'success' && (
                  <p className="text-green-400 text-sm">Thank you for subscribing!</p>
                )}
              </form>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} StoryCollab. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;