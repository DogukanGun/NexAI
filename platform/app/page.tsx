"use client"
import Link from "next/link";
import { LawAI } from "./components/svgs/LawAI";
import { DocumentAI } from "./components/svgs/DocumentAI";
import { InterviewAI } from "./components/svgs/InterviewAI";
import { FutureVisualization } from "./components/svgs/FutureVisualization";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,255,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
                Next Generation HR Technology
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-blue-600">
                The Future of HR is Here
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl">
                Experience the power of advanced AI in HR management. Transform your workplace with intelligent automation and deep insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/#features"
                  className="px-8 py-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 text-lg font-semibold"
                >
                  Explore Features
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 p-4">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
                <InterviewAI />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Powered by Advanced AI
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "German Law Expert AI",
                description: "Your 24/7 legal consultant with comprehensive knowledge of German employment law.",
                icon: <LawAI />,
                gradient: "from-blue-600 to-blue-400"
              },
              {
                title: "Smart Document Generator",
                description: "Automated generation of legally-compliant agreements and letters tailored to your needs.",
                icon: <DocumentAI />,
                gradient: "from-purple-600 to-purple-400"
              },
              {
                title: "Interview Intelligence",
                description: "Real-time interview analysis using advanced emotion AI and behavioral recognition.",
                icon: <InterviewAI />,
                gradient: "from-indigo-600 to-indigo-400"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
                <div className="relative">
                  <div className="h-48 mb-6">{feature.icon}</div>
                  <h3 className={`text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Updated Interactive Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Experience the Future
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform revolutionizes HR processes with real-time insights and intelligent automation.
            </p>
          </div>
          
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="aspect-[2/1] w-full mb-12">
              <FutureVisualization />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white/5 rounded-xl border border-white/10 transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Real-time Analysis</h3>
                <p className="text-gray-400">Advanced AI algorithms process and analyze data in real-time, providing instant insights for better decision-making.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-xl border border-white/10 transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Smart Automation</h3>
                <p className="text-gray-400">Automated workflows that adapt to your organization&apos;s needs, streamlining HR processes efficiently.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-xl border border-white/10 transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-indigo-400 mb-2">Predictive Insights</h3>
                <p className="text-gray-400">AI-driven predictions and recommendations for proactive HR management and strategic planning.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your HR?</h2>
          <p className="text-xl mb-8 text-gray-400">Join the future of HR management with our AI-powered platform.</p>
          <Link
            href="/#features"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:scale-105 transition-all duration-300 text-lg font-semibold shadow-lg shadow-blue-500/25"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
