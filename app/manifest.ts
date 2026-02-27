import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wahy",
    short_name: "Wahy",
    description:
      "Wahy is a Quran Study Management System for sheikhs and students.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F1F5F9",
    theme_color: "#1E293B",
    icons: [
      {
        src: "/quran.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}