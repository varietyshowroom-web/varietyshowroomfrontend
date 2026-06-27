import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import { productService } from '../../services/productService';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    productService.getCategories().then(data => {
      setCategories(data);
    }).catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-md">
      {/* Top Announcement Banner */}
      <div className="bg-dark-maroon text-white text-xs sm:text-sm py-2 px-4 transition-all duration-300">
        <div className="container mx-auto flex justify-center items-center">
          <a
            href="https://wa.me/917013280379"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-light-beige opacity-95 hover:opacity-100 transition-all font-medium"
          >
            <svg 
              className="w-4 h-4 flex-shrink-0 select-none pointer-events-none transition-transform duration-200 hover:scale-110" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" 
                fill="#25D366"
              />
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M12.0041 4.5C7.86315 4.5 4.5 7.86315 4.5 12.0041C4.49841 13.4357 4.90802 14.8315 5.68112 16.0354L4.56846 19.4447L8.10682 18.3377C9.25597 19.043 10.5982 19.4124 11.9959 19.413C16.1368 19.413 19.5 16.0498 19.5 11.9044C19.5015 9.89735 18.721 8.01258 17.3006 6.59218C15.8802 5.17178 13.9999 4.49896 12.0041 4.5ZM15.5413 13.5152C15.3481 13.4184 14.3989 12.9511 14.2216 12.8866C14.0442 12.8222 13.9153 12.7899 13.7863 12.9834C13.6573 13.1768 13.2865 13.6282 13.1737 13.7571C13.0608 13.8861 12.948 13.9022 12.7545 13.8055C12.5611 13.7088 11.9378 13.5042 11.199 12.8398C10.6238 12.3263 10.2351 11.6917 10.1222 11.4983C10.0094 11.3048 10.1101 11.1998 10.2071 11.1032C10.2941 11.0163 10.4008 10.8776 10.4975 10.7648C10.5942 10.652 10.6264 10.5714 10.6909 10.4424C10.7554 10.3134 10.7231 10.2005 10.6748 10.1038C10.6264 10.0071 10.2394 9.0559 10.0782 8.66898C9.921 8.29215 9.76186 8.3421 9.64336 8.3421H9.45005C9.25656 8.3421 8.95026 8.41461 8.69232 8.69232C8.43438 8.97003 7.70891 9.64714 7.70891 11.0336C7.70891 12.42 8.7183 13.7581 8.8579 13.9442C8.9975 14.1303 10.817 16.9944 13.6166 18.1009C14.2821 18.364 14.8016 18.5369 15.206 18.6659C15.8744 18.8787 16.4815 18.849 16.9622 18.7771C17.4984 18.697 18.6133 18.1009 18.8447 17.456C19.076 16.8111 19.076 16.263 19.0063 16.1501C18.9366 16.0373 18.7346 15.912 18.5413 15.8152L15.5413 13.5152Z" 
                fill="white"
              />
            </svg>
            <span>
              WhatsApp: <strong className="underline tracking-wide">+91 7013280379</strong>
            </span>
          </a>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-dark-maroon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={26} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold text-dark-maroon tracking-tight truncate max-w-[60%] sm:max-w-none"
          >
            Variety Showroom
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-dark-maroon hover:text-maroon-light font-medium transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}

            {/* Category Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className="flex items-center gap-1 text-dark-maroon hover:text-maroon-light font-medium transition-all duration-300">
                Categories
                <ChevronDown size={18} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-10 left-0 w-64 bg-white rounded-2xl shadow-2xl border border-border-beige overflow-hidden"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.id || category.name}
                        to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-5 py-4 text-dark-maroon hover:bg-light-beige hover:text-maroon-light transition-all duration-200 border-b border-border-beige last:border-none"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Icons Side */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Desktop Search Form */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <form 
                  onSubmit={handleSearch} 
                  className="hidden md:flex absolute right-0 items-center bg-white border border-maroon-light rounded-full px-3 py-1 shadow-sm w-64"
                >
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..." 
                    className="w-full outline-none text-sm text-dark-maroon bg-transparent"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="text-muted-maroon hover:text-dark-maroon ml-2">
                    <X size={16} />
                  </button>
                </form>
              ) : null}

              {/* Toggle Search Icon */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className={`${isSearchOpen ? 'md:hidden' : 'block'} text-dark-maroon hover:text-maroon-light transition-all duration-300`}
              >
                {isSearchOpen ? <X size={21} /> : <Search size={21} />}
              </button>
            </div>

            <Link
              to="/profile"
              className="hidden md:block text-dark-maroon hover:text-maroon-light transition-all duration-300"
            >
              <User size={21} />
            </Link>

            <Link
              to="/cart"
              className="relative text-dark-maroon hover:text-maroon-light transition-all duration-300"
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-maroon-light text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Dropdown Row */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden mt-3"
            >
              <form onSubmit={handleSearch} className="flex items-center bg-white border border-maroon-light rounded-full px-4 py-2 shadow-inner w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." 
                  className="w-full outline-none text-base text-dark-maroon bg-transparent"
                  autoFocus
                />
                <button type="submit" className="text-dark-maroon ml-2">
                  <Search size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-dark-maroon">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-dark-maroon"
                >
                  <X size={26} />
                </button>
              </div>

              <nav className="flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-dark-maroon border-b border-border-beige pb-3"
                  >
                    {link.name}
                  </Link>
                ))}

                <div>
                  <h3 className="text-lg font-semibold text-maroon-light mb-3">Categories</h3>
                  <div className="flex flex-col space-y-3 pl-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id || category.name}
                        to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-dark-maroon hover:text-maroon-light transition-all duration-200"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              <div className="mt-auto flex flex-col space-y-4 pt-8 border-t border-border-beige">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center text-dark-maroon"
                >
                  <User size={20} className="mr-3" />
                  Profile
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
