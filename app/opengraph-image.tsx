import { ImageResponse } from "next/og";

export const alt = "Carreau, un défi CSS par jour en trois niveaux";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPIER = "#e8e9df";
const VERT_CLAIR = "#a9b887";
const VERT_FONCE = "#2e3d28";
const TRAIT = "rgba(169, 184, 135, 0.55)";

// Satori ne gère que flexbox : pas de grid, chaque conteneur à plusieurs enfants est en flex.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          color: VERT_FONCE,
          backgroundColor: PAPIER,
          backgroundImage: `linear-gradient(${TRAIT} 2px, transparent 2px), linear-gradient(90deg, ${TRAIT} 2px, transparent 2px)`,
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", gap: 24, marginBottom: 40 }}>
          <div style={{ width: 96, height: 96, background: VERT_CLAIR, border: `6px solid ${VERT_FONCE}`, borderRadius: 16 }} />
          <div style={{ width: 96, height: 96, background: VERT_FONCE, borderRadius: 48 }} />
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 800,
              background: PAPIER,
              border: `6px solid ${VERT_FONCE}`,
              borderRadius: 16,
            }}
          >
            3
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 168, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>Carreau</div>
        <div style={{ display: "flex", fontSize: 48, marginTop: 24 }}>Un défi CSS par jour, en trois niveaux.</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 16, opacity: 0.75 }}>carreau.projectp.fr</div>
      </div>
    ),
    { ...size },
  );
}
