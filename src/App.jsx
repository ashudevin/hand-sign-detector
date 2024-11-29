import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [alphabet, setAlphabet] = useState("");
  const [sentence, setSentence] = useState("");

  // Fetch detected alphabet from backend
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://localhost:8000/detect")
        .then((response) => {
          if (response.data.alphabet) {
            setAlphabet(response.data.alphabet);
            setSentence((prev) => prev + response.data.alphabet);
          }
        })
        .catch((err) => console.error("Error fetching alphabet:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClear = () => setSentence("");

  const handleDelete = () => {
    const textarea = document.querySelector("textarea");
    const { selectionStart, selectionEnd } = textarea;
  
    if (selectionStart === selectionEnd) {
      // No selection, delete the character before the cursor
      const updatedSentence =
        sentence.slice(0, selectionStart - 1) + sentence.slice(selectionEnd);
      setSentence(updatedSentence);
  
      // Move the cursor back one position
      setTimeout(() => {
        textarea.setSelectionRange(selectionStart - 1, selectionStart - 1);
      }, 0);
    } else {
      // Delete the selected text
      const updatedSentence =
        sentence.slice(0, selectionStart) + sentence.slice(selectionEnd);
      setSentence(updatedSentence);
  
      // Set the cursor at the end of the deleted selection
      setTimeout(() => {
        textarea.setSelectionRange(selectionStart, selectionStart);
      }, 0);
    }
  };
  
  const handleSpace = () => setSentence((prev) => prev + " ");
  
  const handleSpeak = () => {
    if (!sentence.trim()) return; // Avoid speaking empty strings
  
    const utterance = new SpeechSynthesisUtterance(sentence);
    const voices = speechSynthesis.getVoices();
  
    // Select a more natural voice if available
    const humanLikeVoice = voices.find((voice) =>
      ["Google US English", "Microsoft David Desktop - English (United States)"].includes(voice.name)
    );
  
    // If a human-like voice is found, use it
    if (humanLikeVoice) {
      utterance.voice = humanLikeVoice;
    }
  
    utterance.lang = "en-US"; // Set language
    speechSynthesis.speak(utterance); // Speak the sentence
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Hand Sign Detection</h1>
      <div style={styles.videoWrapper}>
        <img
          src="http://localhost:8000/video_feed"
          alt="Webcam Feed"
          style={styles.video}
        />
      </div>
      <h2 style={styles.detectedAlphabet}>
        Detected Alphabet: <span style={styles.alphabet}>{alphabet}</span>
      </h2>
      <textarea
        value={sentence}
        onChange={(e) => setSentence(e.target.value)} // Editable text
        style={styles.textarea}
      ></textarea>
      <div style={styles.buttonContainer}>
        <button onClick={handleClear} style={styles.button}>
          Clear
        </button>
        <button onClick={handleDelete} style={styles.button}>
          Delete
        </button>
        <button onClick={handleSpace} style={styles.button}>
          Space
        </button>
        <button onClick={handleSpeak} style={styles.button}>
          Speak
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  videoWrapper: {
    border: "4px solid #333",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "20px",
  },
  video: {
    borderRadius: "10px",
    width: "640px",
    height: "480px",
  },
  detectedAlphabet: {
    fontSize: "1.5rem",
    color: "#555",
    marginBottom: "10px",
  },
  alphabet: {
    fontWeight: "bold",
    color: "#007bff",
  },
  textarea: {
    width: "80%",
    height: "100px",
    margin: "20px 0",
    fontSize: "18px",
    textAlign: "center",
    border: "2px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    resize: "none",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
};

export default App;
