
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-section">
      <div className="container-custom flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
          Connecting Care with Compassion
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl animate-fade-in">
          Professional caregiving services tailored to your needs.
          We connect qualified caregivers with those who need assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button asChild size="lg" className="bg-white text-careconnect-blue hover:bg-white/90">
            <Link to="/services">Our Services</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
