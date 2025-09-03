import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import Draggable from "react-draggable";

export default function MemeGenerator() {
  const [memes, setMemes] = useState([]);
  const [randomMeme, setRandomMeme] = useState(null);
  const [topCaption, setTopCaption] = useState("");
  const [bottomCaption, setBottomCaption] = useState("");

  const memeRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setMemes(data.data.memes));
  }, []);

  const getRandomMeme = () => {
    if (memes.length === 0) return;
    const rand = Math.floor(Math.random() * memes.length);
    setRandomMeme(memes[rand]);
    setTopCaption("");
    setBottomCaption("");
  };

  const downloadMeme = async () => {
    if (!memeRef.current) return;
    const canvas = await html2canvas(memeRef.current, { useCORS: true });
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      <h1 className="fw-bold text-primary mb-4">HAHA Generator Lite</h1>

      <div className="d-flex gap-3 mb-4">
        <button onClick={getRandomMeme} className="btn btn-primary shadow">
          Get Random Meme
        </button>
        {randomMeme && (
          <button onClick={downloadMeme} className="btn btn-success shadow">
            Download Meme
          </button>
        )}
      </div>

      {randomMeme && (
        <div
          ref={memeRef}
          className="position-relative border rounded shadow-lg overflow-hidden bg-white"
          style={{ width: "400px" }}
        >
          {/* Meme Image */}
          <img
            src={randomMeme.url}
            alt={randomMeme.name}
            className="w-100 rounded"
            crossOrigin="anonymous"
          />

          {/* Draggable Top Caption */}
          {topCaption && (
            <Draggable nodeRef={topRef} bounds="parent">
              <p
                ref={topRef}
                className="position-absolute text-center fw-bold"
                style={{
                  top: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "24px",
                  color: "white",
                  textShadow: "2px 2px 4px black",
                  cursor: "move",
                  margin: 0,
                }}
              >
                {topCaption}
              </p>
            </Draggable>
          )}

          {/* Draggable Bottom Caption */}
          {bottomCaption && (
            <Draggable nodeRef={bottomRef} bounds="parent">
              <p
                ref={bottomRef}
                className="position-absolute text-center fw-bold"
                style={{
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "24px",
                  color: "white",
                  textShadow: "2px 2px 4px black",
                  cursor: "move",
                  margin: 0,
                }}
              >
                {bottomCaption}
              </p>
            </Draggable>
          )}
        </div>
      )}

      {/* Inputs */}
      {randomMeme && (
        <div
          className="mt-4 d-flex flex-column gap-3 w-100"
          style={{ maxWidth: "350px" }}
        >
          <input
            type="text"
            value={topCaption}
            onChange={(e) => setTopCaption(e.target.value)}
            placeholder="✍️ Add top caption..."
            className="form-control shadow-sm"
          />
          <input
            type="text"
            value={bottomCaption}
            onChange={(e) => setBottomCaption(e.target.value)}
            placeholder="✍️ Add bottom caption..."
            className="form-control shadow-sm"
          />
        </div>
      )}
    </div>
  );
}
