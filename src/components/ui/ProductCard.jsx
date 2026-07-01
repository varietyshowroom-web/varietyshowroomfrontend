// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Heart, ShoppingBag, Eye } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useStore } from '../../store/useStore';

// export const ProductCard = ({ product }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const navigate = useNavigate();
//   const toggleWishlist = useStore(state => state.toggleWishlist);
//   const wishlist = useStore(state => state.wishlist);
  
//   const isWishlisted = wishlist.some(item => item.id === product.id);
//   const mainImage = product.images?.[0]?.image || 'https://via.placeholder.com/400x500';
//   const hoverImage = product.images?.[1]?.image || mainImage;

//   const handleQuickAdd = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     // In a real app, if product has variants we might open a modal
//     // For now, redirect to details
//     navigate(`/product/${product.id}`);
//   };

//   const handleWishlist = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     toggleWishlist(product);
//   };

//   return (
//     <motion.div 
//       className="group flex flex-col relative"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Badges */}
//       <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
//         {product.discount_percentage > 0 && (
//           <span className="bg-maroon-light text-white text-xs font-bold px-2 py-1 rounded">
//             -{product.discount_percentage}%
//           </span>
//         )}
//         {product.is_sold_out && (
//           <span className="bg-dark-maroon text-white text-xs font-bold px-2 py-1 rounded">
//             Sold Out
//           </span>
//         )}
//       </div>

//       {/* Image Container */}
//       <Link 
//         to={`/product/${product.id}`}
//         className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4"
//       >
//         <img 
//           src={isHovered ? hoverImage : mainImage} 
//           alt={product.name}
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//         />
        
//         {/* Quick Actions overlay */}
//         <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-3 transition-all duration-300 ${
//           isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
//         }`}>
//           {/* <button 
//             onClick={handleWishlist}
//             className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg transition-colors ${
//               isWishlisted ? 'text-maroon-light' : 'text-dark-maroon hover:text-maroon-light'
//             }`}
//           >
//             <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
//           </button> */}
          
//           <button 
//             onClick={handleQuickAdd}
//             disabled={product.is_sold_out}
//             className="h-10 px-5 rounded-full bg-dark-maroon text-white flex items-center justify-center shadow-lg hover:bg-maroon-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
//           >
//             <ShoppingBag size={18} className="mr-2" />
//             {product.has_sizes ? 'Select Size' : 'Quick Add'}
//           </button>
//         </div>
//       </Link>

//       {/* Product Info */}
//       {/* <div className="flex flex-col flex-grow">
//         <div className="flex justify-between items-start mb-1">
//           <Link to={`/category/${product.category_name}`} className="text-xs text-muted-maroon uppercase tracking-wider hover:text-maroon-light">
//             {product.category_name}
//           </Link>
//         </div>
//         <Link to={`/product/${product.id}`} className="text-lg font-serif font-medium text-dark-maroon leading-tight mb-2 hover:text-maroon-light transition-colors line-clamp-1">
//           {product.name}
//         </Link>
//         <div className="mt-auto flex items-center gap-2">
//           <span className="text-lg font-bold text-dark-maroon">₹{product.price}</span>
//           {product.original_price > product.price && (
//             <span className="text-sm text-muted-maroon line-through">₹{product.original_price}</span>
//           )}
//         </div> */}
//       <div className="flex flex-col flex-grow">
//   <div className="flex justify-between items-start mb-1">
//     <Link to={`/category/${product.category_name}`} className="text-xs text-muted-maroon uppercase tracking-wider hover:text-maroon-light">
//       {product.category_name}
//     </Link>
//   </div>
//   <Link to={`/product/${product.id}`} className="text-lg font-serif font-medium text-dark-maroon leading-tight mb-2 hover:text-maroon-light transition-colors line-clamp-1">
//     {product.name}
//   </Link>
//   <div className="mt-auto flex items-center gap-2">
//     <span className="text-lg font-bold text-dark-maroon">₹{product.price}</span>
    
//     {/* FIX: Force Number parsing to guarantee accurate mathematical evaluation */}
//     {product.original_price && Number(product.original_price) > Number(product.price) && (
//       <span className="text-sm text-muted-maroon line-through">₹{product.original_price}</span>
//     )}
//   </div>
// </div> {/* Added missing closing tag for clarity */}
        
//         {/* Color Dots */}
//         {product.available_colors && product.available_colors.length > 0 && (
//           <div className="flex gap-1 mt-3">
//             {product.available_colors.slice(0, 4).map(color => (
//               <div 
//                 key={color.id}
//                 className="w-4 h-4 rounded-full border border-gray-200"
//                 style={{ backgroundColor: color.color }}
//                 title={color.name}
//               />
//             ))}
//             {product.available_colors.length > 4 && (
//               <span className="text-xs text-muted-maroon flex items-center ml-1">
//                 +{product.available_colors.length - 4}
//               </span>
//             )}
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const toggleWishlist = useStore(state => state.toggleWishlist);
  const wishlist = useStore(state => state.wishlist);
  
  const isWishlisted = wishlist.some(item => item.id === product.id);

  // Helper normalization utility to handle string vs nested object structures safely
  const getProductImageSrc = (imgObj) => {
    if (!imgObj) return null;
    if (typeof imgObj === 'string') return imgObj;
    return imgObj.image || imgObj.url || imgObj.imageUrl || imgObj.src;
  };

  // FIX: Safely parse individual index array keys to protect layout processing trees
  const fallbackPlaceholder = 'https://via.placeholder.com/400x500';
  const mainImage = getProductImageSrc(product.images?.[0]) || product.image || fallbackPlaceholder;
  const hoverImage = getProductImageSrc(product.images?.[1]) || mainImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div 
      className="group flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.discount_percentage > 0 && (
          <span className="bg-maroon-light text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount_percentage}%
          </span>
        )}
        {product.is_sold_out && (
          <span className="bg-dark-maroon text-white text-xs font-bold px-2 py-1 rounded">
            Sold Out
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link 
        to={`/product/${product.id}`}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4"
      >
        <img 
          src={isHovered ? hoverImage : mainImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Quick Actions overlay */}
        <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-3 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <button 
            onClick={handleQuickAdd}
            disabled={product.is_sold_out}
            className="h-10 px-5 rounded-full bg-dark-maroon text-white flex items-center justify-center shadow-lg hover:bg-maroon-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <ShoppingBag size={18} className="mr-2" />
            {product.has_sizes ? 'Select Size' : 'Quick Add'}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/category/${product.category_name}`} className="text-xs text-muted-maroon uppercase tracking-wider hover:text-maroon-light">
            {product.category_name}
          </Link>
        </div>
        <Link to={`/product/${product.id}`} className="text-lg font-serif font-medium text-dark-maroon leading-tight mb-2 hover:text-maroon-light transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-dark-maroon">₹{product.price}</span>
          
          {/* Enhanced Calculation block mapping strictly matching type requirements */}
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <span className="text-sm text-muted-maroon line-through">₹{product.original_price}</span>
          )}
        </div>
        
        {/* Color Dots */}
        {product.available_colors && product.available_colors.length > 0 && (
          <div className="flex gap-1 mt-3">
            {product.available_colors.slice(0, 4).map(color => (
              <div 
                key={color.id}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.color }}
                title={color.name}
              />
            ))}
            {product.available_colors.length > 4 && (
              <span className="text-xs text-muted-maroon flex items-center ml-1">
                +{product.available_colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
