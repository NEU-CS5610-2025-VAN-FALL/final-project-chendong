// client/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Homepage
function Homepage() {
  return (
    <div style={{padding: 20}}>
      <h1>Welcome to NEU Bistro</h1>
      <nav>
        <Link to="/menu">View Menu</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
    </div>
  );
}

// Register page
function Register() {
  const [email, setE] = useState('');
  const [password, setP] = useState('');
  const nav = useNavigate();
  const handle = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password})
    });
    if(res.ok) nav('/menu'); else alert('Register Failed');
  };
  return (
    <div style={{padding: 20}}>
      <h2>Register</h2>
      <form onSubmit={handle}>
        <input placeholder="Email" onChange={e=>setE(e.target.value)} required/>
        <input type="password" placeholder="Password" onChange={e=>setP(e.target.value)} required/>
        <button>Register</button>
      </form>
    </div>
  );
}

// Login page
function Login() {
  const [email, setE] = useState('');
  const [password, setP] = useState('');
  const nav = useNavigate();
  const handle = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password}), credentials: 'include'
    });
    if(res.ok) nav('/menu'); else alert('Login Failed, try again');
  };
  return (
    <div style={{padding: 20}}>
      <h2>Login</h2>
      <form onSubmit={handle}>
        <input placeholder="Email" onChange={e=>setE(e.target.value)} required/>
        <input type="password" placeholder="Password" onChange={e=>setP(e.target.value)} required/>
        <button>Login</button>
      </form>
    </div>
  );
}

// Menu page
function Menu() {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nav = useNavigate();
  
  useEffect(() => { 
    // 1. Get menu
    fetch('http://localhost:3000/api/menu').then(r=>r.json()).then(setItems); 

    // 2. Check Login status
    fetch('http://localhost:3000/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.loggedIn) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      });
  }, []);
  
  const logout = async () => { 
    const res = await fetch('http://localhost:3000/api/auth/logout', {method:'POST', credentials: 'include'}); 
    if (res.ok) {
        alert("Logged out successfully."); 
        setIsLoggedIn(false);  // Update status immediately
        setItems([]); 
        nav('/'); 
    }
  };
  
  return (
    <div style={{padding: 20}}>
      <h2>Menu Items</h2>
      {isLoggedIn ? (
        <button onClick={logout} style={{backgroundColor: '#ffcccc'}}>Logout</button>
      ) : (
        <button onClick={() => nav('/login')} style={{backgroundColor: '#ccffcc'}}>Login</button>
      )}
      
      <br/><br/>
      <Link to="/add">➕ Add New Item (Protected)</Link>
      <ul>
        {items.map(i => <li key={i.id}><strong>{i.name}</strong>: ${i.price}</li>)}
      </ul>
    </div>
  );
}

// Add item page
function AddItem() {
  const [name, setN] = useState('');
  const [price, setP] = useState('');
  const nav = useNavigate();
  const handle = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/menu', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name, price}), credentials: 'include'
    });
    if(res.status===401) { alert('Please Login First!'); nav('/login'); }
    else if(res.ok) nav('/menu');
  };
  return (
    <div style={{padding: 20}}>
      <h2>Add Item</h2>
      <form onSubmit={handle}>
        <input placeholder="Item Name" onChange={e=>setN(e.target.value)} required/>
        <input type="number" placeholder="Price" onChange={e=>setP(e.target.value)} required/>
        <button>Add Item</button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/add" element={<AddItem />} />
      </Routes>
    </BrowserRouter>
  );
}