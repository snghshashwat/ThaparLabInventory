import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onDetected, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let controls;

    async function startScanner() {
      try {
        controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result) {
              const value = result.getText().trim();
              if (value) {
                onDetected(value);
              }
            }
          },
        );
      } catch {
        setError("Unable to access camera. Please allow camera permissions.");
      }
    }

    startScanner();

    return () => {
      if (controls) {
        controls.stop();
      }
      if (typeof reader.reset === "function") {
        reader.reset();
      }
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
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
        <video
          ref={videoRef}
          className="h-72 w-full rounded-lg border border-zinc-300 bg-zinc-100 object-cover"
        />
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
