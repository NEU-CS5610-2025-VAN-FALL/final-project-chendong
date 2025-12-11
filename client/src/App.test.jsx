import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

// Mock global fetch
global.fetch = vi.fn();

describe('NEU Bistro App Tests', () => {
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default Mock Implementation
    global.fetch.mockImplementation((url) => {
      const urlStr = String(url);

      // 1. External API (TheMealDB)
      if (urlStr.includes('themealdb.com')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ 
            meals: [{ strMeal: 'Test Meal', strMealThumb: 'test.jpg', strCategory: 'Test', strArea: 'Test', strSource: '#' }] 
          }),
        });
      }
      
      // 2. Auth Endpoint (Default: Not logged in)
      if (urlStr.includes('/auth/me')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ loggedIn: false }), 
        });
      }

      // 3. Menu Endpoint (Return empty array to prevent map errors)
      if (urlStr.includes('/menu')) {
        return Promise.resolve({
          ok: true,
          json: async () => [], 
        });
      }

      // Default fallback for any other requests
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  // ✅ Test 1: Target Homepage Component
  it('renders the Homepage with correct branding', async () => {
    render(<App />);
    
    const brandElements = await screen.findAllByText(/NEU Bistro/i);
    expect(brandElements.length).toBeGreaterThan(0);
    
    const orderBtns = screen.getAllByText(/Order Now/i);
    expect(orderBtns[0]).toBeInTheDocument();
  });

  // ✅ Test 2: Target AuthForm Component (Register)
  it('navigates to Register page and shows validation error', async () => {
    render(<App />);
    
    const signUpLinks = screen.getAllByText(/Sign Up/i);
    fireEvent.click(signUpLinks[0]); 
    
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    
    const submitBtn = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });

  // ✅ Test 3: Target Menu Component
  it('navigates to Menu page successfully', async () => {
    render(<App />);
    
    const menuLinks = screen.getAllByText(/Menu/i);
    fireEvent.click(menuLinks[0]);
    
    const menuHeading = await screen.findByRole('heading', { name: /Menu/i, level: 2 });
    expect(menuHeading).toBeInTheDocument();
  });

  // ✅ Test 4: Navigation to Login Page
  it('navigates to Login page', async () => {
    render(<App />);
    
    const loginLink = screen.getAllByText(/Login/i)[0];
    fireEvent.click(loginLink);
    
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
  });

  // ✅ Test 5: Authenticated User View
  it('shows user name and cart link when logged in', async () => {
    // Override mock to simulate logged-in state
    global.fetch.mockImplementation((url) => {
      const urlStr = String(url);
      
      if (urlStr.includes('/auth/me')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ user: { name: 'Test User', email: 'test@example.com' } }),
        });
      }
      if (urlStr.includes('themealdb.com')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ meals: [] }) 
        });
      }
      if (urlStr.includes('/menu')) return Promise.resolve({ ok: true, json: async () => [] });
      
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });

    const cartLink = screen.getByLabelText(/Cart/i);
    expect(cartLink).toBeInTheDocument();
  });
});