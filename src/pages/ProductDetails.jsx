
// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Heart, ShoppingBag, ChevronRight, Share2 } from 'lucide-react';
// import { productService } from '../services/productService';
// import { useStore } from '../store/useStore';
// import { Button } from '../components/ui/Button';

// export const ProductDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [quantity, setQuantity] = useState(1);
  
//   const { addToCart, toggleWishlist, wishlist } = useStore();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       setLoading(true);
//       const data = await productService.getProductById(id);
//       setProduct(data);
//       if (data && data.available_colors?.length > 0) {
//         const firstColor = data.available_colors[0];
//         setSelectedColor(firstColor);
        
//         const imgIndex = data.images?.findIndex(img => img.color === firstColor.id);
//         if(imgIndex >= 0) setActiveImage(imgIndex);
//         else setActiveImage(0);

//         // Auto-select size if only ONE variant exists for this color
//         const colorVariants = data.variants?.filter(v => v.color?.id === firstColor.id) || [];
//         if (data.has_sizes && colorVariants.length === 1) {
//           setSelectedSize(colorVariants[0].size);
//         } else {
//           setSelectedSize(null);
//         }
//       } else if (data && data.has_sizes) {
//         // Handle products without color variations but have sizes
//         if (data.variants?.length === 1) {
//           setSelectedSize(data.variants[0].size);
//         }
//       }
//       setLoading(false);
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading) return <div className="min-h-screen pt-32 pb-24 flex justify-center"><div className="animate-pulse w-10 h-10 border-4 border-maroon-light rounded-full border-t-transparent animate-spin"></div></div>;
//   if (!product) return <div className="min-h-screen pt-32 text-center"><h1 className="text-2xl font-serif">Product Not Found</h1></div>;

//   const isWishlisted = wishlist.some(item => item.id === product.id);

//   const availableVariants = product.variants.filter(v => v.color?.id === selectedColor?.id);
//   const selectedVariant = availableVariants.find(v => v.size === selectedSize);

//   const colorImages = product.images?.filter(img => img.color === selectedColor?.id) || [];
//   const displayImages = colorImages.length > 0 ? colorImages : (product.images || []);

//   const handleColorSelect = (color) => {
//     setSelectedColor(color);
//     setActiveImage(0);

//     // Auto-select size if only ONE variant exists for this newly selected color
//     const variantsForColor = product.variants.filter(v => v.color?.id === color.id);
//     if (product.has_sizes && variantsForColor.length === 1) {
//       setSelectedSize(variantsForColor[0].size);
//     } else {
//       setSelectedSize(null);
//     }
//   };

//   const getVariantToAdd = () => {
//     const variantImage = displayImages.length > 0 ? displayImages[0].image : null;
//     const baseVariant = selectedVariant || product.variants[0] || { id: 'default', color: selectedColor, size: selectedSize };
//     return { ...baseVariant, image: variantImage };
//   };

//   // const handleAddToCart = () => {
//   //   if (product.has_sizes && !selectedSize) return;
//   //   addToCart(product, getVariantToAdd(), quantity);
//   // };

//   // const handleBuyNow = () => {
//   //   if (product.has_sizes && !selectedSize) return;
//   //   addToCart(product, getVariantToAdd(), quantity);
//   //   // Directly routing to checkout as requested
//   //   navigate('/checkout');
//   // };
//   const handleAddToCart = () => {
//     if (product.has_sizes && !selectedSize) return;
//     addToCart(product, getVariantToAdd(), quantity);
//   };

//   const handleBuyNow = () => {
//     if (product.has_sizes && !selectedSize) return;
    
//     // Create a standalone item object for just this product
//     const buyNowItem = {
//       product: product,
//       variant: getVariantToAdd(),
//       quantity: quantity
//     };
    
//     // Navigate straight to checkout and pass the item as local router state
//     navigate('/checkout', { state: { buyNowItem } });
//   };

//   // Helper flags for size selection state
//   const isSizeRequiredButMissing = product.has_sizes && !selectedSize;

//   return (
//     <div className="min-h-screen bg-white-bg pt-24 pb-24">
//       <div className="container mx-auto px-4">
        
