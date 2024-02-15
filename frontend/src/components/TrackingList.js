// TrackingList.js
import React, { useState } from "react";
import { getActiveTrackingIds, getTrackingData } from "../api";

const TrackingList = () => {
  const [trackingIds, setTrackingIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stats, setStats] = useState([]);

  const fetchTrackingIds = async () => {
    try {
      const ids = await getActiveTrackingIds();
      setTrackingIds(ids);
    } catch (error) {
      console.error("Error fetching tracking IDs:", error);
    }
  };

  const fetchStats = async (trackingId) => {
    try {
      const data = await getTrackingData(trackingId);
      setStats(data);
    } catch (error) {
      console.error(`Error fetching stats for ID ${trackingId}:`, error);
    }
  };

  const handleTrackingIdClick = (trackingId) => {
    setSelectedId(trackingId);
    fetchStats(trackingId);
  };

  const handleFetchAllTrackingIds = () => {
    fetchTrackingIds();
  };

  return (
    <div>
      <h2>Tracking IDs</h2>
      <button onClick={handleFetchAllTrackingIds}>
        Fetch All Tracking IDs
      </button>
      <ul>
        {trackingIds.map((id) => (
          <li key={id} onClick={() => handleTrackingIdClick(id)}>
            {id}
          </li>
        ))}
      </ul>
      {selectedId && (
        <div>
          <h3>Statistics for Tracking ID: {selectedId} {stats[0] && "("+stats[0].label+")"}</h3>
          <ol>
            {stats[0] &&
              stats[0]["opens"].slice().reverse().map((stat, index) => (
                <li key={index}>
                  <strong>Opened At:</strong> {(new Date(stat.openedAt)).toLocaleString()},{" "}
                  <strong>IP Address:</strong> {stat.ipAddress}
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default TrackingList;
