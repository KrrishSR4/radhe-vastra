import { Mail, Phone } from 'lucide-react';

const Contact = () => {
  const contacts = [
    {
      icon: Mail,
      label: 'Your Email',
      value: 'customer@krishclothing.com',
      type: 'email',
    },
    {
      icon: Phone,
      label: 'Your Phone',
      value: '+91-98765XXXXX',
      type: 'phone',
    },
    {
      icon: Mail,
      label: 'My Email',
      value: 'krish@example.com',
      type: 'email',
    },
    {
      icon: Phone,
      label: 'My Phone',
      value: '+91-12345XXXXX',
      type: 'phone',
    },
  ];

  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to us anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-xl shadow-sm hover-lift animate-scale-in text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <contact.icon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{contact.label}</p>
              <p className="font-medium text-card-foreground break-words">
                {contact.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
