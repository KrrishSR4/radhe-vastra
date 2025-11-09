import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Shop from '@/components/Shop';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import ScrollToTop from '@/components/ScrollToTop';

const ADMIN_PASSPHRASE = 'radheradhe';

const Index = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        const passphrase = prompt('Enter admin passphrase:');
        if (passphrase === ADMIN_PASSPHRASE) {
          setIsAdminOpen(true);
          toast.success('Admin panel opened');
        } else if (passphrase) {
          toast.error('Incorrect passphrase');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
  <Hero />
  <Shop />
      <About />
      <Contact />
      <Footer />
      <ScrollToTop />

      {/* Mobile admin trigger: visible only on small screens (for Android/iOS) */}
      <button
        onClick={() => {
          const passphrase = prompt('Enter admin passphrase:');
          if (passphrase === ADMIN_PASSPHRASE) {
            setIsAdminOpen(true);
            toast.success('Admin panel opened');
          } else if (passphrase) {
            toast.error('Incorrect passphrase');
          }
        }}
        className="fixed bottom-20 right-6 z-50 p-3 bg-[#778899] text-white rounded-full shadow-lg md:hidden"
        aria-label="Open admin panel"
      >
        Admin
      </button>

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
};

export default Index;
