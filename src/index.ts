import { func_numberAnimations } from '$utils/animated-numbers';
import { coloredGridPattern } from '$utils/colored-grid-pattern';
import { heroLightboxVideo } from '$utils/hero-lightbox-video';
import { func_popupOverlayHandler } from '$utils/popup-overlay-handler';
import { func_spanCircles } from '$utils/span-circles';
import { func_yearChanger } from '$utils/year-changer';

window.Webflow ||= [];
window.Webflow.push(() => {
  heroLightboxVideo();
  coloredGridPattern();
  func_popupOverlayHandler();
  func_yearChanger();
  func_numberAnimations();
  func_spanCircles();
});
