import React, { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await res.json();

    if (res.ok) {
      setStatus("Submitted successfully! Record ID: " + result.id);
    } else {
      setStatus("Submission failed: " + result.error);
    }

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="App">
      <h2>Airtable Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        /><br />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <textarea
          placeholder="Your message"
          value={message}
          required
          onChange={(e) => setMessage(e.target.value)}
        /><br />
        <button type="submit">Submit</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default App;
