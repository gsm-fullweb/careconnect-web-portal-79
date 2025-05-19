
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Home Care",
    description: "Professional caregivers providing assistance in the comfort of your own home.",
    icon: "🏠",
  },
  {
    title: "Specialized Care",
    description: "Caregivers trained for specific conditions like Alzheimer's, Parkinson's, and more.",
    icon: "⚕️",
  },
  {
    title: "Respite Care",
    description: "Temporary relief for primary caregivers to rest and recharge.",
    icon: "🌿",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock care and support for those who need continuous assistance.",
    icon: "🕒",
  }
];

const Services = () => {
  return (
    <section className="section bg-careconnect-light">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a wide range of caregiving services to meet your specific needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/services">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-careconnect-blue hover:bg-careconnect-blue/90">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
