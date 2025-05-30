import Hero from "./Hero";
import AboutHP from "./AboutHP";
import MenuHP from "./MenuHP.jsx";
import WhyUs from "./WhyUs";
import Banner from "./Banner";
import ContactHP from "./ContactHP";
import ScrollToTop from "./../../components/ScrollToTop.jsx";
import "./../../styles/home.css";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutHP />
      <MenuHP />
      <WhyUs />
      <Banner />
      <ContactHP />
      <ScrollToTop />
    </>
  );
}
