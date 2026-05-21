import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import banner from "../assets/banner.jpg";
export const Home = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [images, cats, prods] = await Promise.all([
        productService.getHeroImages(),
        productService.getCategories(),
        productService.getProducts()
      ]);
      setHeroImages(images);
      setCategories(cats);
      setProducts(prods.slice(0, 8)); // Top 8 featured
    };
    fetchData();
  }, []);

  // Auto-slide hero
  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <div className="min-h-screen bg-white-bg">
      {/* Hero Section */}
      {/* ================= MOBILE HERO ================= */}
<section className="bg-cream-beige md:hidden relative pt-20 pb-6">
  <div className="px-4">
    <div className="bg-cream-beige flex flex-col items-center">

      {/* Full Banner */}
      <Link to="/shop" className="w-full">
        <img
          src={banner}
          alt="Variety Showroom"
          className="w-full h-auto object-contain rounded-lg shadow-xl"
        />
      </Link>

      {/* Button */}
      <Link to="/shop">
        <button className="mt-4 px-5 py-2 text-sm bg-dark-maroon text-white rounded-lg font-semibold">
          Shop Now
        </button>
      </Link>

    </div>
  </div>
</section>

{/* ================= DESKTOP HERO ================= */}
<section className="bg-cream-beige py-20 hidden md:block">
  <div className="container mx-auto px-4">

    <div className="relative flex justify-center">

      <img
        src={banner}
        alt="Variety Showroom"
        className="w-full max-w-5xl h-auto object-contain"
      />

      <div className="absolute bottom-14 left-90 flex gap-4">
        <Link to="/shop">
          <button className="btn-primary">
            Shop Now
          </button>
        </Link>

        <Link to="/category/women">
          <button className="btn-secondary">
            Explore Collection
          </button>
        </Link>
      </div>

    </div>

  </div>
</section>

      {/* Trending Categories */}
      <section className="py-24 bg-white-bg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif text-dark-maroon mb-2">Trending Categories</h2>
              <p className="text-muted-maroon">Discover what's hot right now</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-maroon-light font-medium hover:text-maroon-light transition-colors">
              View All <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={`/category/${cat.slug}`} className="group block text-center">
                  <div className="relative aspect-square overflow-hidden rounded-full bg-cream-beige/30 mb-4 p-2 border-2 border-transparent group-hover:border-maroon-light transition-all duration-300">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-serif text-lg text-dark-maroon group-hover:text-maroon-light transition-colors">{cat.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-24 bg-white-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-dark-maroon mb-4">Latest Arrivals</h2>
            <p className="text-muted-maroon max-w-2xl mx-auto">Explore our newest additions and fresh styles.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.map(product => (
              <ProductCard key={`latest-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Collection */}
      <section className="py-24 bg-cream-beige/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-dark-maroon mb-4">Popular Collection</h2>
            <p className="text-muted-maroon max-w-2xl mx-auto">Handpicked styles combining elegance, comfort, and the latest trends.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="outline" size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white-bg relative overflow-hidden">
  {/* Decorative Background */}
  <div className="absolute inset-0 opacity-40">
    <div className="absolute top-0 left-0 w-72 h-72 bg-cream-beige rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-72 h-72 bg-border-beige rounded-full blur-3xl"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-dark-maroon mb-4">
        Why Choose Variety Showroom
      </h2>

      <p className="text-muted-maroon text-lg max-w-2xl mx-auto">
        Trending fashion at affordable range for your complete family.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Card 1 */}
      <div className="card-soft hover-lift p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-maroon flex items-center justify-center">
          <Star size={40} className="text-white-bg" />
        </div>

        <h3 className="text-2xl font-bold text-dark-maroon mb-4">
          Premium Quality
        </h3>

        <p className="text-muted-maroon leading-relaxed">
          Handpicked fabrics and flawless stitching for elegant comfort.
        </p>
      </div>

      {/* Card 2 */}
      <div className="card-soft hover-lift p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-maroon flex items-center justify-center">
          <Truck size={40} className="text-white-bg" />
        </div>

        <h3 className="text-2xl font-bold text-dark-maroon mb-4">
          Fast Delivery
        </h3>

        <p className="text-muted-maroon leading-relaxed">
          Reliable doorstep delivery with smooth shopping experience.
        </p>
      </div>

      {/* Card 3 */}
      <div className="card-soft hover-lift p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-maroon flex items-center justify-center">
          <ShieldCheck size={40} className="text-white-bg" />
        </div>

        <h3 className="text-2xl font-bold text-dark-maroon mb-4">
          Secure Payments
        </h3>

        <p className="text-muted-maroon leading-relaxed">
          Safe and trusted payment methods for worry-free checkout.
        </p>
      </div>

      {/* Card 4 */}
      <div className="card-soft hover-lift p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-maroon flex items-center justify-center">
          <Clock size={40} className="text-white-bg" />
        </div>

        <h3 className="text-2xl font-bold text-dark-maroon mb-4">
          Open 365 Days
        </h3>

        <p className="text-muted-maroon leading-relaxed">
          Always open to serve your family fashion shopping needs.
        </p>
      </div>

    </div>
  </div>
</section>
    </div>
  );
};
