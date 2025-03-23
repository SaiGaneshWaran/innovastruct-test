import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Building, Home } from 'lucide-react';
import PropTypes from 'prop-types';
import './tenderChatbot.css';

const TenderChatbot = ({ userType = 'client' }) => {
  const chatBodyRef = useRef(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Load initial context based on user type (client or company)
  useEffect(() => {
    // Initialize with the appropriate context
    setChatHistory([
      {
        hideInChat: true,
        role: "model",
        text: getContextInfo(userType),
      },
    ]);
  }, [userType]);

  // Function to get the context information based on user type
  const getContextInfo = (type) => {
    if (type === 'company') {
      return `
        I'm your AI tender assistant for construction companies. I help construction companies find, evaluate, and bid on tender opportunities efficiently. I can provide information on tender processes, bidding strategies, and market insights specific to the construction industry.

## Capabilities
- Help find relevant tender opportunities based on company specialization
- Provide bidding strategies and competitive analysis
- Explain tender requirements and documentation needs
- Assist with bid preparation and submission
- Analyze market trends and tender statistics
- Suggest ways to strengthen proposals
- Offer insights on pricing strategies

## Tender Process
1. Finding Opportunities - Use the TenderMap and Active Tenders section to discover new projects
2. Evaluating Fit - Assess if the tender matches your company's expertise and capacity
3. Preparing Bids - Develop competitive, compliant, and compelling proposals
4. Submitting Proposals - Ensure all requirements are met before submission
5. Tracking Outcomes - Monitor bid status and analyze performance

## Dashboard Features
- TenderMap - Geographic visualization of available projects
- Active Bids - Track your company's current bid submissions
- Analytics - View performance metrics and success rates
- Tender Dashboard - Overview of all available opportunities

## Bid Strategy Tips
- Highlight your company's unique expertise and past project success
- Ensure accurate cost estimation and realistic timelines
- Emphasize your understanding of the specific project requirements
- Include case studies or examples of similar successful projects
- Address risk management strategies
- Provide clear, detailed documentation

## Common Issues
- Missing submission deadlines
- Incomplete documentation
- Unrealistic pricing (too high or too low)
- Poor alignment with client requirements
- Weak differentiation from competitors

When advising companies, focus on practical, actionable guidance that helps them win more construction tenders and grow their business.

      `;
    } else {
      return `
        I'm your AI tender assistant for construction clients. I help property owners and developers create effective tenders, evaluate contractor bids, and manage construction projects. I provide guidance on the tender process, contractor selection, and project management from a client perspective.

## Capabilities
- Help create clear, detailed tender documents
- Explain how to set realistic budgets and timelines
- Assist with evaluating and comparing contractor bids
- Provide insights on contractor qualifications and credentials
- Offer guidance on project management and oversight
- Help understand construction terminology and standards
- Advise on contract negotiations and terms

## Tender Creation Process
1. Project Definition - Clearly define scope, requirements, and deliverables
2. Budget Planning - Set realistic financial parameters
3. Document Preparation - Create comprehensive tender documents
4. Publishing - Make your tender visible to qualified contractors
5. Bid Evaluation - Compare and assess incoming proposals
6. Contractor Selection - Choose the best fit for your project

## Dashboard Features
- Create Tender - Start a new construction tender project
- My Tenders - View and manage your active and past tenders
- Bid Comparison - Tools to evaluate multiple contractor proposals
- Project Timeline - Track progress and milestones

## Evaluation Tips
- Look beyond the lowest price; consider value and quality
- Verify contractor credentials, licenses, and insurance
- Check past project experience and client references
- Assess proposed timeline reliability and resource allocation
- Consider communication style and compatibility
- Evaluate financial stability and capacity

## Common Issues
- Unclear project requirements leading to scope creep
- Unrealistic budget expectations
- Difficulty comparing dissimilar bids
- Challenges in assessing contractor qualifications
- Questions about fair pricing and market rates

When advising clients, focus on helping them make informed decisions that balance cost, quality, and timeline to achieve successful construction projects.
      `;
    }
  };

  // This function handles sending messages to the AI API
  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError }
      ]);
    };

    // Format chat history for API request
    history = history.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // Make the API call to get the bot's response
      // In a production environment, you would replace this URL with the appropriate environment variable
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
      
      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) throw new Error(data?.error?.message || "Something went wrong!");

      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponseText);
    } catch (error) {
      // Update chat history with the error message
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    // Auto-scroll whenever chat history updates
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;
    setInputValue("");

    // Update chat history with the user's message
    setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

    // Delay 600 ms before showing "Thinking..." and generating response
    setTimeout(() => {
      // Add a "Thinking..." placeholder for the bot's response
      setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

      // Call the function to generate the bot's response
      generateBotResponse([
        ...chatHistory,
        { 
          role: "user", 
          text: `Using the details provided above, please address this query from a ${userType}: ${userMessage}` 
        }
      ]);
    }, 600);
  };

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
        className="fixed bottom-6 right-6 border-none h-12 w-12 flex cursor-pointer items-center justify-center rounded-full bg-yellow-500 shadow-lg z-50"
      >
        <span className="material-symbols-rounded text-white absolute">
          {userType === 'company' ? <Building size={20} /> : <MessageCircle size={20} />}
        </span>
        <span className="material-symbols-rounded text-white absolute">
          <X size={20} />
        </span>
      </button>

      <div className="chatbot-popup fixed w-[420px] opacity-0 right-8 bottom-20 pointer-events-none transform scale-20 overflow-hidden bg-white rounded-xl shadow-xl z-50">
        {/* Chatbot Header */}
        <div className="chat-header flex px-6 py-4 items-center bg-yellow-500 justify-between">
          <div className="header-info flex gap-3 items-center">
            {userType === 'company' ? <Building className="w-6 h-6 text-white" /> : <Home className="w-6 h-6 text-white" />}
            <h2 className="logo-text text-white font-semibold text-lg">
              {userType === 'company' ? 'Company Tender Assistant' : 'Client Tender Assistant'}
            </h2>
          </div>
          <button
            onClick={() => setShowChatbot((prev) => !prev)}
            className="border-none h-10 w-10 text-white cursor-pointer bg-transparent hover:bg-yellow-600 rounded-full transition-colors"
          >
            <Minimize2 className="w-6 h-6 mx-auto" />
          </button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body flex flex-col gap-5 h-[460px] overflow-y-auto mb-20 px-6 py-6">
          <div className="message bot-message flex gap-3 items-center">
            {userType === 'company' ? <Building className="w-6 h-6 text-white bg-yellow-500 p-1 rounded-full" /> : <Home className="w-6 h-6 text-white bg-yellow-500 p-1 rounded-full" />}
            <p className="message-text p-3 max-w-[75%] text-[15px] bg-gray-100 rounded-xl rounded-tl-none">
              {userType === 'company' 
                ? "Hey there! How can I help your construction company with tenders today?" 
                : "Hello! How can I assist with your construction tender needs today?"}
            </p>
          </div>

          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            !chat.hideInChat && (
              <div
                key={index}
                className={`message ${chat.role === "model" ? "bot" : "user"}-message ${chat.isError ? "error" : ""}`}
              >
                {chat.role === "model" && (userType === 'company' ? <Building className="w-6 h-6 text-white bg-yellow-500 p-1 rounded-full" /> : <Home className="w-6 h-6 text-white bg-yellow-500 p-1 rounded-full" />)}
                <p className={`message-text p-3 max-w-[75%] text-[15px] ${
                  chat.role === "model" 
                    ? "bg-gray-100 rounded-xl rounded-tl-none" 
                    : "bg-yellow-500 text-white rounded-xl rounded-tr-none self-end"
                }`}>
                  {chat.text}
                </p>
              </div>
            )
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer absolute bottom-0 w-full bg-white px-6 py-4 border-t">
          <form onSubmit={handleFormSubmit} className="chat-form flex items-center relative bg-white rounded-full border border-gray-300 focus-within:border-yellow-500">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message..."
              className="message-input w-full h-12 border-none outline-none px-4 bg-transparent"
              required
            />
            <button
              type="submit"
              id="send-message"
              className="h-9 w-9 border-none text-white cursor-pointer bg-yellow-500 hover:bg-yellow-600 rounded-full mx-1 flex items-center justify-center"
            >
              <Send size={16} className="text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

TenderChatbot.propTypes = {
  userType: PropTypes.oneOf(['client', 'company']).isRequired
};

export default TenderChatbot;