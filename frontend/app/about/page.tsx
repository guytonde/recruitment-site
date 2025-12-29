'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8">About the Solar Car Project</h1>

        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            The Solar Car Project is a student-led initiative dedicated to designing and building 
            innovative solar-powered vehicles. We bring together students from diverse engineering 
            disciplines to tackle the challenges of sustainable transportation.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our teams compete in national and international competitions, pushing the boundaries 
            of efficiency, design, and innovation in renewable energy vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h3 className="text-2xl font-bold mb-4 text-teal-400">Solar Team</h3>
            <p className="text-gray-400">
              Specializes in solar power systems, battery management, and energy optimization to 
              maximize efficiency and range.
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h3 className="text-2xl font-bold mb-4 text-teal-400">Electric Team</h3>
            <p className="text-gray-400">
              Develops high-performance electric propulsion systems, power electronics, and 
              advanced cooling solutions.
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h3 className="text-2xl font-bold mb-4 text-teal-400">Combustion Team</h3>
            <p className="text-gray-400">
              Engineers efficient internal combustion engines and fuel systems for alternative 
              fuels and hybrid vehicles.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Why Join?</h2>
          <ul className="text-gray-400 space-y-3">
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">→</span>
              <span>Work on real-world engineering challenges with cutting-edge technology</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">→</span>
              <span>Collaborate with talented engineers across multiple disciplines</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">→</span>
              <span>Build professional experience and expand your portfolio</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">→</span>
              <span>Compete at national and international competitions</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">→</span>
              <span>Make an impact on sustainable transportation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
