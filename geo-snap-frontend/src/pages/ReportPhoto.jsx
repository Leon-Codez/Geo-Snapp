import React, { useState } from "react";

function ReportPhoto({ contentId }) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const submitReport = async () => {
    if (!reason) return setMessage("Please select a reason");

    const response = await fetch("http://127.0.0.1:8000/moderation/manual-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content_id: contentId,
        reason: reason,
      }),
    });

    const data = await response.json();
    setMessage(data.message || "Submitted");
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <label>Report reason:</label>
      <select onChange={(e) => setReason(e.target.value)} value={reason}>
        <option value="">Select</option>
        <option value="Inappropriate">Inappropriate</option>
        <option value="Offensive">Offensive</option>
        <option value="Spam">Spam</option>
      </select>
      <button onClick={submitReport} style={{ marginLeft: "10px" }}>
        Report
      </button>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default ReportPhoto;
