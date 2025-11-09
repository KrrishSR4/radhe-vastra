import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 animate-scale-in group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
