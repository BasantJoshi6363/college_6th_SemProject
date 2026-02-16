import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Contexts
import { AuthProvider } from './context/AuthContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import { WishlistProvider } from './context/WishListContext.jsx'
import { RecommendationProvider } from './context/ReccomendationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <RecommendationProvider>
            <WishlistProvider>
              <CartProvider>
                <ProductProvider>
                  <AdminProvider>
                    <Toaster position="top-center" />
                    <App />
                  </AdminProvider>
                </ProductProvider>
              </CartProvider>
            </WishlistProvider>
          </RecommendationProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)