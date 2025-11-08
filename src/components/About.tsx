import { Star } from 'lucide-react';

const About = () => {
  const testimonials = [
    {
      name: 'Sarah M.',
      text: 'Amazing quality and the minimalist design is exactly what I was looking for.',
      rating: 5,
    },
    {
      name: 'Rajesh K.',
      text: 'Fast shipping and the clothes fit perfectly. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Priya S.',
      text: 'The grey and white aesthetic is stunning. Love every piece!',
      rating: 5,
    },
  ];

  return (
    <section id="about" className="py-20 px-6 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            About Krish Clothing
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            We believe in the power of simplicity. Our collection features carefully crafted
            pieces that combine modern minimalism with timeless style. Each item is designed
            to elevate your wardrobe while maintaining the elegance of a grey and white palette.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-xl shadow-sm hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-card-foreground">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
