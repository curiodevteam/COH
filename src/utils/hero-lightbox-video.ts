/**
 * Hero Lightbox Video Utility
 *
 * This utility manages video visibility in hero sections across the website.
 * Due to Webflow Symbols limitations with video lightbox settings, we've implemented
 * a CMS-based solution where all hero videos are stored in HTML but only one is visible
 * at a time based on the current page slug.
 *
 * How it works:
 * 1. All hero videos are stored in the HTML with a custom attribute 'lightbox-video-target-slug'
 * 2. The utility compares each video's slug with the current page URL
 * 3. Only the video matching the current page slug remains in the DOM
 * 4. All other videos are completely removed from the page
 *
 * This approach allows for dynamic video content management through CMS
 * while maintaining proper lightbox functionality and optimizing page performance
 * by removing unnecessary DOM elements.
 */

export const heroLightboxVideo = () => {
  const all_newAlements = document.querySelectorAll('[lightbox-video-target-slug]');
  if (all_newAlements.length) {
    // Get current page slug from URL
    const currentSlug = window.location.pathname.split('/').pop();

    // Check each element and remove if slug doesn't match
    all_newAlements.forEach((element) => {
      const elementSlug = element.getAttribute('lightbox-video-target-slug');
      if (elementSlug !== currentSlug) {
        element.remove();
      }
    });
  }
};