//         {/* Breadcrumb */}
//         <div className="flex items-center space-x-2 text-sm text-muted-maroon mb-8 overflow-x-auto whitespace-nowrap md:overflow-visible pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           <Link to="/" className="hover:text-maroon-light flex-shrink-0">Home</Link>
//           <ChevronRight size={14} className="flex-shrink-0" />
//           <Link to="/shop" className="hover:text-maroon-light flex-shrink-0">Shop</Link>
//           <ChevronRight size={14} className="flex-shrink-0" />
//           <Link to={`/category/${product.category_name?.toLowerCase()}`} className="hover:text-maroon-light flex-shrink-0">{product.category_name}</Link>
//           <ChevronRight size={14} className="flex-shrink-0" />
//           <span className="text-dark-maroon truncate max-w-[180px] md:max-w-[200px] flex-shrink-0">{product.name}</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
//           {/* Image Gallery */}
//           <div className="flex flex-col md:flex-col-reverse lg:flex-row-reverse xl:flex-row-reverse gap-4">
//             <div className="relative flex-grow aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
//               <AnimatePresence mode="wait">
//                 <motion.img 
//                   key={activeImage}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   src={displayImages[activeImage]?.image || 'https://via.placeholder.com/600x800'} 
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               </AnimatePresence>

//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/15 backdrop-blur-sm md:hidden z-10">
//                 {displayImages.map((_, idx) => (
//                   <div 
//                     key={idx} 
//                     className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'w-3.5 bg-white' : 'w-1.5 bg-white/50'}`}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="flex md:flex-row lg:flex-col xl:flex-col gap-4 overflow-x-auto md:overflow-x-auto lg:overflow-x-visible lg:w-24 flex-shrink-0 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//               {displayImages.map((img, idx) => (
//                 <button 
//                   key={idx}
//                   onClick={() => setActiveImage(idx)}
//                   className={`relative aspect-[3/4] w-16 md:w-20 lg:w-full rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${activeImage === idx ? 'border-maroon-light' : 'border-transparent hover:border-cream-beige'}`}
//                 >
//                   <img src={img.image} alt="" className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Details Section */}
//           <div className="flex flex-col pt-4">
//             <h1 className="text-3xl md:text-4xl font-serif text-dark-maroon mb-2 leading-tight">{product.name}</h1>
//             <p className="text-muted-maroon mb-6 text-sm md:text-base">Product Code: {product.code}</p>
            
//             <div className="flex items-end gap-4 mb-8 pb-8 border-b border-cream-beige/50">
//               <span className="text-3xl font-bold text-dark-maroon">₹{product.price}</span>
//               {product.original_price > product.price && (
//                 <>
//                   <span className="text-xl text-muted-maroon line-through mb-1">₹{product.original_price}</span>
//                   <span className="text-sm font-bold text-maroon-light bg-maroon-light/10 px-2 py-1 rounded mb-1">
//                     {product.discount_percentage}% OFF
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Colors */}
//             {product.available_colors && product.available_colors.length > 0 && (
//               <div className="mb-8">
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="font-medium text-dark-maroon text-base md:text-lg">Color: {selectedColor?.name}</span>
//                 </div>
//                 <div className="flex flex-wrap gap-3">
//                   {product.available_colors.map(color => (
//                     <button
//                       key={color.id}
//                       onClick={() => handleColorSelect(color)}
//                       className={`w-11 h-11 md:w-10 md:h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor?.id === color.id ? 'border-maroon-light scale-110' : 'border-transparent hover:scale-110 active:scale-95'}`}
//                     >
//                       <span 
//                         className="w-9 h-9 md:w-8 md:h-8 rounded-full shadow-sm border border-black/10" 
//                         style={{ backgroundColor: color.color }}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Sizes */}
//             {product.has_sizes && (
//               <div className="mb-8">
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="font-medium text-dark-maroon text-base md:text-lg">Size</span>
//                 </div>
//                 <div className="flex flex-wrap gap-3">
//                   {availableVariants.map(variant => {
//                     const isAvailable = variant.stock > 0;
//                     return (
//                       <button
//                         key={variant.id}
//                         disabled={!isAvailable}
//                         onClick={() => setSelectedSize(variant.size)}
//                         className={`min-w-[3.5rem] md:min-w-[3rem] h-12 px-4 rounded-lg border flex items-center justify-center font-medium transition-all ${
//                           !isAvailable 
//                             ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' 
//                             : selectedSize === variant.size 
//                               ? 'bg-dark-maroon text-white border-dark-maroon shadow-sm' 
//                               : 'bg-white text-dark-maroon border-cream-beige hover:border-maroon-light active:border-maroon-light'
//                         }`}
//                       >
//                         {variant.size}
//                       </button>
//                     )
//                   })}
//                 </div>
//                 {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
//                   <p className="text-maroon-light text-sm mt-2 font-medium">Only {selectedVariant.stock} left in stock!</p>
//                 )}
//               </div>
//             )}

