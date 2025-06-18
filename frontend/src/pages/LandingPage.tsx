import { Features } from "../components/LandingComponents/Features"
import { Footer } from "../components/LandingComponents/Footer"
import { Hero } from "../components/LandingComponents/Hero"
import { HowItWorks } from "../components/LandingComponents/HowItWorks"
import { Navbar } from "../components/Navbar"
import { RequestToken } from "../components/RequestToken/RequestToken"

const LandingPage = () => {
    return (
        <div className="bg-slate-50">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <RequestToken />
            <Footer />
        </div>
    )
}

export { LandingPage }