import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

interface SignedUrlResponse {
  signedUrl: string;
  uploadId?: string;
  chunkNumber: number;
}

const InterviewRecorder = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const activeUploadsRef = useRef<Set<number>>(new Set());

  // State
  const [sessionId] = useState(uuidv4());
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [failedChunks, setFailedChunks] = useState<number[]>([]);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "finalizing">("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const handleError = () => {
    const video = videoRef.current;
    if (!video || !video.error) {
      setErrorInfo("Unknown error (no video element or no error object).");
      return;
    }

    // Map HTMLMediaElement error codes to human-readable text
    const codeMap: Record<number, string> = {
      1: "MEDIA_ERR_ABORTED: fetching process aborted by user",
      2: "MEDIA_ERR_NETWORK: error occurred when downloading",
      3: "MEDIA_ERR_DECODE: error occurred when decoding",
      4: "MEDIA_ERR_SRC_NOT_SUPPORTED: audio/video not supported",
    };

    const { code, message } = video.error as any;
    const human = codeMap[code] || `Unknown media error code ${code}`;
    setErrorInfo(`${human}${message ? ` — ${message}` : ""}`);
  };

  // Initialize and cleanup
  useEffect(() => {
    return () => {
      // Cleanup media resources
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setCameraError(null);
      setRecordingTime(0);
      recordedChunksRef.current = [];

      const stream = await navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        })
        .catch((err) => {
          setCameraError("Could not access camera/microphone. Please check permissions.");
          throw err;
        });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          setCameraError("Could not start video playback");
          console.error("Video play error:", err);
        });
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9,opus",
      });

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const chunkIndex = recordedChunksRef.current.length;
          recordedChunksRef.current.push(event.data);

          activeUploadsRef.current.add(chunkIndex);
          setUploadState("uploading");

          await uploadChunkWithRetry(event.data, chunkIndex).finally(() => {
            activeUploadsRef.current.delete(chunkIndex);
            if (activeUploadsRef.current.size === 0) {
              setUploadState("idle");
            }
          });
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setCameraError("Recording error occurred");
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setCameraError("Could not start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Finalize upload if needed
      if (uploadId) {
        await finalizeUploadWithRetry();
      }
    }
  };

  const uploadChunkWithRetry = async (chunk: Blob, chunkIndex: number, attempt = 0): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        throw new Error("No network connection");
      }

      // Get signed URL from your backend
      const response = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `interviews/${sessionId}.webm`,
          chunkIndex,
          uploadId,
          contentType: "video/webm",
          sessionId,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const { signedUrl, uploadId: newUploadId } = (await response.json()) as SignedUrlResponse;

      if (newUploadId && !uploadId) {
        setUploadId(newUploadId);
      }

      // Upload the chunk to Google Cloud Storage
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: chunk,
        headers: {
          "Content-Type": "video/webm",
          "Content-Length": chunk.size.toString(),
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      setUploadProgress(calculateProgress(chunkIndex + 1));
      setFailedChunks((prev) => prev.filter((i) => i !== chunkIndex));

      return true;
    } catch (error) {
      console.error(`Upload attempt ${attempt + 1} failed for chunk ${chunkIndex}:`, error);

      if (attempt < MAX_RETRIES - 1) {
        const baseDelay = RETRY_DELAY_MS * Math.pow(2, attempt);
        const jitter = Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
        return uploadChunkWithRetry(chunk, chunkIndex, attempt + 1);
      } else {
        setFailedChunks((prev) => [...prev, chunkIndex]);
        return false;
      }
    }
  };

  const finalizeUploadWithRetry = async (attempt = 0): Promise<void> => {
    try {
      setUploadState("finalizing");

      if (failedChunks.length > 0) {
        const retryResults = await Promise.all(failedChunks.map((index) => uploadChunkWithRetry(recordedChunksRef.current[index], index)));

        if (retryResults.some((success) => !success)) {
          throw new Error("Some chunks failed to upload after retries");
        }
      }

      const response = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `interviews/${sessionId}.webm`,
          uploadId,
          totalChunks: recordedChunksRef.current.length,
          sessionId,
        }),
      });

      if (!response.ok) throw new Error("Finalization failed");

      const { fileUrl } = await response.json();
      console.log("Upload complete:", fileUrl);
      alert("Interview successfully uploaded to Google Cloud Storage!");
    } catch (error) {
      console.error(`Finalization attempt ${attempt + 1} failed:`, error);

      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return finalizeUploadWithRetry(attempt + 1);
      } else {
        alert("Upload completed but finalization failed. Please contact support.");
      }
    } finally {
      setUploadState("idle");
    }
  };

  const calculateProgress = (uploadedChunks: number) => {
    const totalChunks = recordedChunksRef.current.length;
    return Math.min(100, Math.round((uploadedChunks / totalChunks) * 100));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className='interview-recorder'>
      <div style={{ maxWidth: 640, margin: "auto" }}>
        <video ref={videoRef} controls style={{ width: "100%", height: "auto" }} crossOrigin='anonymous' onError={handleError}>
          <source src='https://storage.googleapis.com/evalsy-storage/interviews/e07cbd80-53eb-40ff-a9c0-021e8e6e8f19.webm?alt=media' type='video/webm' />
          Your browser does not support the video tag.
        </video>

        {errorInfo && (
          <div style={{ marginTop: 10, color: "crimson" }}>
            <strong>Playback error:</strong> {errorInfo}
          </div>
        )}

        <p style={{ marginTop: 20 }}>After loading this component, open your browser’s DevTools → Network tab → reload. Look for that `.webm` request:</p>
        <ul>
          <li>
            **Status code 403/401/404?** → Permissions or wrong URL. • Make sure the object is <em>publicly readable</em> or you’re using a valid signed URL.
          </li>
          <li>
            **CORS error in Console?** → Your bucket’s CORS config must allow your app’s origin. Example CORS policy on GCS:
            <pre style={{ background: "#f0f0f0", padding: 10 }}></pre>
          </li>
          <li>
            **Media error code 4** (“SRC_NOT_SUPPORTED”)? Your browser might not support WebM (Safari, iOS). Try providing an MP4 fallback:
            <pre style={{ background: "#f0f0f0", padding: 10 }}></pre>
          </li>
        </ul>
      </div>

      <div className='video-container'>
        <video ref={videoRef} autoPlay muted playsInline className='video-preview' />
        {cameraError && <div className='error-overlay'>{cameraError}</div>}
        {isRecording && (
          <div className='recording-indicator'>
            <div className='recording-dot'></div>
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className='controls'>
        {!isRecording ? (
          <button onClick={startRecording} className='start-button' disabled={!!cameraError}>
            Start Interview
          </button>
        ) : (
          <button onClick={stopRecording} className='stop-button' disabled={uploadState === "finalizing"}>
            {uploadState === "finalizing" ? "Finalizing..." : "End Interview"}
          </button>
        )}
      </div>

      <div className='upload-status'>
        {uploadProgress > 0 && (
          <>
            <progress value={uploadProgress} max='100' />
            <span>{uploadProgress}%</span>
          </>
        )}
        {failedChunks.length > 0 && (
          <div className='error-message'>
            {failedChunks.length} chunks failed.{" "}
            <button onClick={() => finalizeUploadWithRetry()} className='retry-button'>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRecorder;
