import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({
  onDetected,
  onClose,
  inline = false,
}) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("initializing");
  const [preferredFacing, setPreferredFacing] = useState("environment");
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let controls;
    let didDetect = false;

    async function startScanner() {
      try {
        setStatus("scanning");
        if (selectedDeviceId) {
          controls = await reader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result) => {
              if (!result || didDetect) {
                return;
              }

              const value = result.getText().trim();
              if (value) {
                didDetect = true;
                setStatus("success");
                try {
                  if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(100);
                  }
                } catch {
                  // ignore vibration errors
                }
                onDetected(value);
              }
            },
          );
        } else {
          controls = await reader.decodeFromConstraints(
            {
              audio: false,
              video: {
                facingMode: { ideal: preferredFacing },
              },
            },
            videoRef.current,
            (result) => {
              if (!result || didDetect) {
                return;
              }

              const value = result.getText().trim();
              if (value) {
                didDetect = true;
                setStatus("success");
                try {
                  if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(100);
                  }
                } catch {
                  // ignore vibration errors
                }
                onDetected(value);
              }
            },
          );
        }

        if (navigator?.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const cameraDevices = devices.filter(
            (device) => device.kind === "videoinput",
          );
          setVideoDevices(cameraDevices);
          if (!selectedDeviceId && cameraDevices.length > 0) {
            const preferredDevice = cameraDevices.find((device) =>
              device.label.toLowerCase().includes("back"),
            );
            setSelectedDeviceId(
              preferredDevice?.deviceId || cameraDevices[0].deviceId,
            );
          }
        }
      } catch {
        setStatus("error");
        setError("Unable to access camera. Please allow camera permissions.");
      }
    }

    startScanner();

    return () => {
      if (controls) {
        controls.stop();
      }
    };
  }, [onDetected, preferredFacing, selectedDeviceId]);

  const wrapperClass = inline
    ? "w-full rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm"
    : "w-full max-w-lg rounded-2xl bg-white/95 p-4 shadow-xl";

  const containerClass = inline
    ? "w-full"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4";

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="min-w-0 break-words text-lg font-semibold text-zinc-900">
            Scan Student Barcode
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            Close
          </button>
        </div>

        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => {
              setSelectedDeviceId("");
              setPreferredFacing((facing) =>
                facing === "environment" ? "user" : "environment",
              );
            }}
            className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 sm:w-auto"
          >
            Switch Camera (
            {preferredFacing === "environment" ? "Rear" : "Front"})
          </button>
          {videoDevices.length > 1 ? (
            <select
              value={selectedDeviceId}
              onChange={(event) => setSelectedDeviceId(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:max-w-xs"
            >
              {videoDevices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {(device.label || `Camera ${index + 1}`).slice(0, 50)}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        <p className="mb-2 text-sm text-zinc-600">
          {status === "initializing"
            ? "Starting camera..."
            : status === "scanning"
              ? "Scanning live feed. Align barcode in frame."
              : status === "success"
                ? "Scan successful."
                : "Camera unavailable."}
        </p>
        <video
          ref={videoRef}
          className="h-56 w-full rounded-lg border border-zinc-300 bg-zinc-100 object-cover sm:h-72"
        />
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
