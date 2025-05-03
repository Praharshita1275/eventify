const axios = require('axios');
require('dotenv').config();

// Get LMStudio URL from environment variables, default to localhost if not set
const LMSTUDIO_BASE_URL = process.env.LMSTUDIO_URL || 'http://127.0.0.1:1234';
const SERPAPI_KEY = process.env.SERPAPI_KEY; // Add this to your .env file

// Create axios instance with timeout
const axiosInstance = axios.create({
    timeout: 90000, // 90 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// CBIT-specific information
const CBIT_INFO = {
    about: "Chaitanya Bharathi Institute of Technology (CBIT) is a premier engineering college in Hyderabad, established in 1979. It is affiliated to Osmania University and approved by AICTE. The institution has consistently maintained high academic standards and offers state-of-the-art facilities for holistic student development.",
    departments: [
        "Computer Science and Engineering",
        "Electronics and Communication Engineering",
        "Electrical and Electronics Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Information Technology",
        "Artificial Intelligence and Data Science"
    ],
    facilities: {
        academic: [
            "Modern Classrooms",
            "Well-equipped Laboratories",
            "Central Library",
            "Digital Learning Resources",
            "Research Centers",
            "Innovation Hub"
        ],
        infrastructure: [
            "Assembly Hall (500 capacity)",
            "N Block Seminar Hall (150 capacity)",
            "D Block Seminar Hall (120 capacity)",
            "Conference Hall (50 capacity)",
            "TPO Hall for placement activities",
            "Open Air Auditorium (1000 capacity)"
        ],
        laboratories: [
            "CSE Labs with high-performance systems",
            "AI/DS Labs with GPU workstations",
            "IT Labs for networking and development",
            "Electronics and Communication Labs",
            "Electrical Engineering Labs",
            "Mechanical Engineering Labs",
            "Civil Engineering Labs"
        ],
        amenities: [
            "Sports Complex",
            "Auditorium",
            "Hostel Facilities",
            "Cafeteria",
            "Medical Center",
            "Transport Facility"
        ]
    },
    clubs: {
        cultural: {
            umbrella: "Chaitanya Samskruthi",
            clubs: [
                {
                    name: "Chaitanya Geethi",
                    type: "Singing Club",
                    activities: ["Singing competitions", "Karaoke sessions", "Music workshops"]
                },
                {
                    name: "Chaitanya Vaadya",
                    type: "Instrumental Music",
                    activities: ["Instrumental performances", "Jam sessions"]
                },
                {
                    name: "UDC",
                    type: "Dance Club",
                    activities: ["Dance performances", "Choreography workshops"]
                },
                {
                    name: "Chaitanya Chaaya",
                    type: "Film & Media",
                    activities: ["Short films", "Documentaries", "Event coverage"]
                }
            ]
        },
        technical: {
            clubs: [
                {
                    name: "COSC",
                    description: "CBIT Open Source Community promoting open-source development"
                },
                {
                    name: "Neural Nexus",
                    description: "AI/ML club exploring cutting-edge technologies"
                },
                {
                    name: "Robotics & Innovation",
                    description: "Fostering innovation through robotics projects"
                },
                {
                    name: "IEEE Student Branch",
                    description: "Professional development and technical activities"
                }
            ]
        },
        service: {
            umbrella: "Chaitanya Seva",
            clubs: [
                {
                    name: "NSS",
                    description: "National Service Scheme for community service"
                },
                {
                    name: "Chaitanya Spandana",
                    description: "Social service and community welfare"
                },
                {
                    name: "Chaitanya Svaasthya",
                    description: "Mental health and wellness initiatives"
                }
            ]
        }
    },
    contact: {
        address: "Gandipet, Hyderabad - 500075, Telangana, India",
        phone: "+91-40-24193276",
        email: "info@cbit.ac.in",
        website: "https://www.cbit.ac.in"
    },
    achievements: {
        rankings: [
            "NAAC 'A' Grade accreditation",
            "NBA accredited programs",
            "Consistently high placement records",
            "Research publications in prestigious journals"
        ],
        research: [
            "Multiple research centers",
            "Industry collaborations",
            "Funded projects",
            "Patent publications"
        ]
    }
};

// Web search function
const searchWeb = async (query) => {
    try {
        if (!SERPAPI_KEY) {
            console.warn('SERPAPI_KEY not found in environment variables');
            return null;
        }

        const response = await axios.get('https://serpapi.com/search', {
            params: {
                q: `Chaitanya Bharathi Institute of Technology ${query}`,
                api_key: SERPAPI_KEY,
                engine: 'google',
                num: 3
            }
        });

        if (response.data && response.data.organic_results) {
            return response.data.organic_results.map(result => ({
                title: result.title,
                snippet: result.snippet,
                link: result.link
            }));
        }
        return null;
    } catch (error) {
        console.error('Web search error:', error.message);
        return null;
    }
};

const generateResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Using LMStudio URL:', LMSTUDIO_BASE_URL);
        console.log('Sending request to LMStudio with message:', message);

        // First, check if LMStudio is running
        try {
            const healthCheck = await axios.get(`${LMSTUDIO_BASE_URL}/health`);
            console.log('LMStudio health check response:', healthCheck.data);
        } catch (error) {
            console.error('LMStudio health check failed:', error.message);
            return res.status(503).json({ 
                error: 'LMStudio service is not available',
                details: 'Please ensure LMStudio is running and accessible'
            });
        }

        // Perform web search for additional context
        let webResults = null;
        if (!message.toLowerCase().includes('about') && 
            !message.toLowerCase().includes('departments') &&
            !message.toLowerCase().includes('facilities') &&
            !message.toLowerCase().includes('contact')) {
            webResults = await searchWeb(message);
        }

        // Prepare the request to LMStudio with CBIT context and web results
        const requestData = {
            model: "local-model",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant for Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad. 
                    Here is comprehensive information about CBIT:
                    ${JSON.stringify(CBIT_INFO, null, 2)}
                    
                    ${webResults ? `Here is some additional information from the web:
                    ${webResults.map(result => `Title: ${result.title}\nSummary: ${result.snippet}\nSource: ${result.link}`).join('\n\n')}` : ''}
                    
                    Provide clear, concise, and relevant responses about CBIT.
                    When asked about specific topics:
                    - For clubs: Mention the relevant club category and specific clubs
                    - For facilities: List relevant facilities and their capacities
                    - For departments: Include department-specific information
                    - For achievements: Highlight relevant accomplishments
                    
                    If you find relevant information from the web search, include it in your response and cite the source.
                    If you don't know the answer, say "I don't have that information, but you can check the official CBIT website at https://www.cbit.ac.in for more details."
                    Always be polite and helpful.`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            stream: false
        };

        console.log('Sending request to LMStudio:', JSON.stringify(requestData, null, 2));

        // Send the chat completion request
        const response = await axiosInstance.post(`${LMSTUDIO_BASE_URL}/v1/chat/completions`, requestData);

        console.log('Raw response from LMStudio:', JSON.stringify(response.data, null, 2));

        // Handle different possible response formats
        let botResponse;
        if (response.data?.choices?.[0]?.message?.content) {
            botResponse = response.data.choices[0].message.content;
        } else if (response.data?.generated_text) {
            botResponse = response.data.generated_text;
        } else if (response.data?.text) {
            botResponse = response.data.text;
        } else if (response.data?.response) {
            botResponse = response.data.response;
        } else if (response.data?.message) {
            botResponse = response.data.message;
        } else if (typeof response.data === 'string') {
            botResponse = response.data;
        } else {
            console.error('Unexpected response format:', {
                data: response.data,
                type: typeof response.data,
                keys: Object.keys(response.data || {})
            });
            throw new Error('Unexpected response format from LMStudio');
        }

        // Clean up the response if needed
        botResponse = botResponse.trim();
        
        return res.status(200).json({
            response: botResponse
        });
    } catch (error) {
        console.error('Error in chatbot response:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        
        if (error.code === 'ECONNABORTED') {
            // Request timeout
            return res.status(504).json({ 
                error: 'Request timeout',
                details: 'The AI service took too long to respond. Please try again.'
            });
        } else if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('LMStudio error response:', error.response.data);
            return res.status(error.response.status).json({ 
                error: 'Error from LMStudio service',
                details: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response from LMStudio:', error.message);
            return res.status(503).json({ 
                error: 'LMStudio service is not responding',
                details: 'Please ensure LMStudio is running and accessible'
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Unexpected error:', error.message);
            return res.status(500).json({ 
                error: 'Failed to generate response',
                details: error.message 
            });
        }
    }
};

module.exports = {
    generateResponse
}; 