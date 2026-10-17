// robert-jensen.dk — section entrances, the archive topic picker, TOC highlight.
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Entrances: the parts of each section rise in turn as it enters the viewport.
  function rise() {
    var items = document.querySelectorAll('[data-rise]');
    if (!items.length || reduce || !('IntersectionObserver' in window)) return;
    var groups = new Map();
    items.forEach(function (el) {
      var host = el.closest('section, header, ol, ul, article') || document.body;
      var n = groups.get(host) || 0;
      el.style.setProperty('--d', Math.min(n, 6) * 80 + 'ms');
      groups.set(host, n + 1);
    });
    document.documentElement.classList.add('js-rise');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // The live thing: pick a topic, see which years it ran.
  function picker() {
    var root = document.querySelector('[data-archive]');
    if (!root) return;
    var buttons = root.querySelectorAll('.topic');
    var years = root.querySelectorAll('.year');
    var cols = root.querySelectorAll('.chart__col');
    var chart = root.querySelector('.chart');
    var status = root.querySelector('[data-status]');

    function apply(topic, label) {
      var perYear = {};
      var total = 0;
      years.forEach(function (y) {
        var n = 0;
        y.querySelectorAll('li').forEach(function (li) {
          var tags = (li.getAttribute('data-tags') || '').split(' ');
          var hit = !topic || tags.indexOf(topic) !== -1;
          li.classList.toggle('is-out', !hit);
          if (hit) n++;
        });
        perYear[y.getAttribute('data-year')] = n;
        total += n;
        var out = y.querySelector('[data-n]');
        if (out) out.textContent = n;
        y.classList.toggle('is-empty', n === 0);
      });
      var max = 1;
      Object.keys(perYear).forEach(function (k) { max = Math.max(max, perYear[k]); });
      chart.style.setProperty('--max', max);
      cols.forEach(function (c) {
        var n = perYear[c.getAttribute('data-year')] || 0;
        c.querySelector('.chart__bar').style.setProperty('--n', n);
        c.querySelector('.chart__n').textContent = n;
      });
      // Open the newest year that has posts for this topic.
      var opened = false;
      years.forEach(function (y) {
        var open = !opened && perYear[y.getAttribute('data-year')] > 0;
        if (open) opened = true;
        y.open = open;
      });
      if (status) status.textContent = (topic ? label + ': ' : 'All topics: ') + total + ' posts.';
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.preventDefault();
        buttons.forEach(function (x) {
          x.classList.toggle('is-on', x === b);
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        var label = b.childNodes[0].textContent.trim();
        apply(b.getAttribute('data-topic'), label);
      });
    });
  }

  // Table of contents: mark the section being read.
  function tocHere() {
    var links = document.querySelectorAll('.post-toc a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-here'); });
        var a = map[e.target.id];
        if (a) a.classList.add('is-here');
      });
    }, { rootMargin: '0px 0px -70% 0px' });
    Object.keys(map).forEach(function (id) {
      var h = document.getElementById(id);
      if (h) io.observe(h);
    });
  }

  function start() { rise(); picker(); tocHere(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
