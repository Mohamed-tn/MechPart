import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Search, PlusCircle, User, LogOut, Package, MapPin, Filter, Menu, X, ChevronRight, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { useAuthStore } from './store/authStore';

// Components
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">MechPart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">Browse Parts</Link>
            {user ? (
              <>
                <Link to="/sell" className="flex items-center space-x-1 text-sm font-medium text-orange-600 hover:text-orange-700">
                  <PlusCircle className="w-4 h-4" />
                  <span>Sell Part</span>
                </Link>
                <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-orange-600">Dashboard</Link>
                <button onClick={() => { logout(); navigate('/'); }} className="text-sm font-medium text-gray-600 hover:text-red-600">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-all">Sign In</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/browse" className="block text-base font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>Browse Parts</Link>
              {user ? (
                <>
                  <Link to="/sell" className="block text-base font-medium text-orange-600" onClick={() => setIsMenuOpen(false)}>Sell Part</Link>
                  <Link to="/dashboard" className="block text-base font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }} className="block text-base font-medium text-red-600">Logout</button>
                </>
              ) : (
                <Link to="/login" className="block text-base font-medium text-orange-600" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ProductCard = ({ product }: { product: any, key?: any }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
  >
    <Link to={`/product/${product.id}`}>
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider rounded">
            {product.condition}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
          <span className="text-orange-600 font-bold">${product.price}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center text-[10px] text-gray-400 space-x-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Package className="w-3 h-3" />
            <span>{product.category}</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

// Pages
const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/garage/1920/1080?blur=4" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
          >
            Find the <span className="text-orange-500">Perfect Part</span> for Your Machine
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto font-medium"
          >
            The most trusted marketplace for used car, motorcycle, and industrial parts. Buy direct from sellers and save up to 70%.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center px-4 w-full">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="Search engine, brakes, suspension..." 
                className="w-full py-3 outline-none text-gray-900 font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && navigate(`/browse?search=${search}`)}
              />
            </div>
            <button 
              onClick={() => navigate(`/browse?search=${search}`)}
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all w-full md:w-auto"
            >
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Listings</h2>
            <p className="text-gray-500 mt-1">Hand-picked quality parts from verified sellers.</p>
          </div>
          <Link to="/browse" className="text-orange-600 font-bold flex items-center hover:underline">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-12 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Engine', 'Suspension', 'Electrical', 'Body', 'Interior', 'Brakes'].map((cat) => (
              <Link 
                key={cat}
                to={`/browse?category=${cat.toLowerCase()}`}
                className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:border-orange-500 transition-all group"
              >
                <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors">
                  <Package className="w-6 h-6 text-orange-600 group-hover:text-white" />
                </div>
                <span className="font-bold text-gray-900">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Browse = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: new URLSearchParams(window.location.search).get('search') || '',
    category: new URLSearchParams(window.location.search).get('category') || '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Search</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Category</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  <option value="engine">Engine</option>
                  <option value="suspension">Suspension</option>
                  <option value="electrical">Electrical</option>
                  <option value="body">Body</option>
                  <option value="interior">Interior</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Max"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{products.length} Parts Found</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
          {products.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No parts found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        if (isRegister) {
          toast.success('Registration successful! Please login.');
          setIsRegister(false);
        } else {
          setAuth(data.user, data.token);
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-gray-500 mt-2">{isRegister ? 'Join the marketplace today' : 'Sign in to manage your listings'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
          >
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm font-medium text-orange-600 hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProductDetail = () => {
  const [product, setProduct] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100">
            <img src={product.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">
                {product.condition}
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">{product.title}</h1>
            <p className="text-3xl font-bold text-orange-600">${product.price}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Compatibility</p>
                <p className="text-sm font-medium text-gray-700">{product.compatibility}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                <p className="text-sm font-medium text-gray-700">{product.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200">
              Contact Seller
            </button>
            <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Heart className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sell = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'used',
    category: 'engine',
    compatibility: '',
    location: '',
    images: ['https://picsum.photos/seed/part/800/600']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, price: Number(formData.price) })
      });
      if (res.ok) {
        toast.success('Listing created successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Failed to create listing');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">List a New Part</h1>
        <p className="text-gray-500 mt-2">Provide details about your mechanical part to reach buyers.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Part Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. V6 Engine Block, Brake Pads..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Price ($)</label>
              <input 
                type="number" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Category</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="engine">Engine</option>
                <option value="suspension">Suspension</option>
                <option value="electrical">Electrical</option>
                <option value="body">Body</option>
                <option value="interior">Interior</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Compatibility</label>
            <input 
              type="text" 
              placeholder="e.g. BMW E46, Toyota Camry 2010-2015"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
              value={formData.compatibility}
              onChange={(e) => setFormData({...formData, compatibility: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Location</label>
            <input 
              type="text" 
              placeholder="City, Country"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Description</label>
            <textarea 
              required
              rows={5}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>
        <button 
          type="submit"
          className="w-full bg-orange-600 text-white py-5 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-200 text-lg"
        >
          Post Listing
        </button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const { user, token } = useAuthStore();
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setMyProducts(data.filter((p: any) => p.sellerId === user?.id)));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMyProducts(myProducts.filter((p: any) => p.id !== id));
        toast.success('Listing deleted');
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">My Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your listings and account settings.</p>
        </div>
        <Link to="/sell" className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" /> New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Your Listings</h2>
          {myProducts.length === 0 ? (
            <div className="bg-gray-50 p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You haven't listed any parts yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myProducts.map((p: any) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                  <img src={p.images[0]} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{p.title}</h3>
                    <p className="text-sm text-orange-600 font-bold">${p.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Info</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <User className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Name</p>
                  <p className="font-bold text-gray-900">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Package className="text-gray-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                  <p className="font-bold text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Toaster position="top-center" richColors />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-6 h-6 text-orange-500" />
                  <span className="text-xl font-bold tracking-tight">MechPart</span>
                </div>
                <p className="text-gray-400 text-sm">The world's leading marketplace for used mechanical parts. Quality guaranteed.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-orange-500">Marketplace</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/browse">Browse Parts</Link></li>
                  <li><Link to="/sell">Sell a Part</Link></li>
                  <li><Link to="/browse?category=engine">Engines</Link></li>
                  <li><Link to="/browse?category=suspension">Suspension</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-orange-500">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Safety Tips</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-orange-500">Newsletter</h4>
                <p className="text-gray-400 text-sm mb-4">Get the latest deals and parts updates.</p>
                <div className="flex">
                  <input type="email" placeholder="Email" className="bg-gray-800 border-none rounded-l-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-orange-500" />
                  <button className="bg-orange-600 px-4 py-2 rounded-r-lg hover:bg-orange-700 transition-all">Join</button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
              © 2026 MechPart Marketplace. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
