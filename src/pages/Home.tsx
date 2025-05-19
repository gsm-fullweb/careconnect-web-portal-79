
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import CallToAction from "@/components/home/CallToAction";

const Home = () => {
  return (
    <Layout>
      <Hero />
      <Services />
      <AboutSection />
      <Testimonials />
      <Partners />
      <CallToAction />
    </Layout>
  );
};

export default Home;
