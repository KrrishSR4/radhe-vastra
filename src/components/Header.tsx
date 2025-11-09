import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-muted/95 backdrop-blur-sm shadow-lg' : 'bg-muted/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-300 drop-shadow-md">
            RADHE VASTRA
          </h1>
          
          <nav className="hidden md:flex items-center gap-8">
            {['home', 'shop', 'about', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              className="text-foreground"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile menu overlay */}
    {menuOpen && (
      <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">RADHE VASTRA</h2>
          <button onClick={() => setMenuOpen(false)} className="text-foreground" aria-label="Close menu">Close</button>
        </div>
        <nav className="flex flex-col gap-4">
          {['home', 'shop', 'about', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setMenuOpen(false);
                // small timeout to allow menu to close smoothly
                setTimeout(() => {
                  const el = document.getElementById(item);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-lg font-medium text-foreground hover:text-primary"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
      </div>
    )}
    </>
  );
};

export default Header;
