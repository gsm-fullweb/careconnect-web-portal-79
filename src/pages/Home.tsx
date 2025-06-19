
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import HowItWorks from "@/components/home/HowItWorks";
import Partners from "@/components/home/Partners";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import AboutSection from "@/components/home/AboutSection";

const Home = () => {
  return (
    <Layout>
      <Hero />
      <Stats />
      <HowItWorks />
      <Partners />
      <Testimonials />
      <AboutSection />
      <CallToAction />
    </Layout>
  );
};

export default Home;
