
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">About CareConnect</h2>
            <p className="text-lg text-gray-700 mb-6">
              Founded in 2010, CareConnect has been on a mission to transform the way caregiving services are delivered. We believe that everyone deserves compassionate care tailored to their unique needs.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our network includes hundreds of certified caregivers who undergo rigorous screening and training to ensure they provide the highest quality of care.
            </p>
            <div className="flex flex-wrap gap-8 mb-8">
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">500+</h3>
                <p className="text-gray-600">Certified Caregivers</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">1000+</h3>
                <p className="text-gray-600">Happy Clients</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">15+</h3>
                <p className="text-gray-600">Years of Experience</p>
              </div>
            </div>
            <Button asChild className="bg-careconnect-blue hover:bg-careconnect-blue/90">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="CareConnect team members" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-careconnect-green rounded-lg hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
