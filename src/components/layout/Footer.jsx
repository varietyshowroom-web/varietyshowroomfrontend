import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail,Heart } from 'lucide-react';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-dark-maroon text-white-bg pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* About */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-cream-beige mb-6">Variety Showroom</h3>
            <p className="text-white-bg/80 mb-6 leading-relaxed">
              Trending fashion at affordable range. Complete family fashion shop open 365 days a year.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/variety_showroom" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white-bg/10 flex items-center justify-center hover:bg-maroon-light hover:text-white transition-colors">
                <InstagramIcon />
              </a>
              <a href="https://www.facebook.com/share/1JM2djFoc2/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white-bg/10 flex items-center justify-center hover:bg-maroon-light hover:text-white transition-colors">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-cream-beige mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white-bg/80 hover:text-maroon-light transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="text-white-bg/80 hover:text-maroon-light transition-colors">Shop Collection</Link></li>
              <li><Link to="/orders" className="text-white-bg/80 hover:text-maroon-light transition-colors">Track Order</Link></li>
              <li><Link to="/contact" className="text-white-bg/80 hover:text-maroon-light transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-white-bg/80 hover:text-maroon-light transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-cream-beige mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-maroon-light mt-1 mr-3 shrink-0" />
                <span className="text-white-bg/80">Gannavaram Road, Kankipadu,<br/>Andhra Pradesh - 521151</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-maroon-light mr-3 shrink-0" />
                <a href="tel:9182823269" className="text-white-bg/80 hover:text-maroon-light transition-colors">9182823269</a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-maroon-light mr-3 shrink-0" />
                <a href="mailto:Varietyshowroom@gmail.com" className="text-white-bg/80 hover:text-maroon-light transition-colors">Varietyshowroom@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Location Map */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-cream-beige mb-6">Store Location</h4>
            <div className="rounded-lg overflow-hidden h-40 bg-white/10 relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15303.499692487445!2d80.77054815!3d16.42531395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f5c150bb91d9%3A0xa190d6b637d7a716!2sKankipadu%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-80 group-hover:opacity-100 transition-opacity"
              ></iframe>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:bg-transparent bg-dark-maroon/20 transition-colors"></div>
            </div>
            <a 
              href="https://maps.app.goo.gl/Xj6EU7Lfpc7h64gq8" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block mt-4 text-sm text-cream-beige hover:text-maroon-light transition-colors font-medium border-b border-transparent hover:border-maroon-light pb-1"
            >
              Get Directions →
            </a>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white-bg/60">
          <p>&copy; {new Date().getFullYear()} Variety Showroom. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <span className="bg-white/5 px-3 py-1 rounded">Open 365 Days</span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-1">
            Made with <Heart className="inline h-4 w-4 text-red-500 mx-1" /> by
            <a
              href="https://staffarc.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-orange-600 hover:underline"
            >
              <img
                src="https://www.staffarc.in/images/Staffarc-logo.png"
                alt="StaffArc logo"
                className="h-5 w-5 object-contain"
              />
              StaffArc
            </a>
          </div>
      </div>
    </footer>
  );
};
