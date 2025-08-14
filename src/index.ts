import { func_numberAnimations } from '$utils/animated-numbers';
import { autoClickOnFirst } from '$utils/auto-click-on-first';
import { coloredGridPattern } from '$utils/colored-grid-pattern';
import { loadFinsweetAttributes } from '$utils/finsweet-attributes-loader';
import { heroLightboxVideo } from '$utils/hero-lightbox-video';
import { func_leadershipPageHeight } from '$utils/leadership-page-height';
import { func_popupOverlayHandler } from '$utils/popup-overlay-handler';
import { func_spanCircles } from '$utils/span-circles';
import { func_yearChanger } from '$utils/year-changer';

window.Webflow ||= [];
window.Webflow.push(() => {
  loadFinsweetAttributes();
  autoClickOnFirst();
  heroLightboxVideo();
  coloredGridPattern();
  func_popupOverlayHandler();
  func_yearChanger();
  func_numberAnimations();
  func_spanCircles();
  func_leadershipPageHeight();
});
