
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting CareConnect. We'll be in touch soon!",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-careconnect-blue/90 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We're here to answer your questions and help you get the care you need.
          </p>
        </div>
      </div>
      
      {/* Contact Info & Form */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="mb-6">Get In Touch</h2>
              <p className="text-lg text-gray-700 mb-8">
                Whether you're looking for care for yourself or a loved one, or if you have questions about our services, we're here to help. Reach out to us using the contact information below or fill out the form.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-careconnect-blue/10 rounded-full flex items-center justify-center text-careconnect-blue mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Phone</h3>
                    <p className="text-gray-700">
                      <a href="tel:+11234567890" className="hover:text-careconnect-blue">
                        (123) 456-7890
                      </a>
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Mon-Fri: 8AM-8PM, Sat: 9AM-5PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-careconnect-blue/10 rounded-full flex items-center justify-center text-careconnect-blue mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email</h3>
                    <p className="text-gray-700">
                      <a href="mailto:info@careconnect.com" className="hover:text-careconnect-blue">
                        info@careconnect.com
                      </a>
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      We'll respond as soon as possible
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-careconnect-blue/10 rounded-full flex items-center justify-center text-careconnect-blue mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Address</h3>
                    <p className="text-gray-700">
                      123 Care Street<br />
                      Anytown, ST 12345
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Our main office location
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-careconnect-blue focus:border-careconnect-blue"
                  >
                    <option value="">Select a service</option>
                    <option value="home-care">Home Care</option>
                    <option value="specialized-care">Specialized Care</option>
                    <option value="respite-care">Respite Care</option>
                    <option value="24-7-support">24/7 Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={4}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-careconnect-blue hover:bg-careconnect-blue/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="section bg-careconnect-light p-0">
        <div className="h-96 bg-gray-300 w-full">
          {/* This would be a Google Map in a real implementation */}
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <p className="text-gray-600 text-lg">Map Location Goes Here</p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to some of the most common questions about our services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do you select your caregivers?",
                answer: "All of our caregivers undergo thorough background checks, reference checks, and interviews. They must also have relevant certifications and experience in caregiving."
              },
              {
                question: "Can I choose my caregiver?",
                answer: "Yes, we believe in the importance of a good match between caregiver and client. We'll introduce you to potential caregivers, and you can select the one you feel most comfortable with."
              },
              {
                question: "What happens if my regular caregiver is sick or unavailable?",
                answer: "We have a team of backup caregivers who are familiar with your needs and can step in when your regular caregiver is unavailable."
              },
              {
                question: "How soon can care begin?",
                answer: "In most cases, we can begin care within 24-48 hours of your initial call, and sometimes even sooner for urgent situations."
              },
              {
                question: "Are your services covered by insurance?",
                answer: "Some of our services may be covered by long-term care insurance or certain Medicare Advantage plans. We can help you explore your coverage options."
              },
              {
                question: "Can I change my care plan if my needs change?",
                answer: "Absolutely. We understand that needs can change over time, and we're flexible in adjusting your care plan as needed."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-careconnect-light p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-careconnect-blue">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
