(function() {
  'use strict';

  // -- Load projects from JSON and render --
  function renderProjects(projects) {
    var strip = document.getElementById('pinStrip');
    if (!strip || !projects || !projects.length) return;

    var fragment = document.createDocumentFragment();

    projects.forEach(function(p, idx) {
      var card = document.createElement('div');
      card.className = 'pin-card';
      card.setAttribute('data-index', idx);

      var csHtml = '';
      p.caseStudies.forEach(function(cs) {
        var cls = 'cs-item';
        if (cs.type === 'problem') cls += ' cs-gold';
        else if (cs.type === 'solution') cls += ' cs-cyan';
        else cls += ' cs-gold';
        csHtml += '<div class="' + cls + '"><div class="cs-label">' + cs.label + '</div><div class="cs-value">' + cs.text + '</div></div>';
      });

      var linksHtml = '';
      p.links.forEach(function(lk) {
        if (lk.type === 'live') {
          var icon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
          linksHtml += '<a href="' + lk.url + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:9px 20px;font-size:0.8rem">' + icon + ' ' + lk.text + '</a>';
        } else {
          var icon2 = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
          linksHtml += '<span class="btn btn-primary coming-soon" style="padding:9px 20px;font-size:0.8rem">' + icon2 + ' ' + lk.text + '</span>';
        }
      });

      card.innerHTML =
        '<div class="pin-card-inner">' +
          '<div class="pin-visual">' + p.visualSvg + '</div>' +
          '<div class="pin-meta">' +
            '<span class="tag">' + p.tag + '</span>' +
            '<h3>' + p.title + '</h3>' +
            '<div class="cs-grid">' + csHtml + '</div>' +
            '<div class="pin-links">' + linksHtml + '</div>' +
          '</div>' +
        '</div>';

      fragment.appendChild(card);
    });

    strip.appendChild(fragment);
  }

  // -- GSAP animations (runs after projects are rendered) --
  function initAnimations() {
    // Hero
    var heroEls = document.querySelectorAll('.hero-content .hero-badge, .hero-content h1, .hero-content p, .hero-actions, .trust-badges');
    var tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(heroEls, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });

    // Service cards
    var serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(function(c, i) {
      gsap.fromTo(c, { opacity: 0, y: 24, scale: 0.97 }, {
        scrollTrigger: { trigger: c, start: 'top 90%', toggleActions: 'play none none reverse' },
        opacity: 1, y: 0, scale: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out'
      });
    });

    // Stat cards
    var statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(function(c, i) {
      gsap.fromTo(c, { opacity: 0, y: 16 }, {
        scrollTrigger: { trigger: c, start: 'top 88%', toggleActions: 'play none none reverse' },
        opacity: 1, y: 0, duration: 0.4, delay: i * 0.08, ease: 'power2.out'
      });
    });

    // Pin scroll
    var pinWrap = document.getElementById('pinWrap');
    var pinStrip = document.getElementById('pinStrip');
    var pinCards = pinStrip ? pinStrip.querySelectorAll('.pin-card') : [];

    if (pinWrap && pinStrip && pinCards.length) {
      function refreshLayout() {
        var totalW = 0;
        pinCards.forEach(function(c) { totalW += c.offsetWidth; });
        pinStrip.style.width = totalW + 'px';
        ScrollTrigger.refresh();
      }

      refreshLayout();
      window.addEventListener('resize', refreshLayout);

      ScrollTrigger.create({
        trigger: pinWrap,
        pin: true,
        start: 'top 0px',
        end: function() { return '+=' + (pinStrip.offsetWidth - window.innerWidth + 200); },
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onRefresh: function() { refreshLayout(); }
      });

      ScrollTrigger.create({
        trigger: pinWrap,
        start: 'top 0px',
        end: function() { return '+=' + (pinStrip.offsetWidth - window.innerWidth + 200); },
        onUpdate: function(self) {
          var max = pinStrip.offsetWidth - window.innerWidth;
          if (max > 0) gsap.set(pinStrip, { x: -self.progress * max });
        }
      });

      pinCards.forEach(function(card) {
        var meta = card.querySelector('.pin-meta');
        var vis = card.querySelector('.pin-visual');
        if (meta) {
          gsap.fromTo(meta, { opacity: 0, y: 30 }, {
            scrollTrigger: { trigger: card, start: 'left 70%', end: 'left 30%', scrub: 1, toggleActions: 'play none none reverse', horizontal: true },
            opacity: 1, y: 0, ease: 'power2.out'
          });
        }
        if (vis) {
          gsap.fromTo(vis, { opacity: 0, scale: 0.92 }, {
            scrollTrigger: { trigger: card, start: 'left 75%', end: 'left 35%', scrub: 1, toggleActions: 'play none none reverse', horizontal: true },
            opacity: 1, scale: 1, ease: 'power2.out'
          });
        }
      });

      ScrollTrigger.refresh();
    }
  }

  // -- Bootstrap --
  document.addEventListener('DOMContentLoaded', function() {
    fetch('data/projects.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        renderProjects(data.projects);
        initAnimations();
      })
      .catch(function() {
        initAnimations();
      });
  });
})();
