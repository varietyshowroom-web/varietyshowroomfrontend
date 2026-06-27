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
      <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
      <span>
        WhatsApp:{" "}
        <strong className="underline tracking-wide">
          +91 7013280379
        </strong>
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
