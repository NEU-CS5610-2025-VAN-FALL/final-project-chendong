import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Package, LogOut, Plus, ChefHat, MapPin, Utensils, Star, ArrowRight, Menu as MenuIcon, X, AlertCircle, CheckCircle, Flame, Clock, Trash2, RefreshCw } from 'lucide-react';

// ==========================================
// CONFIGURATION
// ==========================================
const USE_MOCK_BACKEND = false; 
const API_BASE_URL = 'http://localhost:3000/api';

// ==========================================
// STYLES & ANIMATIONS
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-slide-up { animation: slideUp 0.5s ease-out; }
    body { background-color: #f9fafb; color: #111827; }
  `}</style>
);

// ==========================================
// API LAYER
// ==========================================
const api = {
  request: async (endpoint, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const config = { method, headers, credentials: 'include' };
    if (body) config.body = JSON.stringify(body);
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
        return res;
    } catch (e) {
        console.error("API Error", e);
        return { ok: false, status: 500 };
    }
  }
};

// --- Context ---
const AppContext = createContext();

// --- Components ---

function DailyFoodRecommendation() {
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchRecommendation = () => {
    setLoading(true);
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(res => res.json())
      .then(data => { 
        setFood(data.meals[0]); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error(err); 
        setLoading(false); 
      });
  };

  // Initialization
  useEffect(() => {
    fetchRecommendation();
  }, []);

  if (loading) return (
    <div className="animate-pulse flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto h-40 justify-center">
      <div className="text-orange-800 font-bold flex items-center gap-2">
        <RefreshCw className="animate-spin" size={20} /> Finding the best dish...
      </div>
    </div>
  );

  if (!food) return null;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-orange-100 group hover:shadow-md transition-all duration-300 max-w-4xl mx-auto">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-red-500"></div>
      <div className="flex items-center">
        {/* image area */}
        <div className="w-32 h-32 overflow-hidden relative shrink-0">
            <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame size={10} className="text-orange-400" /> Chef's Pick
            </div>
            <img src={food.strMealThumb} alt={food.strMeal} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
        </div>
        
        {/* content area */}
        <div className="p-4 flex-1 flex flex-col justify-center h-full relative">
          {/* Refresh button ---- User Interaction */}
          <button 
            onClick={fetchRecommendation}
            className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 transition-colors p-1 rounded-full hover:bg-orange-50"
            title="Get another recommendation"
            aria-label="Get another recommendation"
          >
            <RefreshCw size={16} />
          </button>

          <div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1 leading-tight pr-8">{food.strMeal}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-800 border border-orange-100">
                  <Utensils size={10} className="mr-1" /> {food.strCategory}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-100">
                  <MapPin size={10} className="mr-1" /> {food.strArea}
                </span>
            </div>
          </div>
          <a 
            href={food.strSource} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center text-xs font-semibold text-orange-700 hover:text-orange-900 transition-colors"
            aria-label={`View recipe for ${food.strMeal}`}
          >
            View Recipe <ArrowRight size={12} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Homepage() {
  return (
    <main className="max-w-6xl mx-auto px-4 space-y-12 py-6 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gray-900 text-white shadow-lg mx-auto max-w-5xl h-64 md:h-80">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-50" alt="Hero Background"/>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        </div>
        <div className="relative z-10 px-8 h-full flex flex-col justify-center max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">NEU Bistro</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-6 font-light max-w-md">
            Order from our curated menu of top-tier dishes on campus.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/menu" className="inline-flex items-center justify-center gap-2 bg-orange-700 hover:bg-orange-800 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all">
              <Utensils size={16} /> Order Now
            </Link> 
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all">
               Sign Up
            </Link>
          </div>
        </div>
      </section>
      
      {/* Recommendation Section */}
      <section>
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Star size={18} className="text-yellow-500 fill-yellow-500"/> Featured Today</h2>
        </div>
        <DailyFoodRecommendation />
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="group p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-3"><Clock size={16}/></div>
            <h3 className="font-bold text-base mb-1 text-gray-900">15 Min Pickup</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Order ahead and skip the line between classes.</p>
          </div>
          <div className="group p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="w-8 h-8 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center mb-3"><ChefHat size={16}/></div>
            <h3 className="font-bold text-base mb-1 text-gray-900">Student Specials</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Affordable meals crafted for students.</p>
          </div>
          <div className="group p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3"><Package size={16}/></div>
            <h3 className="font-bold text-base mb-1 text-gray-900">Eco Packaging</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Sustainable containers for a greener campus.</p>
          </div>
      </section>
    </main>
  );
}

function AuthForm({ type }) {
  const isRegister = type === 'register';
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { refreshAuth } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic level Validation
    if(isRegister && !formData.name) return setError("Oops! Who's there? Your name please");
    if(!formData.email.includes('@')) return setError("Mhmm the email address does not seem right, give it another try");
    if(formData.password.length < 6) return setError("Password must be at least 6-character old to be in, try again");

    setLoading(true);
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    const res = await api.request(endpoint, 'POST', formData);
    setLoading(false);

    if (res.ok) {
      await refreshAuth();
      nav('/menu');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || data.message || "Authentication failed");
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl animate-slide-up border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-orange-50 text-orange-500 mb-4">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          {/* text-gray-600 */}
          <p className="text-gray-600 mt-2 text-sm">{isRegister ? 'Join NEU Bistro' : 'Sign in to access your orders'}</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-3 animate-fade-in">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Full Name</label>
              <input 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Email Address</label>
            <input 
              type="email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Password</label>
            <input 
              type="password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* bg-orange-700 */}
          <button disabled={loading} className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2">
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        {/* text-gray-600 */}
        <div className="mt-8 text-center text-sm text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          {/* text-orange-700 */}
          <Link to={isRegister ? '/login' : '/register'} className="text-orange-700 font-bold hover:underline">
            {isRegister ? 'Login here' : 'Register now'}
          </Link>
        </div>
      </div>
    </main>
  );
}

// Menu page
function Menu() {
  const [items, setItems] = useState([]);
  const { user } = useContext(AppContext);
  const nav = useNavigate();
  
  // Basic authorization check
  const isAdmin = user && user.email === 'admin@neu.edu';
  
  useEffect(() => { 
    api.request('/menu').then(res => res.json()).then(setItems);
  }, []);
  
  const addToCart = async (itemId) => {
    if (!user) return nav('/login');
    const res = await api.request('/cart/items', 'POST', { menuItemId: itemId });
    if (res.ok) {
        alert("Added to cart!"); 
    }
  };

  // Functionality: Delete item (Admin only: admin@neu.edu)
  const deleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const res = await api.request(`/menu/${itemId}`, 'DELETE');
    if (res.ok) {
        setItems(items.filter(i => i.id !== itemId));
        alert("Item deleted!");
    } else {
        alert("Failed to delete item.");
    }
  };
  
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b border-gray-100">
        <div>
            <h2 className="text-3xl font-black text-gray-900 mb-1">Menu</h2>
            <p className="text-gray-500 text-sm">Find your favorite meal below.</p>
        </div>
        {/* Authorization management：admin only */}
        {isAdmin && (
            <Link to="/add" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition font-medium text-xs shadow-md">
                <Plus size={14} /> Admin: Add Item
            </Link>
        )}
      </header>
      
      {/* List layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(i => (
          <article key={i.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-row h-36 hover:shadow-lg hover:border-orange-100 transition-all duration-300">
            {/* Fixed width w-36 (144px) */}
            <div className="w-36 h-full shrink-0 relative bg-gray-100">
                <img 
                    src={i.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                    alt={i.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-0 left-0 p-2">
                    <span className="bg-white/90 backdrop-blur text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm border border-gray-200">
                        {i.category}
                    </span>
                </div>
                {/* 🗑️ Delete button for admin */}
                {isAdmin && (
                    <button
                        onClick={() => deleteItem(i.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full shadow-md hover:bg-red-600 transition-all z-10"
                        title="Delete Item"
                        aria-label="Delete Item"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-1">{i.name}</h3>
                    {/* text-orange-700 */}
                    <span className="text-sm font-bold text-orange-700 shrink-0">${i.price.toFixed(2)}</span>
                </div>
                {/* text-gray-600 */}
                <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{i.description}</p>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-50 flex justify-end">
                {user ? (
                    <button onClick={() => addToCart(i.id)} className="bg-gray-50 text-gray-900 hover:bg-orange-700 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 border border-gray-200 hover:border-orange-700">
                        <ShoppingCart size={14} /> Add
                    </button>
                ) : (
                    <Link to="/login" className="text-xs font-medium text-gray-600 hover:text-orange-700">
                        Login to Add
                    </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const loadCart = () => {
    setLoading(true);
    api.request('/cart').then(res => res.json()).then(data => {
        setCart(data);
        setLoading(false);
    });
  };

  useEffect(() => loadCart(), []);

  const removeItem = async (itemId) => {
    await api.request(`/cart/items/${itemId}`, 'DELETE');
    loadCart(); 
  };

  const checkout = async () => {
    const res = await api.request('/orders/checkout', 'POST');
    if (res.ok) { nav('/orders'); }
    else alert("Checkout failed");
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div></div>;

  const total = cart?.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-slide-up">
      <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingCart className="text-orange-500" size={28}/> Your Cart
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1">
            {(!cart?.orderItems || cart.orderItems.length === 0) ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 mb-6 text-base">Your cart feels a bit light.</p>
                <Link to="/menu" className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-700 transition shadow-lg text-sm">
                    Browse Menu <ArrowRight size={16}/>
                </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {cart.orderItems.map(item => (
                    <li key={item.id} className="p-4 flex gap-4 hover:bg-gray-50 transition items-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <strong className="text-sm font-bold text-gray-900">{item.menuItem.name}</strong>
                                <span className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">Qty: {item.quantity}</span>
                                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 font-medium hover:underline">Remove</button>
                            </div>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            )}
          </div>

          {/* Summary Sidebar */}
          {cart?.orderItems?.length > 0 && (
            <div className="lg:w-80">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-6 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span>$2.99</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (5%)</span>
                            <span>${(total * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-gray-100 my-2"></div>
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>${(total * 1.05 + 2.99).toFixed(2)}</span>
                        </div>
                    </div>
                    <button onClick={checkout} className="w-full bg-black text-white font-bold py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 text-sm">
                        Checkout
                    </button>
                </div>
            </div>
          )}
      </div>
    </main>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.request('/orders').then(res => res.json()).then(setOrders);
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <Package className="text-orange-500" size={28}/> Order History
      </h2>

      {orders.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
            <Package size={40} className="mx-auto text-gray-300 mb-3"/>
            <p className="text-gray-500 text-sm">No past orders found.</p>
          </div>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <Package size={16} className="text-gray-600"/>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-900">Order #{order.id}</span>
                    <span className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 flex items-center gap-1">
                <CheckCircle size={10} /> {order.status}
              </span>
            </div>
            
            <div className="p-4">
                <ul className="space-y-2 mb-4">
                    {order.orderItems.map(item => (
                    <li key={item.id} className="flex justify-between text-xs">
                        <span className="text-gray-600 font-medium"><span className="text-gray-400 mr-2">{item.quantity}x</span> {item.menuItem.name}</span>
                        <span className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                    ))}
                </ul>
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <span className="text-lg font-black text-gray-900">${order.totalAmount}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function AddItem() {
  const [formData, setFormData] = useState({ name: '', price: '' });
  const nav = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if(!user) { alert('Please Login First!'); nav('/login'); }
  }, [user, nav]);

  const handle = async (e) => {
    e.preventDefault();
    const res = await api.request('/menu', 'POST', { 
        name: formData.name, 
        price: parseFloat(formData.price), 
        description: "Custom User Item", 
        category: "Custom" 
    });
    if(res.ok) nav('/menu');
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Item</h2>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="e.g., Super Fries" onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input type="number" step="0.01" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="0.00" onChange={e => setFormData({...formData, price: e.target.value})} required />
          </div>
          <button className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">Add Item</button>
          <Link to="/menu" className="block text-center text-gray-500 text-sm hover:underline">Cancel</Link>
        </form>
      </div>
    </main>
  );
}

function MainLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const nav = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refreshAuth = async () => {
    const res = await api.request('/auth/me');
    if (res.ok) {
        const data = await res.json();
        setUser(data.user);
    } else {
        setUser(null);
    }
  };


  const logout = async () => { 
    await api.request('/auth/logout', 'POST');
    setUser(null); // Clear frontend status instantly
    nav('/'); // Redirect to home page instantly
    await refreshAuth(); // Double confirm backend status
  };

  useEffect(() => { refreshAuth(); }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  return (
    <AppContext.Provider value={{ user, refreshAuth }}>
      <div className="min-h-screen bg-white font-sans text-gray-900 pb-20 selection:bg-orange-100 selection:text-orange-900">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2.5 text-2xl font-black text-gray-900 tracking-tight group">
                  <span className="bg-gradient-to-tr from-orange-500 to-red-600 text-white p-1.5 rounded-xl shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform"><Utensils size={24}/></span>
                  NEU Bistro
                </Link>
              </div>
              
              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className={`font-bold text-sm transition-colors ${location.pathname === '/' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'}`}>Home</Link>
                <Link to="/menu" className={`font-bold text-sm transition-colors ${location.pathname === '/menu' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'}`}>Menu</Link>
                
                {user ? (
                   <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors" aria-label="Cart">
                            <ShoppingCart size={22}/>
                        </Link>
                        <Link to="/orders" className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors" aria-label="Orders">
                            <Package size={22}/>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden lg:block">
                                <span className="block text-xs text-gray-400 font-semibold uppercase tracking-wider">Hello</span>
                                <span className="block text-sm font-bold text-gray-900 leading-none">{user.name}</span>
                            </div>
                            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Logout"><LogOut size={20}/></button>
                        </div>
                   </div>
                ) : (
                  <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                      <Link to="/login" className="font-bold text-sm text-gray-900 hover:text-orange-600 transition">Login</Link>
                      <Link to="/register" className="bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">Get Started</Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition" aria-label="Toggle navigation menu">
                  {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav Panel */}
          {isMobileMenuOpen && (
             <div className="md:hidden bg-white border-t border-gray-100 p-6 space-y-4 shadow-2xl absolute w-full animate-fade-in z-40">
                <Link to="/" className="block text-lg font-bold text-gray-800">Home</Link>
                <Link to="/menu" className="block text-lg font-bold text-gray-800">Menu</Link>
                <div className="h-px bg-gray-100 my-2"></div>
                {user ? (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Signed in as {user.name}</span>
                            <button onClick={logout} className="text-red-500 text-sm font-bold">Logout</button>
                        </div>
                        <Link to="/cart" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl font-bold text-gray-800"><ShoppingCart size={20}/> Cart</Link>
                        <Link to="/orders" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl font-bold text-gray-800"><Package size={20}/> Orders</Link>
                    </>
                ) : (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Link to="/login" className="flex justify-center py-3 bg-gray-50 text-gray-900 rounded-xl font-bold">Login</Link>
                        <Link to="/register" className="flex justify-center py-3 bg-orange-500 text-white rounded-xl font-bold">Sign Up</Link>
                    </div>
                )}
             </div>
          )}
        </nav>

        <div className="pt-6">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/register" element={<AuthForm type="register" />} />
            <Route path="/login" element={<AuthForm type="login" />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/add" element={<AddItem />} />
          </Routes>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <MainLayout />
    </BrowserRouter>
  );
}