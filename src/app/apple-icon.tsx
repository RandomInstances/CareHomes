import { ImageResponse } from "next/og";

// Safari and iOS home screens will not take an SVG favicon, so this renders a
// PNG at build time from the same shape as icon.svg.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e5c55",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <path
            d="M6.5 15.8 16 8.4l9.5 7.4"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.4 15.4V23h13.2v-7.6"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="14.1" y="18" width="3.8" height="5" rx="0.7" fill="#ffffff" />
        </svg>
      </div>
    ),
    size
  );
}
