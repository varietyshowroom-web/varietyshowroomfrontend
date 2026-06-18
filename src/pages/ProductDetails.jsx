import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ChevronRight, Share2, Ruler } from 'lucide-react';
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
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-32 pb-24 flex justify-center"><div className="animate-pulse w-10 h-10 border-4 border-maroon-light rounded-full border-t-transparent animate-spin"></div></div>;
  if (!product) return <div className="min-h-screen pt-32 text-center"><h1 className="text-2xl font-serif">Product Not Found</h1></div>;

  const isWishlisted = wishlist.some(item => item.id === product.id);

  // Filter variants by selected color to get available sizes
  const availableVariants = product.variants.filter(v => v.color?.id === selectedColor?.id);
  const selectedVariant = availableVariants.find(v => v.size === selectedSize);

  const colorImages = product.images?.filter(img => img.color === selectedColor?.id) || [];
  const displayImages = colorImages.length > 0 ? colorImages : (product.images || []);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setActiveImage(0); // Reset to first image of the new color set
  };

  const getVariantToAdd = () => {
    const variantImage = displayImages.length > 0 ? displayImages[0].image : null;
    const baseVariant = selectedVariant || product.variants[0] || { id: 'default', color: selectedColor, size: selectedSize };
    return { ...baseVariant, image: variantImage };
  };

  const handleAddToCart = () => {
    if (product.has_sizes && !selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, getVariantToAdd(), quantity);
  };

  const handleBuyNow = () => {
    if (product.has_sizes && !selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, getVariantToAdd(), quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white-bg pt-24 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-maroon mb-8">
          <Link to="/" className="hover:text-maroon-light">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-maroon-light">Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/category/${product.category_name?.toLowerCase()}`} className="hover:text-maroon-light">{product.category_name}</Link>
          <ChevronRight size={14} />
          <span className="text-dark-maroon truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 flex-shrink-0">
              {displayImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-maroon-light' : 'border-transparent hover:border-cream-beige'}`}
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative flex-grow aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={displayImages[activeImage]?.image || 'https://via.placeholder.com/600x800'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <button 
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-lg transition-colors z-10 ${
                  isWishlisted ? 'text-maroon-light' : 'text-dark-maroon hover:text-maroon-light'
                }`}
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col pt-4">
            <h1 className="text-3xl md:text-4xl font-serif text-dark-maroon mb-2">{product.name}</h1>
            <p className="text-muted-maroon mb-6">Product Code: {product.code}</p>
            
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
                  <span className="font-medium text-dark-maroon">Color: {selectedColor?.name}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.available_colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor?.id === color.id ? 'border-maroon-light scale-110' : 'border-transparent hover:scale-110'}`}
                    >
                      <span 
                        className="w-8 h-8 rounded-full shadow-sm border border-black/10" 
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
                  <span className="font-medium text-dark-maroon">Size</span>
                  {/* <button className="text-sm text-maroon-light hover:underline flex items-center">
                    <Ruler size={14} className="mr-1"/> Size Guide
                  </button> */}
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableVariants.map(variant => {
                    const isAvailable = variant.stock > 0;
                    return (
                      <button
                        key={variant.id}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`min-w-[3rem] h-12 px-4 rounded-lg border flex items-center justify-center font-medium transition-colors ${
                          !isAvailable 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' 
                            : selectedSize === variant.size 
                              ? 'bg-dark-maroon text-white border-dark-maroon' 
                              : 'bg-white text-dark-maroon border-cream-beige hover:border-maroon-light'
                        }`}
                      >
                        {variant.size}
                      </button>
                    )
                  })}
                </div>
                {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                  <p className="text-maroon-light text-sm mt-2">Only {selectedVariant.stock} left in stock!</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8 flex items-center gap-4">
              <span className="font-medium text-dark-maroon">Quantity</span>
              <div className="flex items-center border border-cream-beige rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-dark-maroon hover:text-maroon-light">-</button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-dark-maroon hover:text-maroon-light">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <Button 
                variant="accent" 
                size="lg" 
                className="flex-grow"
                onClick={handleAddToCart}
                disabled={product.is_sold_out || (product.has_sizes && !selectedSize)}
              >
                <ShoppingBag size={20} className="mr-2" />
                {product.is_sold_out ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                className="flex-grow bg-dark-maroon text-white hover:bg-maroon-light transition-colors"
                onClick={handleBuyNow}
                disabled={product.is_sold_out || (product.has_sizes && !selectedSize)}
              >
                Buy Now
              </Button>
              <Button variant="secondary" className="px-4">
                <Share2 size={20} />
              </Button>
            </div>

            {/* Description */}
            <div className="border-t border-cream-beige/50 pt-8">
              <h3 className="text-lg font-serif font-bold text-dark-maroon mb-4">Product Details</h3>
              <div className="text-muted-maroon leading-relaxed space-y-4">
                <p>{product.description}</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
