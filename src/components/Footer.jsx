import React from "react"
import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-8 bg-red-600"></div>
                <span className="text-xl font-extralight text-gray-900 dark:text-white tracking-tight">F1</span>
                <div className="w-1 h-8 bg-red-600"></div>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-8 max-w-md">
              Your ultimate destination for Formula 1 news, race results, driver standings, 
              and everything F1. Stay updated with the latest from the world of motorsport.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.391 14.7c.687.72 1.651 1.155 2.691 1.155 1.828 0 3.344-1.297 3.344-2.917 0-1.61-1.516-2.907-3.344-2.907-1.04 0-2.004.435-2.691 1.155l-1.27-.991C5.999 9.498 7.15 9.008 8.449 9.008c2.917 0 5.26 2.144 5.26 4.823-.001 2.68-2.343 4.823-5.26 4.823z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-light text-gray-900 dark:text-white uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <div className="w-12 h-px bg-red-600 mb-6"></div>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/standings" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Current Standings
                </Link>
              </li>
              <li>
                <Link 
                  to="/schedule" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Race Schedule
                </Link>
              </li>
              <li>
                <Link 
                  to="/drivers" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Drivers
                </Link>
              </li>
              <li>
                <Link 
                  to="/teams" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Teams
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-light text-gray-900 dark:text-white uppercase tracking-wider mb-6">
              Features
            </h3>
            <div className="w-12 h-px bg-red-600 mb-6"></div>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/live" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Live Updates
                </Link>
              </li>
              <li>
                <Link 
                  to="/race-histories" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Race Histories
                </Link>
              </li>
              <li>
                <Link 
                  to="/season-winners" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Season Winners
                </Link>
              </li>
              <li>
                <Link 
                  to="/tracks" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Track Maps
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                © {currentYear} F1 Hub. All rights reserved.
              </p>
              <div className="flex space-x-8">
                <a 
                  href="#" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm font-light transition-colors"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm font-light transition-colors"
                >
                  Terms of Service
                </a>
                <a 
                  href="#" 
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm font-light transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 text-sm font-light">
                Powered by Ergast API & OpenF1
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
