import { Features } from "../components/Features"
import { Footer } from "../components/Footer"
import { Hero } from "../components/Hero"
import { HowItWorks } from "../components/HowItWorks"
import { Navbar } from "../components/Navbar"
import { RequestToken } from "../components/RequestToken"

const LandingPage = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <RequestToken />
            <Footer />
        </>
    )
}

export { LandingPage }