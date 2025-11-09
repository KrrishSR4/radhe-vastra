import { Mail, Phone, MessageCircle } from 'lucide-react';

const Contact = () => {
  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      value: 'arcmit@gmail.com',
      link: 'mailto:arcmit@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 6204010958',
      link: 'tel:+916204010958',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+91 6204010958',
      link: 'https://wa.me/+916204010958',
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

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {contacts.map((contact, index) => (
            <a
              key={index}
              href={contact.link}
              target={contact.label === 'WhatsApp' ? '_blank' : undefined}
              rel={contact.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
              className="bg-card p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 animate-scale-in text-center transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300 shadow-md">
                <contact.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-sm text-muted-foreground mb-2 font-semibold">{contact.label}</p>
              <p className="font-medium text-card-foreground break-words group-hover:text-primary transition-colors duration-300">
                {contact.value}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
