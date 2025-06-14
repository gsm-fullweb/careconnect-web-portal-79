import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import CallToAction from "@/components/home/CallToAction";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";

const Home = () => {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <WhyChooseUs />
      <Services />
      <AboutSection />
      <Testimonials />
      <Partners />
      <CallToAction />
    </Layout>
  );
};

export default Home;
