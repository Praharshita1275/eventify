import React, { useState } from 'react';
import { FaMusic, FaCode, FaHandsHelping, FaRunning, FaHeart, FaInstagram, FaArrowRight } from 'react-icons/fa';
import '../styles/animations.css';

const clubCategories = [
  {
    id: 1,
    category: "Cultural Clubs",
    image: "/assests/images/csclub.jpg",
    color: "pink",
    icon: <FaMusic className="w-8 h-8" />,
    themeColor: "purple",
    clubs: [
      {
        name: "Chaitanya Samskruthi",
        description: "The cultural and literary hub of CBIT, orchestrating vibrant events and managing 11 specialized clubs. We organize the annual cultural fest 'Shruthi' and foster artistic expression across campus.",
        instagram: "https://www.instagram.com/chaitanya_samskruthi",
        color: "blue"
      },
      {
        name: "Chaitanya Geethi",
        description: "The melodic heart of CBIT, where voices blend in harmony. Our singers have won numerous accolades in competitions, creating musical magic on campus.",
        instagram: "https://www.instagram.com/chaitanya_geethi",
        color: "indigo"
      },
      {
        name: "Chaitanya Vaadya",
        description: "CBIT's instrumental music club, bringing together talented musicians to create enchanting melodies and showcase instrumental prowess.",
        instagram: "https://www.instagram.com/chaitanya_vaadya",
        color: "purple"
      },
      {
        name: "UDC (United Dance Crew)",
        description: "The dynamic dance club showcasing diverse dance forms with unparalleled synchronization. Our performances light up every college event.",
        instagram: "https://www.instagram.com/uniteddancecrew",
        color: "red"
      },
      {
        name: "Chaitanya Chaaya",
        description: "The film and media club capturing stories through the lens. We create short films, documentaries, and promotional content for college events.",
        instagram: "https://www.instagram.com/chaaya.cbit",
        color: "yellow"
      },
      {
        name: "Chaitanya Srujana",
        description: "The Arts & Crafts club transforming creative ideas into beautiful artworks. From campus decoration to art exhibitions, we add color to college life.",
        instagram: "https://www.instagram.com/chaitanya_srujana_cbit",
        color: "green"
      },
      {
        name: "Communicando",
        description: "CBIT's premier communication club fostering public speaking, debate, and interpersonal skills. We organize workshops, debates, and interactive sessions to enhance students' communication abilities.",
        instagram: "https://www.instagram.com/communicando",
        color: "blue"
      },
      {
        name: "Toastmasters",
        description: "Part of Toastmasters International, we help students develop leadership and public speaking skills through structured programs and regular meetings.",
        instagram: "https://www.instagram.com/tmcbit",
        color: "indigo"
      },
      {
        name: "CBIT MUN",
        description: "The Model United Nations club that develops diplomatic skills, global awareness, and debate expertise through conferences and simulations of international relations.",
        instagram: "https://www.instagram.com/cbitmunhyd",
        color: "purple"
      },
      {
        name: "Transcendent",
        description: "A platform for theatrical arts and dramatic expression, bringing stories to life through powerful performances and innovative stage productions.",
        instagram: "https://www.instagram.com/transcendent.cbit",
        color: "red"
      },
      {
        name: "Writers and Poets Club",
        description: "A creative sanctuary for literary enthusiasts, nurturing talent in poetry, prose, and creative writing through workshops, competitions, and publications.",
        instagram: "https://www.instagram.com/wpc_cbit",
        color: "yellow"
      },
      {
        name: "CBIT Photography Club",
        description: "Capturing moments and telling stories through the lens, we explore various photography techniques and organize photo walks, exhibitions, and workshops.",
        instagram: "https://www.instagram.com/cbitphotoclub",
        color: "green"
      }
    ]
  },
  {
    id: 2,
    category: "Technical Clubs",
    image: "/assests/images/tech.jpg",
    color: "blue",
    icon: <FaCode className="w-8 h-8" />,
    themeColor: "blue",
    clubs: [
      {
        name: "Chaitanya Astra",
        description: "The technical fest organizing club that brings together innovation and technology through exciting events and competitions.",
        instagram: "https://www.instagram.com/chaitanyaastra",
        color: "blue"
      },
      {
        name: "CBIT Developer Student Club",
        description: "Google's DSC chapter at CBIT, fostering learning in mobile and web development, cloud computing, and machine learning.",
        instagram: "https://www.instagram.com/cbitdsc",
        color: "red"
      },
      {
        name: "COSC",
        description: "CBIT Open Source Community promoting open-source development and collaboration among students.",
        instagram: "https://www.instagram.com/cbitosc",
        color: "green"
      },
      {
        name: "Neural Nexus",
        description: "The AI/ML club exploring cutting-edge technologies in artificial intelligence and machine learning.",
        instagram: "https://www.instagram.com/neuralnexuscbit",
        color: "purple"
      },
      {
        name: "Robotics & Innovation",
        description: "Fostering innovation through robotics projects and automation solutions. We participate in national robotics competitions.",
        instagram: "https://www.instagram.com/robotics_cbit",
        color: "indigo"
      },
      {
        name: "Praheti Racing",
        description: "CBIT's Formula Student team designing and building race cars for national and international competitions, pushing the boundaries of automotive engineering.",
        instagram: "https://www.instagram.com/prahetiracing",
        color: "red"
      },
      {
        name: "HiCon",
        description: "Formerly Hackiton, organizing hackathons and innovation challenges to solve real-world problems through technology and creative solutions.",
        instagram: "https://www.instagram.com/hicon_cbit",
        color: "blue"
      },
      {
        name: "CCC (CBIT Cybersecurity Club)",
        description: "Dedicated to cybersecurity education, ethical hacking, and information security through workshops, CTFs, and security competitions.",
        instagram: "https://www.instagram.com/ccc_cbit",
        color: "purple"
      },
      {
        name: "Ham Radio Club",
        description: "Exploring amateur radio communications, conducting workshops on radio technology, and participating in emergency communication exercises.",
        instagram: "https://www.instagram.com/hrc.cbit",
        color: "green"
      },
      {
        name: "BBCC",
        description: "CBIT's Blockchain and Cryptocurrency Club, exploring distributed ledger technologies and their applications through projects and workshops.",
        instagram: "https://www.instagram.com/bbcc_cbit",
        color: "blue"
      },
      {
        name: "Ramanujan Maths Club (RMC)",
        description: "Promoting mathematical thinking and problem-solving skills through competitions, workshops, and engaging mathematical activities.",
        instagram: "https://www.instagram.com/rmc.cbit",
        color: "indigo"
      },
      {
        name: "IEEE",
        description: "The IEEE Student Branch at CBIT, connecting students with the global engineering community through technical events, workshops, and conferences.",
        instagram: "https://www.instagram.com/ieee_cbit",
        color: "blue"
      },
      {
        name: "SATARC",
        description: "Specializing in information security and advanced research in cybersecurity, organizing workshops and security awareness programs.",
        instagram: "https://www.instagram.com/satarc.infsec",
        color: "purple"
      },
      {
        name: "Yuva Aarav",
        description: "Focusing on aerospace and aviation technologies, conducting projects and workshops in drone technology and aeronautical engineering.",
        instagram: "https://www.instagram.com/yuva_aarav",
        color: "red"
      },
      {
        name: "NexIoT",
        description: "Exploring Internet of Things (IoT) technologies through hands-on projects, workshops, and innovative solutions for smart applications.",
        instagram: "https://www.instagram.com/nexiot_cbit",
        color: "green"
      },
      {
        name: "CEA (Civil Engineering Association)",
        description: "Bridging academic knowledge with practical applications in civil engineering through site visits, workshops, and industry interactions.",
        instagram: "https://www.instagram.com/cea_cbit",
        color: "blue"
      }
    ]
  },
  {
    id: 3,
    category: "Chaitanya Seva Clubs",
    image: "/assests/images/seva.jpg",
    color: "green",
    icon: <FaHandsHelping className="w-8 h-8" />,
    themeColor: "green",
    clubs: [
      {
        name: "NSS",
        description: "National Service Scheme unit organizing social service activities and community development programs.",
        instagram: "https://www.instagram.com/cbitnss",
        color: "orange"
      },
      {
        name: "Chaitanya Spandana",
        description: "The social service club working towards community welfare through various initiatives and outreach programs.",
        instagram: "https://www.instagram.com/chaitanya.spandana",
        color: "yellow"
      },
      {
        name: "Chaitanya Svaasthya",
        description: "The Mental health and wellness club promoting psychological well-being through awareness and support programs.",
        instagram: "https://www.instagram.com/chaitanya.svaasthya",
        color: "green"
      },
      {
        name: "ELC",
        description: "English Literary Club fostering language skills, creative expression, and professional communication through workshops, debates, and literary activities.",
        instagram: "https://www.instagram.com/elc.cbit",
        color: "blue"
      },
      {
        name: "EWB",
        description: "Engineers Without Borders chapter implementing sustainable engineering solutions for community development and social impact projects.",
        instagram: "https://www.instagram.com/ewbcbit",
        color: "green"
      },
      {
        name: "EDC",
        description: "Entrepreneurship Development Cell nurturing startup culture and business acumen through mentorship, workshops, and startup competitions.",
        instagram: "https://www.instagram.com/edccbit",
        color: "purple"
      },
      {
        name: "Chaitanya Suraksha",
        description: "Dedicated to campus safety and security awareness, organizing self-defense workshops and safety training programs for students.",
        instagram: "https://www.instagram.com/chaitanya_suraksha",
        color: "red"
      },
      {
        name: "Chaitanya Sattva",
        description: "Promoting environmental consciousness and sustainability through green initiatives, waste management, and eco-friendly campus projects.",
        instagram: "https://www.instagram.com/chaitanya.sattva",
        color: "green"
      },
      {
        name: "CBIT Talks",
        description: "A platform for sharing inspiring stories, ideas, and experiences through speaker sessions, panel discussions, and interactive forums.",
        instagram: "https://www.instagram.com/cbitalks_",
        color: "blue"
      }
    ]
  },
  {
    id: 4,
    category: "Sports Clubs",
    image: "/assests/images/kreeda.jpg",
    color: "red",
    icon: <FaRunning className="w-8 h-8" />,
    themeColor: "red",
    clubs: [
      {
        name: "Chaitanya Kreeda",
        description: "The sports club organizing various sports events and managing college teams across different sports.",
        instagram: "https://www.instagram.com/chaitanyakreeda",
        color: "blue"
      },
      {
        name: "E-Sports",
        description: "The gaming community organizing competitive gaming events and representing CBIT in e-sports tournaments.",
        instagram: "https://www.instagram.com/cbitesports",
        color: "purple"
      }
    ]
  }
];

