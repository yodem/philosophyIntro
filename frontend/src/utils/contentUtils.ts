import { Content } from "@/types";

/**
 * Helper function to extract image URLs from Content based on entity type
 */
export function getImageUrlsFromContent(content: Content) {
  if (!content.metadata?.images) return {};

  const images = content.metadata.images;

  // Handle philosopher images
  if ("faceImages" in images || "fullImages" in images) {
    const typedImages = images as {
      faceImages?: { face250x250?: string; face500x500?: string };
      fullImages?: { full600x800?: string };
    };

    return {
      faceImage:
        typedImages.faceImages?.face250x250 ||
        typedImages.faceImages?.face500x500 ||
        null,
      fullImage: typedImages.fullImages?.full600x800 || null,
    };
  }

  // Handle other entity types (terms, questions)
  const otherImages = images as {
    banner400x300?: string;
    banner800x600?: string;
  };

  return {
    bannerImage: otherImages.banner800x600 || otherImages.banner400x300 || null,
  };
}
