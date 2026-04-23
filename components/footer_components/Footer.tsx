'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Properties', href: '/properties' },
      { label: 'Experiences', href: '/experiences' },
      { label: 'Careers', href: '/careers' },
    ],
    support: [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    social: [
      {
        label: 'Instagram',
        href: '#',
        icon: (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
          </svg>
        ),
      },
      {
        label: 'Twitter',
        href: '#',
        icon: (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
          </svg>
        ),
      },
      {
        label: 'LinkedIn',
        href: '#',
        icon: (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className='relative w-full bg-gray-900 text-white'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
          {/* Brand Column */}
          <div className='lg:col-span-1'>
            <Link href='/' className='inline-block mb-6'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='text-2xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent'
              >
                SHOWTEL
              </motion.div>
            </Link>
            <p className='text-gray-400 text-sm leading-relaxed mb-6'>
              Redefining hospitality through immersive experiences. Discover extraordinary spaces that tell unique
              stories.
            </p>
            {/* Social Links */}
            <div className='flex items-center gap-3'>
              {footerLinks.social.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className='p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors'
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4'>Company</h3>
            <ul className='space-y-3'>
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-gray-400 hover:text-white transition-colors text-sm group flex items-center gap-2'
                  >
                    <span className='w-0 h-px bg-white group-hover:w-4 transition-all duration-300' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4'>Support</h3>
            <ul className='space-y-3'>
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-gray-400 hover:text-white transition-colors text-sm group flex items-center gap-2'
                  >
                    <span className='w-0 h-px bg-white group-hover:w-4 transition-all duration-300' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-white/10'>
        <div className='max-w-[85vw] mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
            {/* Copyright */}
            <div className='text-gray-500 text-sm'>&copy; {currentYear} SHOWTELL. All rights reserved.</div>
          </div>
        </div>
      </div>

      {/* Subtle gradient line at top */}
      <div className='absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-600 to-transparent' />
    </footer>
  );
};
