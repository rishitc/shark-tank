import ReactMarkdown from "react-markdown";
import "./message.css";

// New DialogueBox component
interface MessageProps {
  text: string;
  name: string;
  isShark: boolean;
  className?: string;
}

export default function Message({
  text,
  name,
  isShark,
  className = "",
}: MessageProps) {
  return (
    <div
      className={`dialogue-box ${
        isShark ? "shark" : "entrepreneur"
      } ${className}`}
    >
      {isShark ? (
        <>
          <div className="avatar-container-shark">
            <div className="avatar-placeholder"></div>
            <p className="avatar-name">{name}</p>
          </div>
          <div className="dialogue-text-container">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        </>
      ) : (
        <>
          <div className="dialogue-text-container">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
          <div className="avatar-container-entrepreneur">
            <div className="avatar-placeholder"></div>
            <p className="avatar-name">{name}</p>
          </div>
        </>
      )}
    </div>
  );
}
