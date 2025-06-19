
import Layout from "@/components/layout/Layout";
import NewHero from "@/components/home/NewHero";
import Stats from "@/components/home/Stats";
import NewHowItWorks from "@/components/home/NewHowItWorks";
import NewWhyChooseUs from "@/components/home/NewWhyChooseUs";
import NewServices from "@/components/home/NewServices";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import NewCallToAction from "@/components/home/NewCallToAction";

const Home = () => {
  return (
    <Layout>
      <NewHero />
      <Stats />
      <NewHowItWorks />
      <NewWhyChooseUs />
      <NewServices />
      <AboutSection />
      <Testimonials />
      <Partners />
      <NewCallToAction />
    </Layout>
  );
};

export default Home;
