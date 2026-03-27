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

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let controls;
    let didDetect = false;

    async function startScanner() {
      try {
        setStatus("scanning");
        controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: "environment" },
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
  }, [onDetected]);

  const wrapperClass = inline
    ? "w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
    : "w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl";

  const containerClass = inline
    ? "w-full"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4";

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900">
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
          className="h-64 w-full rounded-lg border border-zinc-300 bg-zinc-100 object-cover sm:h-72"
        />
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
