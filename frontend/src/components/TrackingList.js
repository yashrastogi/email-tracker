// TrackingList.js
import React, { useState } from "react";
import { getActiveTrackingIds, getTrackingData, setStrike, deleteTrackingId } from "../api";

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

  const handleStrikeClick = async (openedAt) => {
    await setStrike(selectedId, openedAt);
    fetchStats(selectedId);
  }

  const handleDeleteClick = async (trackingId) => {
    const pass = window.prompt('Please enter deletion password:');
    await deleteTrackingId(pass, trackingId);
    fetchTrackingIds();
  }

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
            {id} <strong onClick={(event) => { event.stopPropagation(); handleDeleteClick(id); }}>❌</strong>
          </li>
        ))}
      </ul>
      {selectedId && (
        <div>
          <h3>Statistics for Tracking ID: {selectedId} {stats[0] && "(" + stats[0].label + ")"}</h3>
          <ol>
            {stats[0] &&
              stats[0]["opens"].slice().reverse().map((stat, index) => (
                <li key={index} style={{
                  textDecoration: stat.striked ? 'line-through' : 'none'
                }}>
                  <strong>Opened At:</strong> {(new Date(stat.openedAt)).toLocaleString()},{" "}
                  <strong>IP Address:</strong> {stat.ipAddress}{" "}
                  <strong onClick={() => handleStrikeClick(stat.openedAt)}>❌</strong>
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default TrackingList;
