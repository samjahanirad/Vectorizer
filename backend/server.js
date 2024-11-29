const express = require("express");
const multer = require("multer");
const potrace = require("potrace");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.static("public"));

// Endpoint to handle image upload and vectorization
app.post("/vectorize", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;
  const outputSvgPath = path.join("outputs", `${req.file.filename}.svg`);

  // Convert raster image to SVG
  potrace.trace(imagePath, (err, svg) => {
    if (err) {
      console.error("Error during vectorization:", err);
      res
        .status(500)
        .json({ error: "An error occurred while processing your image." });
      return;
    }

    // Save the SVG file
    fs.writeFileSync(outputSvgPath, svg);

    // Serve the SVG back to the user
    res.json({
      message: "Vectorization successful!",
      svgUrl: `/outputs/${req.file.filename}.svg`,
    });

    // Cleanup uploaded file after conversion
    fs.unlinkSync(imagePath);
  });
});

// Serve the output SVG files
app.use("/outputs", express.static("outputs"));

// Serve the React app from the build folder
app.use(express.static(path.join(__dirname, "build")));

// Handle any other routes by serving the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Create directories if not exist
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("outputs")) fs.mkdirSync("outputs");

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
