import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [svgUrl, setSvgUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
    console.log("test");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("لطفاً ابتدا یک فایل انتخاب کنید.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/vectorize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSvgUrl(response.data.svgUrl);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "عملیات برداری سازی تصویر با خطا مواجه شد. لطفاً دوباره امتحان کنید.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSvgUrl(null);
    setError(null);
  };

  return (
    <div className="App" dir="rtl">
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            سافت وکتور
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  خانه
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  درباره
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  تماس
                </a>
              </li>
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="جستجو"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                جستجو
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <header className="App-header">
        <form onSubmit={handleUpload} style={{ textAlign: "center" }}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragOver ? "2px dashed #007bff" : "2px dashed #ccc",
              padding: "20px",
              margin: "20px auto",
              width: "80%",
              borderRadius: "10px",
              textAlign: "center",
              backgroundColor: isDragOver ? "#f0f8ff" : "white",
            }}
          >
            <p>یک تصویر را آپلود یا اینجا رها کنید</p>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
              id="file-upload"
            />
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <button type="button">انتخاب فایل</button>
            </label>
          </div>
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Vectorize"}
            </button>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
        {isLoading && <p>Loading...</p>}
        {svgUrl && (
          <div>
            <h2>تبدیل کننده وکتور ... </h2>
            <a href={svgUrl} download="vectorized-image.svg">
              دانلود SVG
            </a>
            <h3>نمایش زنده :</h3>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                display: "inline-block",
              }}
              dangerouslySetInnerHTML={{
                __html: `<object type="image/svg+xml" data="${svgUrl}" style="width: 100%; max-width: 500px;"></object>`,
              }}
            />
          </div>
        )}
      </header>
      <div className="container-welcome" style={{ marginTop: "20px" }}>
        <div className="part-1" style={{ marginBottom: "20px" }}>
          <h2>مرحله 1: آپلود</h2>
          <p>
            برای شروع فرآیند برداری، یک فایل تصویری آپلود کنید یا آن را رها
            کنید.
          </p>
        </div>
        <div className="part-2" style={{ marginBottom: "20px" }}>
          <h2>مرحله 2: فرآیند</h2>
          <p>
            سیستم پیشرفته ما تصویر شما را به یک فایل SVG مقیاس پذیر تبدیل
            می‌کند.
          </p>
        </div>
        <div className="part-3" style={{ marginBottom: "20px" }}>
          <h2>مرحله 3: دانلود کنید</h2>
          <p>
            پس از پردازش، تصویر برداری خود را برای استفاده در هر مکانی دانلود
            کنید.
          </p>
        </div>
      </div>
      <footer style={{ marginTop: "20px", textAlign: "center" }}>
        <p>© 2015-2024</p>
      </footer>
    </div>
  );
}

export default App;
