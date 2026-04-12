/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const TOKEN_KEY = 'caketime_token';

const emptyCart = {
  items: [],
  count: 0,
  subtotal: 0,
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(emptyCart);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!token) {
        if (active) {
          setUser(null);
          setCart(emptyCart);
          setAuthReady(true);
        }

        return;
      }

      try {
        const currentUser = await api.getMe(token);
        const currentCart = await api.getCart(token);

        if (active) {
          setUser(currentUser);
          setCart(currentCart);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);

        if (active) {
          setToken(null);
          setUser(null);
          setCart(emptyCart);
        }
      } finally {
        if (active) {
          setAuthReady(true);
        }
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [token]);

  async function applyAuth(payload) {
    localStorage.setItem(TOKEN_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);

    const currentCart = await api.getCart(payload.token);
    setCart(currentCart);

    return payload.user;
  }

  async function login(credentials) {
    const payload = await api.login(credentials);
    return applyAuth(payload);
  }

  async function register(data) {
    const payload = await api.register(data);
    return applyAuth(payload);
  }

  async function logout() {
    try {
      if (token) {
        await api.logout(token);
      }
    } catch {
      // noop
    }

    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setCart(emptyCart);
  }

  async function refreshCart() {
    if (!token) {
      setCart(emptyCart);
      return emptyCart;
    }

    const currentCart = await api.getCart(token);
    setCart(currentCart);
    return currentCart;
  }

  async function addToCart(payload) {
    const response = await api.addCartItem(token, payload);
    setCart(response.cart);
    return response;
  }

  async function updateCartItem(cartItemId, payload) {
    const response = await api.updateCartItem(token, cartItemId, payload);
    setCart(response.cart);
    return response;
  }

  async function removeCartItem(cartItemId) {
    const response = await api.removeCartItem(token, cartItemId);
    setCart(response.cart);
    return response;
  }

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        cart,
        authReady,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshCart,
        addToCart,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp harus dipakai di dalam AppProvider.');
  }

  return context;
}
