// import { coloredGridPattern } from '$utils/colored-grid-pattern';
// import { heroLightboxVideo } from '$utils/hero-lightbox-video';
// import { func_navbarTitlesSync } from '$utils/navbar_titles-sync';
import { func_spanCircles } from '$utils/span-circles';

window.Webflow ||= [];
window.Webflow.push(() => {
  // heroLightboxVideo();
  // coloredGridPattern();
  // func_navbarTitlesSync();
  func_spanCircles();
});
