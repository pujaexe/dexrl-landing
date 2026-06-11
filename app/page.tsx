import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Globe } from "@/components/Globe";
import { Steps } from "@/components/Steps";
import { Security } from "@/components/Security";
import { Fiat } from "@/components/Fiat";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { ContactModal } from "@/components/ContactModal";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Benefits />
      <Globe />
      <Steps />
      <Security />
      <Fiat />
      <FinalCTA />
      <Footer />
      <ContactModal />
    </main>
  );
}
