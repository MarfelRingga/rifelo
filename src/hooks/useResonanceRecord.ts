import { useState, useRef, useCallback } from 'react';

export function useResonanceRecord() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlobUrl, setRecordingBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback((canvas: HTMLCanvasElement, durationMs: number = 6000) => {
    try {
      // We want a minimum of 30 FPS, but we'll request 60 FPS. 
      // The canvas will capture at up to 60 FPS if the device can handle it.
      const stream = canvas.captureStream(60);
      
      // Calculate bitrate based on resolution. 
      // Minimum 2.5Mbps for 720p, scale up for higher resolutions (e.g., 1080p).
      const basePixels = 720 * 1280;
      const currentPixels = canvas.width * canvas.height;
      const BITRATE = Math.max(2500000, Math.floor((currentPixels / basePixels) * 3500000));
      
      let options: MediaRecorderOptions = { mimeType: 'video/webm', videoBitsPerSecond: BITRATE };
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
        options = { mimeType: 'video/mp4;codecs=h264', videoBitsPerSecond: BITRATE };
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: BITRATE };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: options.mimeType });
        const url = URL.createObjectURL(blob);
        setRecordingBlobUrl(url);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto stop after duration
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }, durationMs);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  }, []);

  const clearRecording = useCallback(() => {
    if (recordingBlobUrl) {
      URL.revokeObjectURL(recordingBlobUrl);
      setRecordingBlobUrl(null);
    }
  }, [recordingBlobUrl]);

  return {
    isRecording,
    recordingBlobUrl,
    startRecording,
    clearRecording
  };
}