function About() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#1a365d] mb-6">
            CBIT Club Life
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the vibrant clubs and communities that make CBIT an exciting place for learning, creativity, and growth.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl min-w-[160px] bg-white hover:bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] hover:text-white ${selectedCategory === "all" ? "bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white" : "text-[#1a365d]"}`}
          >
            <span className="text-lg font-medium">All Clubs</span>
          </button>
          <button
            onClick={() => setSelectedCategory("Cultural Clubs")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px] bg-white hover:bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] hover:text-white ${selectedCategory === "Cultural Clubs" ? "bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white" : "text-[#1a365d]"}`}
          >
            <FaMusic className="text-xl" />
            <span className="text-lg font-medium">Cultural Clubs</span>
          </button>
          <button
            onClick={() => setSelectedCategory("Technical Clubs")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px] bg-white hover:bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] hover:text-white ${selectedCategory === "Technical Clubs" ? "bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white" : "text-[#1a365d]"}`}
          >
            <FaCode className="text-xl" />
            <span className="text-lg font-medium">Technical Clubs</span>
          </button>
          <button
            onClick={() => setSelectedCategory("Chaitanya Seva Clubs")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl min-w-[240px] bg-white hover:bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] hover:text-white ${selectedCategory === "Chaitanya Seva Clubs" ? "bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white" : "text-[#1a365d]"}`}
          >
            <FaHandsHelping className="text-xl" />
            <span className="text-lg font-medium">Chaitanya Seva Clubs</span>
          </button>
          <button
            onClick={() => setSelectedCategory("Sports Clubs")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl min-w-[180px] bg-white hover:bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] hover:text-white ${selectedCategory === "Sports Clubs" ? "bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white" : "text-[#1a365d]"}`}
          >
            <FaRunning className="text-xl" />
            <span className="text-lg font-medium">Sports Clubs</span>
          </button>
        </div>

        {/* Club Categories */}
        <div className="space-y-16">
          {clubCategories
            .filter(category => selectedCategory === "all" || selectedCategory === category.category)
            .map((category) => (
              <div key={category.id} className="animate-fade-in">
                <div className="flex items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
                  <div className="bg-indigo-100 p-4 rounded-xl mr-6">
                    <span className="text-[#1a365d] text-2xl">{category.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1a365d]">{category.category}</h2>
                    <p className="text-gray-500 mt-1 text-base">Explore amazing clubs</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.clubs.map((club, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col h-[320px]"
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-[#1a365d] mb-4">
                          {club.name}
                        </h3>
                        <p className="text-gray-600 mb-6 text-base leading-relaxed flex-1">
                          {club.description}
                        </p>
                        <div className="mt-auto">
                          <a
                            href={club.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white hover:opacity-90 transition-all duration-300 text-base font-medium"
                          >
                            <FaInstagram className="mr-2" />
                            Follow on Instagram
                            <FaArrowRight className="ml-2" />
                          </a>
                        </div>
                      </div>
                      <div className="h-1 w-full bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)]"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Join Section */}
        <div className="text-center mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="inline-block p-3 rounded-xl bg-indigo-100 text-[#1a365d] mb-6">
            <FaHeart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a365d] mb-4">
            Find Your Community
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8">
            Follow your favorite clubs on Instagram and reach out to them to become a member!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {clubCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white shadow-sm"
              >
                <span className="text-xl">{category.icon}</span>
                <span className="text-base font-medium">{category.clubs.length} clubs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
