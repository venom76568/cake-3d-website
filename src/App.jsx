import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TravelingCake } from './components/TravelingCake';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedSection } from './components/FeaturedSection';
import { MenuSection } from './components/MenuSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CartButton } from './components/CartButton';
import { CartSidebar } from './components/CartSidebar';
import { AdminLogin } from './admin/AdminLogin';
import { AdminApp } from './admin/AdminApp';
import { ProtectedRoute } from './admin/ProtectedRoute';
import { AllCakesPage } from './pages/AllCakesPage';

function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-cream text-plum font-sans selection:bg-gold selection:text-plum overflow-x-hidden">
      {/* TravelingCake is position:fixed — travels over all sections as you scroll */}
      <TravelingCake />
      <Navbar />
        <main>
          <HeroSection />
          <FeaturedSection />
          <MenuSection />
          <TestimonialsSection />
        </main>

        <footer className="w-full bg-cream py-12 border-t border-mist/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="font-display text-2xl font-bold tracking-tight">
              Artisan<span className="text-gold italic">.</span>
            </span>
            <span className="text-sm font-sans text-plum/60">
              &copy; {new Date().getFullYear()} Artisan Cake Shop. All rights reserved.
            </span>
          </div>
        </footer>
      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        {/* CartSidebar and CartButton are always mounted so they work on every page */}
        <CartSidebar />
        <CartButton />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<AllCakesPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
