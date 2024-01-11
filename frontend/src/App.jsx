import React, { useState, useEffect, useRef } from 'react';
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Call scrollToBottom whenever chats update
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const themeClass = isDarkMode ? "dark-theme" : "light-theme";

  // Function to toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };


  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    setIsLoading(true); // Trigger loading state

    {/* Loading Indicator Inside the Assistant's Section */}
    {isLoading && <div className="loader"></div>}

    fetch("http://localhost:8080/", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        msgs.push(data.output);
        setChats(msgs);
        setIsTyping(false);
        scrollTo(0, 1e10);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        
      });
  };

  return (
    <main>
      <h1>SofLamGPT</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <div key={index} className={chat.role === "user" ? "user_msg" : "assistant_msg"}>
                <p>
                  <span>
                    <b>{chat.role.toUpperCase()}</b>
                  </span>
                  <span>:</span>
                  <span>{chat.content}</span>
                </p>
               
              </div>
            ))
          : ""}
      </section>
      
      {/* Empty div for scrolling into view */}
      <div ref={messagesEndRef} />

      <div className={isTyping ? "typing-indicator" : "hide"}>
        <p>
          <i>Typing...</i>
          
        </p>
        {isLoading && <div className="loader"></div>}
      </div>




      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;