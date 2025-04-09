import React from 'react';

// Data for College Clubs (Categorized with Instagram Links)
const clubCategories = [
  {
    category: "Cultural Clubs",
    image: "/assests/images/csclub.jpg",
    clubs: [
      { name: "Chaitanya Samskruthi", instagram: "https://www.instagram.com/chaitanya_samskruthi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Chaitanya Geethi", instagram: "https://www.instagram.com/chaitanya_geethi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Chaitanya Vaadya", instagram: "https://www.instagram.com/chaitanya_vaadya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "UDC", instagram: "https://www.instagram.com/uniteddancecrew/?hl=en" },
      { name: "Chaitanya Chaaya", instagram: "https://www.instagram.com/chaaya.cbit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Chaitanya Srujana", instagram: "https://www.instagram.com/chaitanya_srujana_cbit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Communicando", instagram: "https://www.instagram.com/communicando?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Toastmasters", instagram: "https://www.instagram.com/tmcbit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "CBIT MUN", instagram: "https://www.instagram.com/cbitmunhyd?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Transcendent", instagram: "https://www.instagram.com/transcendent.cbit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Writers and Poets Club", instagram: "https://www.instagram.com/wpc_cbit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "CBIT Photography Club", instagram: "https://www.instagram.com/cbitphotoclub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
    ],
  },
  {
    category: "Technical Clubs",
    image: "/assests/images/tech.jpg",
    clubs: [
      { name: "Chaitanya Astra", instagram: "https://www.instagram.com/chaitanyaastra/?hl=en" },
      { name: "Praheti Racing", instagram: "https://www.instagram.com/prahetiracing/?hl=en" },
      { name: "CBIT Developer Student Club", instagram: "https://www.instagram.com/cbitdsc/?hl=en" },
      { name: "HiCon (Hackiton Earlier)", instagram: "https://www.instagram.com/hicon_cbit/?hl=en" },
      { name: "COSC (CBIT Open Source Community)", instagram: "https://www.instagram.com/cbitosc/?hl=en" },
      { name: "CCC (CBIT Cybersecurity Club)", instagram: "https://www.instagram.com/ccc_cbit/?hl=en" },
      { name: "Neural Nexus CBIT", instagram: "https://www.instagram.com/neuralnexuscbit/?hl=en" },
      { name: "Ham Radio Club", instagram: "https://www.instagram.com/hrc.cbit/?hl=en" },
      { name: "BBCC", instagram: "https://www.instagram.com/bbcc_cbit/?hl=en" },
      { name: "Ramanujan Maths Club (RMC)", instagram: "https://www.instagram.com/rmc.cbit/?hl=en" },
      { name: "IEEE", instagram: "https://www.instagram.com/ieee_cbit/?hl=en" },
      { name: "Robotics & Innovation", instagram: "https://www.instagram.com/robotics_cbit/?hl=en" },
      { name: "SATARC", instagram: "https://www.instagram.com/satarc.infsec/?hl=en" },
      { name: "Yuva Aarav", instagram: "https://www.instagram.com/yuva_aarav/?hl=en" },
      { name: "NexIoT", instagram: "https://www.instagram.com/nexiot_cbit/?hl=en" },
      { name: "CEA (Civil Engineering Association)", instagram: "https://www.instagram.com/cea_cbit/?hl=en" },
    ],
  },
  {
    category: "Chaitanya Seva Clubs",
    image: "/assests/images/seva.jpg",
    clubs: [
      { name: "NSS", instagram: "https://www.instagram.com/cbitnss/?hl=en" },
      { name: "ELC", instagram: "https://www.instagram.com/elc.cbit/?hl=en" },
      { name: "Chaitanya Spandana", instagram: "https://www.instagram.com/chaitanya.spandana/?hl=en" },
      { name: "EWB", instagram: "https://www.instagram.com/ewbcbit/?hl=en" },
      { name: "EDC", instagram: "https://www.instagram.com/edccbit/?hl=en" },
      { name: "Chaitanya Svaasthya", instagram: "https://www.instagram.com/chaitanya.svaasthya/?hl=en" },
      { name: "Chaitanya Suraksha", instagram: "https://www.instagram.com/chaitanya_suraksha/?hl=en" },
      { name: "Chaitanya Sattva", instagram: "https://www.instagram.com/chaitanya.sattva/?hl=en" },
      { name: "CBIT Talks", instagram: "https://www.instagram.com/cbitalks_/?hl=en" },
    ],
  },
  {
    category: "Sports Clubs",
    image: "/assests/images/kreeda.jpg",
    clubs: [
      { name: "Chaitanya Kreeda", instagram: "https://www.instagram.com/chaitanyakreeda/?hl=en" },
      { name: "E-Sports", instagram: "https://www.instagram.com/cbitesports/?hl=en" },
    ],
  },
];

function About() {
  return (
    <section className="py-20 px-6 md:px-10 bg-gradient-to-b from-blue-100 via-white to-white text-center">
      <h2 className="text-4xl font-bold text-primary mb-4">About Eventify</h2>
      <p className="text-gray-600 text-lg">
        Eventify is a club management platform designed to streamline event organization, resource booking, and communication. 
        It simplifies managing college events by providing an intuitive interface for organizers and attendees alike.
      </p>

      <br />
      <h2 className="text-4xl font-bold text-primary mb-8">Our College Clubs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {clubCategories.map((category, index) => (
          <div 
            key={index} 
            className="bg-gray-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-all duration-300"
          >
            <img 
              src={category.image} 
              alt={`${category.category}`} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold text-primary mb-4">{category.category}</h3>

            <ul className="text-left list-disc list-inside">
              {category.clubs.map((club, idx) => (
                <li key={idx} className="mb-2 text-gray-700">
                  <a 
                    href={club.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {club.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default About;