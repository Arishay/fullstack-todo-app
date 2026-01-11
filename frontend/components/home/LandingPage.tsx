'use client';

/**
 * Beautiful Landing Page with Pink Theme
 *
 * Features:
 * - Animated background with floating particles
 * - Modern hero section
 * - Smooth hover effects
 * - Light effects and glows
 * - Minimal and clean design
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50/30 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-rose-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-pink-300/20 rounded-full blur-3xl animate-float-reverse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-pink-300/20 to-rose-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

        {/* Small floating particles - client-side only to avoid hydration errors */}
        {mounted && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Light rays from bottom */}
        <div className="absolute bottom-0 left-1/4 w-1 h-96 bg-gradient-to-t from-pink-300/30 to-transparent blur-sm animate-glow" />
        <div className="absolute bottom-0 right-1/4 w-1 h-96 bg-gradient-to-t from-rose-300/30 to-transparent blur-sm animate-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            ✨ Todo App
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 text-rose-600 font-medium rounded-full hover:bg-rose-50 transition-all duration-300"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-300/50 hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-block">
              <span className="px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 text-sm font-medium rounded-full border border-rose-200/50 shadow-sm">
                ✨ AI-Powered Task Management
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-rose-500 bg-clip-text text-transparent animate-gradient">
                Organize Your Life
              </span>
              <br />
              <span className="text-gray-800">With Elegance</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Beautiful, minimal task management that helps you stay focused.
              <br />
              <span className="text-rose-500 font-medium">Simple. Smart. Stunning.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-pink-300/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Start For Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-rose-600 font-semibold rounded-2xl border-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300 hover:shadow-lg transition-all duration-300"
              >
                Explore Features
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
                <span>Setup in 30 seconds</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features wrapped in a beautiful interface
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '✨',
                title: 'Smart Organization',
                description: 'Intelligent task grouping and prioritization that adapts to your workflow.',
                gradient: 'from-rose-400 to-pink-400'
              },
              {
                icon: '🎨',
                title: 'Beautiful Design',
                description: 'Minimal, elegant interface that makes task management a joy.',
                gradient: 'from-pink-400 to-rose-400'
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Instant sync across all your devices. No delays, no waiting.',
                gradient: 'from-rose-400 to-pink-500'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                description: 'Your data is encrypted and protected with industry-standard security.',
                gradient: 'from-pink-400 to-rose-400'
              },
              {
                icon: '🌙',
                title: 'Focus Mode',
                description: 'Distraction-free environment to help you concentrate on what matters.',
                gradient: 'from-rose-400 to-pink-400'
              },
              {
                icon: '📱',
                title: 'Cross-Platform',
                description: 'Access your tasks anywhere - web, mobile, or desktop.',
                gradient: 'from-pink-400 to-rose-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-rose-100 transition-all duration-300 ${
                  hoveredCard === index
                    ? 'shadow-2xl shadow-pink-200/50 -translate-y-2 border-rose-200'
                    : 'shadow-md hover:shadow-xl'
                }`}
              >
                {/* Glow effect on hover */}
                {hoveredCard === index && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-3xl transition-opacity duration-300`} />
                )}

                <div className="relative z-10">
                  <div className={`text-5xl mb-4 inline-block p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom glow */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-300 ${
                  hoveredCard === index ? 'opacity-100 w-48' : 'opacity-0'
                }`} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-12 shadow-2xl shadow-pink-300/50 animate-gradient">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Organized?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who transformed their productivity
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-white text-rose-600 font-bold rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              Create Your Free Account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-rose-100">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Made with 💖 for productivity enthusiasts
            </p>
            <p className="text-xs mt-2 text-gray-400">
              © 2026 Todo App. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
