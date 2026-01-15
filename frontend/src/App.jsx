import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './layout/Header'
import Footer from './layout/Footer'
import AuthPage from './pages/AuthPage'
import ContactPage from './pages/ContactPage'
import Home from "./pages/Home"
import CartPage from './pages/CartPage'
import PublicRoute from './routes/PublicRoute'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './routes/ProtectedRoute'
import ErrorPage from './pages/ErrorPage'
import WishListPage from './pages/WishListPage'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/signup' element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        {/* <Route path='/wishlist' element={<WishListPage wishlistItems={[]} />} /> */}


        <Route path='*' element={<ErrorPage/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
