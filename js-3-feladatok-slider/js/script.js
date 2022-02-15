import { Slider } from './slider.js';

new Slider({
  containerSelector: '.slider',
  imgs: [
    './imgs/photo1.jfif',
    './imgs/photo2.jfif',
    './imgs/photo3.jfif',
    './imgs/photo4.jfif',
    './imgs/photo5.jfif',
    './imgs/photo6.jfif',
  ],
  interval: 2500,
});
