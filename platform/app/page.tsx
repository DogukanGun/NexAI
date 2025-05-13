"use client"
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthModal } from "./components/AuthModal";

// Component that uses useSearchParams
function LoginCheck({ setIsAuthModalOpen }: { setIsAuthModalOpen: (isOpen: boolean) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const needLogin = searchParams.get('needLogin');
    if (needLogin === 'true') {
      setIsAuthModalOpen(true);
    }
  }, [searchParams, setIsAuthModalOpen]);
  
  return null;
}

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const images = {
    dashboard: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80",
    legal: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    jobPosting: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    interview: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    companyDocs: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Suspense fallback={null}>
        <LoginCheck setIsAuthModalOpen={setIsAuthModalOpen} />
      </Suspense>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl -top-48 -left-24 animate-pulse"></div>
          <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-blue-400 font-medium">AI-Powered HR Revolution</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-purple-400">
                  Transform Your
                </span>
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  HR Management
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Harness the power of artificial intelligence to revolutionize your HR processes. 
                From automated recruitment to employee engagement analytics, we're redefining 
                the future of workplace management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-lg font-semibold transform hover:scale-105"
                >
                  Start Free Trial
                </button>
                <Link
                  href="/#demo"
                  className="px-8 py-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 text-lg font-semibold flex items-center justify-center group"
                >
                  Watch Demo
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-gradient-to-br from-blue-400 to-purple-400"></div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-semibold">500+</span> companies already trust us
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl"></div>
              <Image
                src={images.dashboard}
                alt="AI HR Dashboard"
                fill
                className="object-cover rounded-2xl transform hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Advanced AI-Powered Features
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              Revolutionizing HR with cutting-edge artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: "Legal Document Analysis",
                description: "Our AI directly analyzes and answers questions from legal documents, including labor laws and regulations, providing accurate and contextual responses based on the latest legal framework.",
                image: images.legal,
                features: [
                  "Direct answers from legal documents",
                  "Up-to-date labor law analysis",
                  "Constitutional compliance checks",
                  "Legal context understanding"
                ]
              },
              {
                title: "Intelligent Job Posting Creator",
                description: "AI-powered job posting generator that analyzes similar listings across industries to create optimized, market-aligned job descriptions while maintaining your company's unique requirements.",
                image: images.jobPosting,
                features: [
                  "Market analysis of similar positions",
                  "Industry-standard terminology",
                  "Competitive requirements matching",
                  "Custom company alignment"
                ]
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Company Knowledge Base AI",
                description: "Upload your company documents and let our AI create a smart knowledge base. Ask questions, generate documents, and get insights based on your organization's unique data.",
                image: images.companyDocs,
                features: [
                  "Document vectorization",
                  "Natural language queries",
                  "Custom document generation",
                  "Company-specific insights"
                ]
              },
              {
                title: "Interview Emotion Analysis (Coming Soon)",
                description: "Revolutionary AI technology that analyzes candidate emotions and behavioral patterns during interviews, providing deeper insights into potential fits for your organization.",
                image: images.interview,
                features: [
                  "Real-time emotion detection",
                  "Behavioral pattern analysis",
                  "Candidate engagement metrics",
                  "Objective evaluation assistance"
                ],
                comingSoon: true
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                {feature.comingSoon && (
                  <div className="relative z-10 inline-flex items-center mb-6 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/40">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    <span className="text-sm font-medium text-blue-400">Coming Soon</span>
                  </div>
                )}
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "98%", label: "Accuracy Rate" },
              { number: "2x", label: "Faster Hiring" },
              { number: "500+", label: "Happy Clients" },
              { number: "24/7", label: "AI Support" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {stat.number}
                </div>
                <div className="mt-2 text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
            Ready to Transform Your HR?
          </h2>
          <p className="text-xl mb-8 text-gray-400">
            Join hundreds of companies already using our AI-powered HR platform
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-lg font-semibold transform hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
