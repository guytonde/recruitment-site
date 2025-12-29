'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-[#BF5700]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1410]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-[#FF8C00]">
            Join Our Solar Car Teams
          </h1>
          <p className="text-xl text-[#b8b8b8] mb-8">
            Are you passionate about renewable energy and cutting-edge engineering?
            Apply to be part of the Solar Car Project.
          </p>
          
          {!user && (
            <div className="space-x-4">
              <Link 
                href="/register" 
                className="inline-block bg-[#BF5700] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#FF8C00] transition"
              >
                Start Your Application
              </Link>
              <Link 
                href="/about" 
                className="inline-block border-2 border-[#BF5700] text-[#FF8C00] px-8 py-3 rounded-lg font-bold hover:bg-[#BF5700]/10 transition"
              >
                Learn More
              </Link>
            </div>
          )}

          {user && user.role === 'applicant' && (
            <Link 
              href="/apply" 
              className="inline-block bg-[#BF5700] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#FF8C00] transition"
            >
              View Your Application
            </Link>
          )}
        </div>

        {/* Teams Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Solar Team */}
          <div className="bg-[#2a2420] rounded-lg p-8 border border-[#3a3430] hover:border-[#BF5700] transition">
            <h3 className="text-2xl font-bold mb-4 text-[#FF8C00]">☀️ Solar Team</h3>
            <p className="text-[#b8b8b8] mb-4">
              Work on battery management, power electronics, and solar optimization systems.
            </p>
            <ul className="text-[#b8b8b8] space-y-2">
              <li>• Battery Management Systems</li>
              <li>• Motor Control</li>
              <li>• Power Electronics</li>
              <li>• Telemetry</li>
            </ul>
          </div>

          {/* Electric Team */}
          <div className="bg-[#2a2420] rounded-lg p-8 border border-[#3a3430] hover:border-[#BF5700] transition">
            <h3 className="text-2xl font-bold mb-4 text-[#FF8C00]">⚡ Electric Team</h3>
            <p className="text-[#b8b8b8] mb-4">
              Design and optimize electric propulsion systems and energy management.
            </p>
            <ul className="text-[#b8b8b8] space-y-2">
              <li>• Battery Management Systems</li>
              <li>• Motor Control</li>
              <li>• Cooling Systems</li>
              <li>• Telemetry</li>
            </ul>
          </div>

          {/* Combustion Team */}
          <div className="bg-[#2a2420] rounded-lg p-8 border border-[#3a3430] hover:border-[#BF5700] transition">
            <h3 className="text-2xl font-bold mb-4 text-[#FF8C00]">🔥 Combustion Team</h3>
            <p className="text-[#b8b8b8] mb-4">
              Engineer efficient internal combustion engines and fuel systems.
            </p>
            <ul className="text-[#b8b8b8] space-y-2">
              <li>• Engine Control</li>
              <li>• Transmission</li>
              <li>• Cooling Systems</li>
              <li>• Fuel Systems</li>
            </ul>
          </div>
        </div>

        {/* What We're Looking For */}
        <div className="bg-[#2a2420] rounded-lg p-12 border border-[#3a3430] mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#FF8C00]">What We're Looking For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#BF5700]">Skills</h3>
              <ul className="text-[#b8b8b8] space-y-2">
                <li>✓ Problem-solving ability</li>
                <li>✓ Technical expertise in your field</li>
                <li>✓ Team collaboration</li>
                <li>✓ Passion for renewable energy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#BF5700]">Experience</h3>
              <ul className="text-[#b8b8b8] space-y-2">
                <li>✓ Open to all class years (Freshman-Senior)</li>
                <li>✓ Any major welcome</li>
                <li>✓ No prior experience necessary</li>
                <li>✓ Eagerness to learn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-[#2a2420] rounded-lg p-12 border border-[#3a3430] mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#FF8C00]">Recruitment Timeline</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#BF5700] rounded-full flex items-center justify-center font-bold text-white">1</div>
              <div>
                <h3 className="font-bold text-lg text-[#e8e8e8]">Application Phase</h3>
                <p className="text-[#b8b8b8]">Submit your application with resume and essay</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#BF5700] rounded-full flex items-center justify-center font-bold text-white">2</div>
              <div>
                <h3 className="font-bold text-lg text-[#e8e8e8]">Review Period</h3>
                <p className="text-[#b8b8b8]">Our team reviews applications and contacts candidates</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#BF5700] rounded-full flex items-center justify-center font-bold text-white">3</div>
              <div>
                <h3 className="font-bold text-lg text-[#e8e8e8]">Interviews</h3>
                <p className="text-[#b8b8b8]">Meet with system leads and discuss your fit</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#BF5700] rounded-full flex items-center justify-center font-bold text-white">4</div>
              <div>
                <h3 className="font-bold text-lg text-[#e8e8e8]">Final Decisions</h3>
                <p className="text-[#b8b8b8]">Receive offer and join the team!</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#BF5700] to-[#FF8C00] rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Make an Impact?</h2>
          <p className="text-[#f0f0f0] mb-8 text-lg">
            Join us in building the future of sustainable transportation.
          </p>
          {!user ? (
            <Link 
              href="/register" 
              className="inline-block bg-white text-[#BF5700] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Create Your Account
            </Link>
          ) : user.role === 'applicant' ? (
            <Link 
              href="/apply" 
              className="inline-block bg-white text-[#BF5700] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Submit Your Application
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