//             {/* Quantity Controls */}
//             <div className="mb-8 flex items-center gap-4">
//               <span className="font-medium text-dark-maroon text-base md:text-lg">Quantity</span>
//               <div className="flex items-center border border-cream-beige rounded-full bg-white shadow-sm">
//                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-dark-maroon font-semibold hover:text-maroon-light active:bg-gray-50 rounded-l-full select-none">-</button>
//                 <span className="w-10 text-center font-medium text-base select-none">{quantity}</span>
//                 <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-dark-maroon font-semibold hover:text-maroon-light active:bg-gray-50 rounded-r-full select-none">+</button>
//               </div>
//             </div>

//             {/* Action Buttons Container */}
//             <div className="flex gap-3 md:gap-4 mb-10 w-full">
//               {isSizeRequiredButMissing ? (
//                 <>
//                   <div className="flex-grow h-12 text-sm md:text-base px-2 rounded-xl bg-[#f4f4f4] text-[#939393] border border-gray-200/60 flex items-center justify-center font-medium select-none cursor-not-allowed">
//                     <span className="truncate">Select Size</span>
//                   </div>

//                   <div className="flex-grow h-12 text-sm md:text-base px-2 rounded-xl bg-[#ececec] text-[#939393] flex items-center justify-center font-medium select-none cursor-not-allowed">
//                     <span className="truncate">Select Size</span>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <Button 
//                     variant="accent" 
//                     size="lg" 
//                     className="flex-grow h-12 text-sm md:text-base px-2 flex items-center justify-center"
//                     onClick={handleAddToCart}
//                     disabled={product.is_sold_out}
//                   >
//                     <ShoppingBag size={20} className="mr-2 flex-shrink-0" />
//                     <span className="truncate">
//                       {product.is_sold_out ? 'Out of Stock' : 'Add to Cart'}
//                     </span>
//                   </Button>
                  
//                   <Button 
//                     variant="primary" 
//                     size="lg" 
//                     className="flex-grow h-12 bg-dark-maroon text-white hover:bg-maroon-light text-sm md:text-base px-2 flex items-center justify-center font-semibold"
//                     onClick={handleBuyNow}
//                     disabled={product.is_sold_out}
//                   >
//                     <span className="truncate">Buy Now</span>
//                   </Button>
//                 </>
//               )}
//             </div>

//             {/* Description Details */}
//             <div className="border-t border-cream-beige/50 pt-8">
//               <h3 className="text-lg font-serif font-bold text-dark-maroon mb-4">Product Details</h3>
//               <div className="text-muted-maroon leading-relaxed space-y-4 text-sm md:text-base">
//                 <p>{product.description}</p>
//               </div>
//             </div>
            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ChevronRight, Share2, ImageIcon } from 'lucide-react';
