const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;
const domainName = "localhost";

// Dummy tracking data (for demonstration)
let trackingData = [
  {
    id: "8em5td",
    label: "Test Label",
    dateCreated: "14/2/2024, 23:31:06",
    opens: [
      {
        openedAt: "14/2/2024, 23:31:18",
        ipAddress: "::1",
      },
      {
        openedAt: "14/2/2024, 23:31:20",
        ipAddress: "::1",
      },
      {
        openedAt: "14/2/2024, 23:31:22",
        ipAddress: "::1",
      },
    ],
  },
];

app.use(bodyParser.json());

// Endpoint to generate unique tracking links
app.post("/generate-tracking-link", (req, res) => {
  const { label } = req.body;

  // Here you can generate a unique tracking link and store it in your database
  const id = Math.random().toString(36).substring(7);
  const dateCreated = new Date().toLocaleString("en-IN", {
    timeZone: "IST",
    hour12: false,
  });

  // Write transparent 1x1 gif
  const transparentGif = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  fs.writeFileSync(`${__dirname}/uploads/${id}.gif`, transparentGif);

  const gifLink = `http://${domainName}/uploads/${id}.gif`;

  trackingData.push({
    id: id,
    label: label,
    dateCreated: dateCreated,
    opens: [],
  });

  res.json({ gifLink });
});

// Log visits to transparent GIF and save to trackingData
app.get("/uploads/:gifId.gif", (req, res) => {
  const gifId = req.params.gifId;
  const ipAddress = req.ip; // Assuming you're using Express behind a proxy for client IP

  const visitData = {
    openedAt: new Date().toLocaleString("en-IN", {
      timeZone: "IST",
      hour12: false,
    }),
    ipAddress: ipAddress,
  };

  // Find the tracking link by ID and save visit data
  const trackingLink = trackingData.find((data) => data.id === gifId);
  if (trackingLink) {
    trackingLink.opens.push(visitData);
    console.log(trackingData);
  }

  res.sendFile(`${__dirname}/uploads/${gifId}.gif`);
});

// Endpoint to retrieve all active tracking links
app.get("/active-tracking-ids", (req, res) => {
  // Here you can fetch all active tracking links from your database
  const activeTrackingIds = trackingData.map((data) => data.id);
  res.json(activeTrackingIds);
});

// Endpoint to retrieve tracking statistics for a specific link
app.get("/tracking-data/:trackingId", (req, res) => {
  const { trackingId } = req.params;

  // Here you can fetch tracking data for the provided tracking link from your database
  const statsForLink = trackingData.filter((data) => data.id === trackingId);
  res.json(statsForLink);
});

function deleteUnusedGifImages(trackingData) {
  const uploadsDir = path.join(__dirname, "uploads");

  // Read the contents of the uploads directory
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error("Error reading uploads directory:", err);
      return;
    }

    // Iterate through each file in the uploads directory
    files.forEach((file) => {
      // Extract the ID from the file name
      const fileId = path.basename(file, ".gif");

      // Check if the ID exists in the trackingData array
      const existsInTrackingData = trackingData.some(
        (data) => data.id === fileId
      );

      // If the ID is not found in trackingData, delete the file
      if (!existsInTrackingData) {
        const filePath = path.join(uploadsDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("Deleted:", file);
          }
        });
      }
    });
  });
}

deleteUnusedGifImages(trackingData);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
