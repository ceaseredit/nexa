import Footer from "@/components/homeComponents/Footer";
import GetStarted from "@/components/homeComponents/GetStarted";
import Hero from "@/components/homeComponents/Hero";
import JoinUs from "@/components/homeComponents/JoinUs";
import NavBar from "@/components/homeComponents/NavBar";
import Performance from "@/components/homeComponents/Performance";
import Tape from "@/components/homeComponents/Tape";
import Testimonials from "@/components/homeComponents/Testimonials";
import WhyUs from "@/components/homeComponents/WhyUs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <div className="border-b-[0.5px] shadow-sm sticky top-0 z-30 bg-white">
        <NavBar />
      </div>
      <div className="px-4 mx-auto max-w-300 md:px-8 lg:px-0" id="hero">
        <Hero />
      </div>
      <Tape />
      <div className="px-4 mx-auto max-w-300 md:px-8 lg:px-0" id="performance">
        <Performance />
      </div>
      <div className="bg-[#F9FAFC] py-20" id="whyus">
        <WhyUs />
      </div>
      <div className="px-4 mx-auto max-w-300 md:px-8 lg:px-0">
        <GetStarted />
      </div>
      <div className="" id="testimonials">
              <Testimonials />
</div>


      <div className="bg-[#324CDE] py-20 lg:py-28">
        <JoinUs />
      </div>
      <div className="bg-[#F9FAFC] ">
        <Footer />
      </div>
    </div>
  );
}
