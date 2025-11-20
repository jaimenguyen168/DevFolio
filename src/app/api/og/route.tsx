import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "DevFolio";
    const subtitle =
      searchParams.get("subtitle") ||
      "Professional Developer Portfolio Builder";
    const username = searchParams.get("username");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#2D3748", // Dark navy background like your logo
            fontFamily: '"Inter", system-ui, sans-serif',
            position: "relative",
          }}
        >
          {/* Decorative connection nodes - inspired by your logo */}
          <div
            style={{
              position: "absolute",
              top: "80px",
              right: "100px",
              width: "40px",
              height: "40px",
              backgroundColor: "#FF8C00",
              borderRadius: "50%",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "100px",
              right: "160px",
              width: "6px",
              height: "35px",
              backgroundColor: "#FF8C00",
              borderRadius: "3px",
              transform: "rotate(35deg)",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "120px",
              right: "200px",
              width: "30px",
              height: "30px",
              backgroundColor: "#FF8C00",
              borderRadius: "50%",
              opacity: 0.4,
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "100px",
              left: "80px",
              width: "35px",
              height: "35px",
              backgroundColor: "#FF8C00",
              borderRadius: "50%",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "120px",
              left: "130px",
              width: "5px",
              height: "30px",
              backgroundColor: "#FF8C00",
              borderRadius: "3px",
              transform: "rotate(-30deg)",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "140px",
              left: "170px",
              width: "25px",
              height: "25px",
              backgroundColor: "#FF8C00",
              borderRadius: "50%",
              opacity: 0.3,
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            {/* Logo/Icon - matching your design */}
            <div
              style={{
                width: "140px",
                height: "140px",
                backgroundColor: "#FF8C00", // Orange like your logo
                borderRadius: "50%", // Circular like your logo
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "40px",
                boxShadow: "0 20px 40px rgba(255, 140, 0, 0.3)",
              }}
            >
              <div
                style={{
                  fontSize: "64px",
                  color: "#2D3748", // Dark navy text
                  fontWeight: "bold",
                }}
              >
                {"</>"}
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: username ? "54px" : "72px",
                fontWeight: "800",
                color: "white",
                margin: "0 0 20px 0",
                textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              {title}
            </h1>

            {/* Username if provided */}
            {username && (
              <p
                style={{
                  fontSize: "32px",
                  color: "#FF8C00", // Orange accent for username
                  margin: "0 0 20px 0",
                  fontWeight: "600",
                }}
              >
                @{username}
              </p>
            )}

            {/* Subtitle */}
            <p
              style={{
                fontSize: "28px",
                color: "rgba(255, 255, 255, 0.9)",
                margin: "0 60px",
                textAlign: "center",
                lineHeight: 1.4,
                fontWeight: "400",
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom branding */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "60px",
              display: "flex",
              alignItems: "center",
              color: "#FF8C00", // Orange branding
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            devfolio.me
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`Failed to generate OG image: ${e.message}`);
    return new Response(`Failed to generate OG image`, {
      status: 500,
    });
  }
}
