import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children, title = 'Collaborative Storytelling', hideHeader = false, hideFooter = false }) => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📝</text></svg>" />
      </Head>

      {/* Improved Sticky Navbar */}
      {!hideHeader && (
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] border-b-2 border-black' : 'bg-white dark:bg-zinc-900 border-b-2 border-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white hover:-rotate-2 transition-transform border-4 border-black p-1 bg-neo-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              StoryCollab
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
               {/* Theme Toggle */}
               <button
                onClick={toggleTheme}
                className="p-2 border-2 border-transparent hover:border-black hover:bg-neo-off-white dark:hover:bg-zinc-800 transition-all mr-2 text-black dark:text-white"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              <Link 
                href="/stories" 
                className={`px-4 py-2 font-bold uppercase tracking-wider border-2 transition-all ${isActive('/stories') ? 'bg-neo-blue text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:border-black hover:bg-gray-100 text-black dark:text-white'}`}
              >
                Browse Stories
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/stories/create" 
                    className={`px-4 py-2 font-bold uppercase tracking-wider border-2 transition-all ${isActive('/stories/create') ? 'bg-neo-green text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:border-black hover:bg-gray-100 text-black dark:text-white'}`}
                  >
                    Create Story
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className={`px-4 py-2 font-bold uppercase tracking-wider border-2 transition-all ${isActive('/dashboard') ? 'bg-neo-yellow text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:border-black hover:bg-gray-100 text-black dark:text-white'}`}
                  >
                    Dashboard
                  </Link>
                  
                  {/* Notification Bell */}
                  <div className="relative notification-dropdown ml-2">
                    <button 
                      className="p-2 border-2 border-black bg-white hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-white transition-all relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-neo-red text-white text-xs border-2 border-black h-6 w-6 flex items-center justify-center font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {isNotificationOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white shadow-neo animate-fadeIn z-50">
                        <div className="px-4 py-3 bg-neo-yellow border-b-2 border-black flex justify-between items-center">
                          <h3 className="font-bold text-black uppercase tracking-wider">Notifications</h3>
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="text-xs text-black hover:underline font-bold"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-sm text-gray-500 text-center font-medium">No notifications</p>
                          ) : (
                            notifications.map(notification => (
                              <div 
                                key={notification._id} 
                                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 border-b-2 border-black dark:border-white last:border-0 transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                              >
                                <p className="text-sm text-black dark:text-white font-bold">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
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
                      className="flex items-center space-x-2 px-3 py-2 border-2 border-transparent hover:border-black active:shadow-none transition-all"
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                      <div className="w-8 h-8 bg-black text-white border-2 border-black flex items-center justify-center font-bold text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-black dark:text-white uppercase tracking-wide hidden lg:block">{user?.username}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black dark:text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white shadow-neo py-0 z-50">
                        <Link href="/profile" className="flex items-center px-4 py-3 text-sm font-bold text-black dark:text-white hover:bg-neo-blue hover:text-white transition-colors border-b-2 border-black">
                          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          MY PROFILE
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-3 text-sm font-bold text-neo-red hover:bg-neo-red hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          LOGOUT
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2 ml-2">
                  <Link href="/login" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 font-bold uppercase transition-colors border-2 border-transparent hover:border-black">
                    Login
                  </Link>
                  <Link href="/register" className="neo-btn-primary">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 border-2 border-black bg-white hover:bg-gray-100 transition-all shadow-neo active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t-2 border-black bg-neo-off-white dark:bg-zinc-800 p-4">
              <Link 
                href="/stories" 
                className={`block px-4 py-3 font-bold uppercase border-2 border-black transition-all ${isActive('/stories') ? 'bg-neo-blue text-white shadow-neo' : 'bg-white text-black shadow-sm'}`}
              >
                Browse Stories
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/stories/create" 
                    className={`block px-4 py-3 font-bold uppercase border-2 border-black transition-all ${isActive('/stories/create') ? 'bg-neo-green text-white shadow-neo' : 'bg-white text-black shadow-sm'}`}
                  >
                    Create Story
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className={`block px-4 py-3 font-bold uppercase border-2 border-black transition-all ${isActive('/dashboard') ? 'bg-neo-yellow text-black shadow-neo' : 'bg-white text-black shadow-sm'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className={`block px-4 py-3 font-bold uppercase border-2 border-black transition-all ${isActive('/profile') ? 'bg-white text-black shadow-neo' : 'bg-white text-black shadow-sm'}`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 text-white bg-neo-red border-2 border-black font-bold uppercase shadow-neo transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 text-black bg-white border-2 border-black font-bold uppercase shadow-sm transition-all hover:shadow-neo">
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-3 bg-neo-blue text-white border-2 border-black font-bold uppercase text-center shadow-neo hover:bg-blue-600 transition-all">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
      )}

      <main className="flex-grow">{children}</main>

      {!hideFooter && (
      <footer className="bg-black text-white py-12 border-t-4 border-neo-yellow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-black uppercase mb-6 text-white tracking-widest bg-neo-blue inline-block px-2 transform -rotate-2 border-2 border-white">StoryCollab</h3>
              <p className="text-gray-300 mb-6 leading-relaxed font-medium">
                A collaborative platform where imagination meets community. Create, contribute, and weave stories together with writers from around the world.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 border-2 border-white bg-black flex items-center justify-center text-white hover:bg-neo-yellow hover:text-black hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 border-2 border-white bg-black flex items-center justify-center text-white hover:bg-neo-pink hover:text-black hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="w-10 h-10 border-2 border-white bg-black flex items-center justify-center text-white hover:bg-neo-green hover:text-black hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08zm1.772 12.315c-1.243 0-2.25-1.007-2.25-2.25s1.007-2.25 2.25-2.25 2.25 1.007 2.25 2.25-1.007 2.25-2.25 2.25zm-4.675-2.25c0 2.582 2.093 4.675 4.675 4.675s4.675-2.093 4.675-4.675-2.093-4.675-4.675-4.675-4.675 2.093-4.675 4.675zm8.945-5.625c0 .621-.504 1.125-1.125 1.125s-1.125-.504-1.125-1.125.504-1.125 1.125-1.125 1.125.504 1.125 1.125z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-neo-yellow transition-colors flex items-center group font-bold">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> Home
                  </Link>
                </li>
                <li>
                  <Link href="/stories" className="text-gray-300 hover:text-neo-yellow transition-colors flex items-center group font-bold">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> Browse Stories
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-neo-yellow transition-colors flex items-center group font-bold">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> About Us
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-neo-yellow transition-colors flex items-center group font-bold">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-neo-red transition-colors flex items-center group font-bold">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-neo-red transition-colors flex items-center group font-bold">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-neo-red transition-colors flex items-center group font-bold">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-neo-red transition-colors flex items-center group font-bold">
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Stay Updated</h3>
              <p className="text-gray-300 mb-4 text-sm font-medium">
                Subscribe to our newsletter for the latest stories.
              </p>
              <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className={`w-full px-4 py-3 bg-white border-4 border-transparent focus:border-neo-yellow text-black font-bold placeholder-gray-500 transition-colors rounded-none outline-none ${
                    newsletterStatus === 'error' ? 'border-neo-red' : 
                    newsletterStatus === 'success' ? 'border-neo-green' : ''
                  }`}
                />
                <button 
                  type="submit" 
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className={`w-full py-3 font-bold uppercase tracking-wider border-2 border-white transition-all shadow-[4px_4px_0px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                    newsletterStatus === 'loading' ? 'bg-gray-600 cursor-wait' :
                    newsletterStatus === 'success' ? 'bg-neo-green text-black hover:bg-green-500' :
                    'bg-neo-blue text-white hover:bg-blue-600'
                  }`}
                >
                  {newsletterStatus === 'loading' ? 'Wait...' :
                   newsletterStatus === 'success' ? 'Sucess!' :
                   'Subscribe'}
                </button>
                {newsletterStatus === 'error' && (
                  <p className="text-neo-red text-sm font-bold bg-white px-2 inline-block">Invalid Email</p>
                )}
                {newsletterStatus === 'success' && (
                  <p className="text-neo-green text-sm font-bold bg-white px-2 inline-block">Thanks!</p>
                )}
              </form>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t-2 border-white flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm font-bold">
            <p>&copy; {new Date().getFullYear()} StoryCollab. No Rights Reserved (Just Kidding).</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors uppercase">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors uppercase">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors uppercase">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default Layout;