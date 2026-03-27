import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScanIdPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("initializing");

  const returnTo = location.state?.returnTo || "/transactions";

  const handleClose = useCallback(() => {
    navigate(returnTo, { replace: true });
  }, [navigate, returnTo]);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let controls;
    let didDetect = false;

    async function startScanner() {
      try {
        setStatus("scanning");
        controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (!result || didDetect) {
              return;
            }

            const value = result.getText().trim();

            if (!value) {
              return;
            }

            didDetect = true;
            setStatus("success");

            // Give immediate feedback on scan before navigating back.
            try {
              if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate(100);
              }

              if (typeof window !== "undefined") {
                const audioCtx = new window.AudioContext();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(
                  0.001,
                  audioCtx.currentTime + 0.15,
                );

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.15);
              }
            } catch {
              // Ignore feedback API failures.
            }

            navigate(returnTo, {
              replace: true,
              state: { scannedRoll: value },
            });
          },
        );
      } catch {
        setStatus("error");
        setError("Unable to access camera. Please allow camera permission.");
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
  }, [navigate, returnTo]);

  return (
    <div className="min-h-[calc(100vh-220px)] rounded-2xl border-2 border-red-300 bg-white/95 p-4 shadow-md md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Scan ID Card</h2>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
        >
          Back
        </button>
      </div>

      <p className="mb-3 text-sm text-zinc-600">
        Point your camera at the barcode on the ID card. After successful scan,
        you will be returned automatically.
      </p>

      <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {status === "initializing"
          ? "Starting camera..."
          : status === "scanning"
            ? "Scanning live feed. Align barcode inside the frame."
            : status === "success"
              ? "Scan successful. Returning..."
              : "Camera unavailable."}
      </div>

      <video
        ref={videoRef}
        className="h-[56vh] w-full rounded-xl border border-zinc-300 bg-zinc-100 object-cover"
      />

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
