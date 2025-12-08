// app/page.js
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DashboardSection from "@/components/DashboardSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      {/* Full-page sections in order */}
      <section id="home" className="pt-20">
        <HeroSection />
      </section>
      <section id="about" className="pt-24">
        <AboutSection />
      </section>
      <section id="dashboard" className="pt-24">
        <DashboardSection />
      </section>
      <section id="contact" className="pt-24 pb-24">
        <ContactSection />
      </section>
      <Footer />
    </main>
  );
}
