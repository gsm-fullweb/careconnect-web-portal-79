
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="section bg-careconnect-blue text-white">
      <div className="container-custom text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Contact us today to find the perfect caregiver for you or your loved one.
          Our team is ready to answer any questions you might have.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-careconnect-blue hover:bg-white/90">
            <Link to="/contact">Contact Us Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Link to="/services">Explore Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
