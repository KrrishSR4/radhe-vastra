import heroImage from '@/assets/hero-image.jpg';

const Hero = () => {
  const scrollToShop = () => {
    const shopElement = document.getElementById('shop');
    if (shopElement) {
      shopElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Modern Minimal
              <br />
              <span className="text-primary">Clothing</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Grey & White theme, smooth animations, and responsive design.
              Experience premium fashion with elegant simplicity.
            </p>
            <button
              onClick={scrollToShop}
              className="group relative px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </button>
          </div>

          <div className="animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover-lift">
              <img
                src={heroImage}
                alt="Fashion Collection"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
