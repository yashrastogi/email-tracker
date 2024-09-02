const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
const domainName = process.env.DOMAINNAME || "localhost";
const deletePassword = process.env.DELETEPASSWORD || "Some Kind of Default Password";

let trackingData = [];

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello_world");
});

// Endpoint to strikethrough particular opens
app.post("/strike-open", (req, res) => {
  const { trackingId, openedAt } = req.body;
  let foundId = false, foundOpen = false;
  trackingData.forEach((el) => {
    if (el.id === String(trackingId)) {
      foundId = true;
      el.opens.forEach((el2) => {
        if (String(el2.openedAt) === String(openedAt)) {
          foundOpen = true;
          el2.striked = !el2.striked;
        }
      });
    }
  });
  res.json({foundId, foundOpen});
});

// Endpoint to delete tracking links
app.post("/delete-tracking-link", (req, res) => {
  const { pass, trackingId } = req.body;
  let foundId = false, passMatch = false;
  if (String(pass) === String(deletePassword)) {
    passMatch = true;
    trackingData.forEach((el, idx) => {
      if (el.id === String(trackingId)) {
        foundId = true;
        trackingData.splice(idx, 1);
        deleteUnusedGifImages(trackingData);
      }
    });
  }
  res.json({passMatch, foundId});
});

// Endpoint to generate unique tracking links
app.post("/generate-tracking-link", (req, res) => {
  const { label } = req.body;

  const id = Math.random().toString(36).substring(7);
  const dateCreated = new Date().toLocaleString();

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
  const ipText = req.headers["x-forwarded-for"] || req.ip; // Assuming you're using Express behind a proxy for client IP
  const parts = ipText.split(",");
  const ipAddress = parts.length > 0 ? parts[0] : ipText;

  const visitData = {
    openedAt: new Date().toLocaleString(),
    ipAddress: ipAddress,
    striked: false,
  };

  // Find the tracking link by ID and save visit data
  const trackingLink = trackingData.find((data) => data.id === gifId);
  if (trackingLink) {
    trackingLink.opens.push(visitData);
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
  console.log(`Email tracker app listening on port ${port}`);
});
