import React, { useState } from "react";
import { generateTrackingLink } from "../api";

const GenerateTrackingLink = () => {
  const [label, setLabel] = useState("");
  const [gifLink, setGifLink] = useState("");

  const handleGenerateLink = async () => {
    try {
      const { gifLink } = await generateTrackingLink(label);
      setGifLink(gifLink);
    } catch (error) {
      console.error("Error generating tracking link:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Enter label"
      />
      <button onClick={handleGenerateLink}>Generate Tracking Link</button>
      <br />
      {gifLink && gifLink}
      <br />
      {gifLink && `<img src=${gifLink} alt="Generated Tracking Link" />`}
    </div>
  );
};

export default GenerateTrackingLink;
