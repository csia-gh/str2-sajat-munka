$(document).ready(function () {
  const navbar = $('.navbar');
  const navbarNavs = $('.navbar__navs');
  const navbarToggler = $('.navbar__toggler');

  navbarToggler.click(function () {
    navbarNavs.toggleClass('navbar__navs--is-visible');
    navbar.toggleClass('navbar--is-expanded');
  });

  $(document).scroll(function () {
    let mainNav = $('#mainNav');
    mainNav.toggleClass('navbar--show-bg', $(this).scrollTop() > mainNav.height());
  });
});