import { productService } from '../services/productService';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, toggleWishlist, wishlist } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      if (data && data.available_colors?.length > 0) {
        const firstColor = data.available_colors[0];
        setSelectedColor(firstColor);
        
        const imgIndex = data.images?.findIndex(img => img.color === firstColor.id);
        if(imgIndex >= 0) setActiveImage(imgIndex);
        else setActiveImage(0);

        // Auto-select size if only ONE variant exists for this color
        const colorVariants = data.variants?.filter(v => v.color?.id === firstColor.id) || [];
        if (data.has_sizes && colorVariants.length === 1) {
          setSelectedSize(colorVariants[0].size);
        } else {
          setSelectedSize(null);
        }
      } else if (data && data.has_sizes) {
        if (data.variants?.length === 1) {
          setSelectedSize(data.variants[0].size);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-32 pb-24 flex justify-center"><div className="animate-pulse w-10 h-10 border-4 border-maroon-light rounded-full border-t-transparent animate-spin"></div></div>;
  if (!product) return <div className="min-h-screen pt-32 text-center"><h1 className="text-2xl font-serif">Product Not Found</h1></div>;

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const availableVariants = product.variants.filter(v => v.color?.id === selectedColor?.id);
  const selectedVariant = availableVariants.find(v => v.size === selectedSize);

  const colorImages = product.images?.filter(img => img.color === selectedColor?.id) || [];
  const displayImages = colorImages.length > 0 ? colorImages : (product.images || []);

  // Extraction tool that returns string URL or null instead of placeholder strings
  const getProductImageSrc = (imgObj) => {
    if (!imgObj) return null;
    return typeof imgObj === 'string' ? imgObj : (imgObj.image || imgObj.url || null);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    
    // Recalculate specific index targets safely
    const filteredImages = product.images?.filter(img => img.color === color.id) || [];
    if (filteredImages.length > 0) {
      setActiveImage(0);
    } else {
      setActiveImage(0);
    }

    const variantsForColor = product.variants.filter(v => v.color?.id === color.id);
    if (product.has_sizes && variantsForColor.length === 1) {
      setSelectedSize(variantsForColor[0].size);
    } else {
      setSelectedSize(null);
    }
  };

  const getVariantToAdd = () => {
    const variantImage = displayImages.length > 0 ? getProductImageSrc(displayImages[0]) : null;
    const baseVariant = selectedVariant || product.variants[0] || { id: 'default', color: selectedColor, size: selectedSize };
    return { ...baseVariant, image: variantImage };
  };

  const handleAddToCart = () => {
    if (product.has_sizes && !selectedSize) return;
    addToCart(product, getVariantToAdd(), quantity);
  };

  const handleBuyNow = () => {
    if (product.has_sizes && !selectedSize) return;
    
    const buyNowItem = {
      product: product,
      variant: getVariantToAdd(),
      quantity: quantity
    };
    
    navigate('/checkout', { state: { buyNowItem } });
  };

  const isSizeRequiredButMissing = product.has_sizes && !selectedSize;
  const currentImageSrc = displayImages.length > 0 ? getProductImageSrc(displayImages[activeImage]) : null;

  return (
    <div className="min-h-screen bg-white-bg pt-24 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-maroon mb-8 overflow-x-auto whitespace-nowrap md:overflow-visible pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link to="/" className="hover:text-maroon-light flex-shrink-0">Home</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <Link to="/shop" className="hover:text-maroon-light flex-shrink-0">Shop</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <Link to={`/category/${product.category_name?.toLowerCase()}`} className="hover:text-maroon-light flex-shrink-0">{product.category_name}</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <span className="text-dark-maroon truncate max-w-[180px] md:max-w-[200px] flex-shrink-0">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <div className="flex flex-col md:flex-col-reverse lg:flex-row-reverse xl:flex-row-reverse gap-4">
            <div className="relative flex-grow aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
              
              {/* Native Skeleton Loader / Fallback layout if URL fails or is empty */}
              {!currentImageSrc ? (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex flex-col items-center justify-center text-gray-400 gap-2">
                  <ImageIcon size={40} className="stroke-[1.5]" />
                  <span className="text-xs font-medium">Loading image...</span>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage + (selectedColor?.id || '')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={currentImageSrc} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              )}

              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/15 backdrop-blur-sm md:hidden z-10">
                  {displayImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'w-3.5 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails list */}
            {displayImages.length > 1 && (
              <div className="flex md:flex-row lg:flex-col xl:flex-col gap-4 overflow-x-auto md:overflow-x-auto lg:overflow-x-visible lg:w-24 flex-shrink-0 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {displayImages.map((img, idx) => {
                  const thumbSrc = getProductImageSrc(img);
                  return (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-[3/4] w-16 md:w-20 lg:w-full rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-50 ${activeImage === idx ? 'border-maroon-light scale-95' : 'border-transparent hover:border-cream-beige'}`}
                    >
                      {thumbSrc ? (
                        <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col pt-4">
            <h1 className="text-3xl md:text-4xl font-serif text-dark-maroon mb-2 leading-tight">{product.name}</h1>
            <p className="text-muted-maroon mb-6 text-sm md:text-base">Product Code: {product.code}</p>
            
            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-cream-beige/50">
              <span className="text-3xl font-bold text-dark-maroon">₹{product.price}</span>
              {product.original_price > product.price && (
                <>
                  <span className="text-xl text-muted-maroon line-through mb-1">₹{product.original_price}</span>
                  <span className="text-sm font-bold text-maroon-light bg-maroon-light/10 px-2 py-1 rounded mb-1">
                    {product.discount_percentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Colors */}
            {product.available_colors && product.available_colors.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-dark-maroon text-base md:text-lg">Color: {selectedColor?.name}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.available_colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color)}
                      className={`w-11 h-11 md:w-10 md:h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor?.id === color.id ? 'border-maroon-light scale-110' : 'border-transparent hover:scale-110 active:scale-95'}`}
                    >
                      <span 
                        className="w-9 h-9 md:w-8 md:h-8 rounded-full shadow-sm border border-black/10" 
                        style={{ backgroundColor: color.color }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.has_sizes && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-dark-maroon text-base md:text-lg">Size</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableVariants.map(variant => {
                    const isAvailable = variant.stock > 0;
                    return (
                      <button
                        key={variant.id}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`min-w-[3.5rem] md:min-w-[3rem] h-12 px-4 rounded-lg border flex items-center justify-center font-medium transition-all ${
                          !isAvailable 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' 
                            : selectedSize === variant.size 
                              ? 'bg-dark-maroon text-white border-dark-maroon shadow-sm' 
                              : 'bg-white text-dark-maroon border-cream-beige hover:border-maroon-light active:border-maroon-light'
                        }`}
                      >
                        {variant.size}
                      </button>
                    )
                  })}
                </div>
                {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                  <p className="text-maroon-light text-sm mt-2 font-medium">Only {selectedVariant.stock} left in stock!</p>
                )}
              </div>
            )}

            {/* Quantity Controls */}
            <div className="mb-8 flex items-center gap-4">
              <span className="font-medium text-dark-maroon text-base md:text-lg">Quantity</span>
              <div className="flex items-center border border-cream-beige rounded-full bg-white shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-dark-maroon font-semibold hover:text-maroon-light active:bg-gray-50 rounded-l-full select-none">-</button>
                <span className="w-10 text-center font-medium text-base select-none">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-dark-maroon font-semibold hover:text-maroon-light active:bg-gray-50 rounded-r-full select-none">+</button>
              </div>
            </div>

            {/* Action Buttons Container */}
            <div className="flex gap-3 md:gap-4 mb-10 w-full">
              {isSizeRequiredButMissing ? (
                <>
                  <div className="flex-grow h-12 text-sm md:text-base px-2 rounded-xl bg-[#f4f4f4] text-[#939393] border border-gray-200/60 flex items-center justify-center font-medium select-none cursor-not-allowed">
                    <span className="truncate">Select Size</span>
                  </div>

                  <div className="flex-grow h-12 text-sm md:text-base px-2 rounded-xl bg-[#ececec] text-[#939393] flex items-center justify-center font-medium select-none cursor-not-allowed">
                    <span className="truncate">Select Size</span>
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="accent" 
                    size="lg" 
                    className="flex-grow h-12 text-sm md:text-base px-2 flex items-center justify-center"
                    onClick={handleAddToCart}
                    disabled={product.is_sold_out}
                  >
                    <ShoppingBag size={20} className="mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {product.is_sold_out ? 'Out of Stock' : 'Add to Cart'}
                    </span>
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="flex-grow h-12 bg-dark-maroon text-white hover:bg-maroon-light text-sm md:text-base px-2 flex items-center justify-center font-semibold"
                    onClick={handleBuyNow}
                    disabled={product.is_sold_out}
                  >
                    <span className="truncate">Buy Now</span>
                  </Button>
                </>
              )}
            </div>

            {/* Description Details */}
            <div className="border-t border-cream-beige/50 pt-8">
              <h3 className="text-lg font-serif font-bold text-dark-maroon mb-4">Product Details</h3>
              <div className="text-muted-maroon leading-relaxed space-y-4 text-sm md:text-base">
                <p>{product.description}</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
