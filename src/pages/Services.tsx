
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

// Service data
const servicesData = [
  {
    id: "home-care",
    title: "Home Care",
    icon: "🏠",
    description: "Personalized care in the comfort of your own home.",
    features: [
      "Assistance with daily activities",
      "Medication reminders",
      "Light housekeeping",
      "Meal preparation",
      "Companionship"
    ],
    details: "Our home care services are designed to help individuals maintain their independence while receiving the support they need. Our caregivers are trained to assist with daily activities such as bathing, dressing, and meal preparation, as well as provide companionship and emotional support."
  },
  {
    id: "specialized-care",
    title: "Specialized Care",
    icon: "⚕️",
    description: "Expert care for specific medical conditions.",
    features: [
      "Alzheimer's and dementia care",
      "Parkinson's care",
      "Post-surgery recovery",
      "Chronic illness management",
      "Palliative care"
    ],
    details: "Our specialized care services are tailored to meet the unique needs of individuals with specific medical conditions. Our caregivers receive specialized training to provide the highest level of care for conditions such as Alzheimer's, Parkinson's, and other chronic illnesses."
  },
  {
    id: "respite-care",
    title: "Respite Care",
    icon: "🌿",
    description: "Temporary relief for primary caregivers.",
    features: [
      "Short-term care options",
      "Flexible scheduling",
      "Overnight support",
      "Weekend care",
      "Emergency coverage"
    ],
    details: "Our respite care services provide temporary relief for primary caregivers, allowing them to take a break and recharge. Whether you need a few hours, a weekend, or longer, our caregivers can step in and provide the same level of care and support that you do."
  },
  {
    id: "24-7-support",
    title: "24/7 Support",
    icon: "🕒",
    description: "Round-the-clock care for those who need continuous assistance.",
    features: [
      "Live-in care options",
      "Overnight supervision",
      "Multiple caregiver rotation",
      "Emergency response",
      "Continuous monitoring"
    ],
    details: "Our 24/7 support services provide round-the-clock care for individuals who require continuous assistance. We can arrange for live-in caregivers or create a rotation of caregivers to ensure that your loved one always has the support they need."
  }
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-careconnect-blue/90 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Services</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Comprehensive caregiving solutions tailored to your unique needs.
          </p>
        </div>
      </div>
      
      {/* Services Overview */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">How We Can Help</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic assistance to specialized care, we offer a range of services to meet your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {servicesData.map((service) => (
              <Card key={service.id} className="card-hover">
                <CardHeader>
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-careconnect-green mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <a href={`#${service.id}`}>Learn More</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Detailed Services */}
      <section className="section bg-careconnect-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Service Details</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn more about each of our services and how they can benefit you or your loved one.
            </p>
          </div>
          
          <Tabs defaultValue="home-care" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              {servicesData.map((service) => (
                <TabsTrigger key={service.id} value={service.id}>
                  {service.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {servicesData.map((service) => (
              <TabsContent key={service.id} value={service.id} id={service.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-3xl mr-2">{service.icon}</span>
                      <span>{service.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg">{service.details}</p>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">What's Included:</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                            <span className="text-careconnect-green text-xl mr-2">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button asChild className="bg-careconnect-blue hover:bg-careconnect-blue/90">
                      <Link to="/contact">Request This Service</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with CareConnect is simple and straightforward.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Initial Consultation",
                description: "We'll discuss your needs and preferences to understand how we can best support you or your loved one.",
                icon: "📝"
              },
              {
                step: 2,
                title: "Caregiver Matching",
                description: "Based on your needs, we'll match you with caregivers who have the right skills, experience, and personality.",
                icon: "🤝"
              },
              {
                step: 3,
                title: "Care Begins",
                description: "Your selected caregiver will begin providing care according to your agreed-upon schedule and care plan.",
                icon: "✨"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-careconnect-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="section bg-careconnect-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Contact us today to schedule a free consultation and learn more about how we can help.
          </p>
          <Button asChild className="bg-white text-careconnect-blue hover:bg-white/90">
            <Link to="/contact">Contact Us Now</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
