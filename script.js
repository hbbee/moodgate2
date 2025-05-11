// script.js

// This script was used for the image background mouse tracking effect.
// With the introduction of the Spline Web Viewer, this script is no longer needed
// as the viewer handles its own rendering and interactivity.
// You can keep this file, but its code will not be executed unless you link it again
// and re-implement the old background method.

// document.addEventListener('mousemove', function(e) {
//     const backgroundImage = document.querySelector('.background-image');
//     const mouseX = e.clientX;
//     const mouseY = e.clientY;
//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;
//     const normalizedMouseX = (mouseX / windowWidth) - 0.5;
//     const normalizedMouseY = (mouseY / windowHeight) - 0.5;
//     const maxMoveX = 20;
//     const maxMoveY = 20;
//     const transformX = -normalizedMouseX * maxMoveX * 2;
//     const transformY = -normalizedMouseY * maxMoveY * 2;
//     backgroundImage.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
// });
