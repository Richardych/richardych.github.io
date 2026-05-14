(function () {
    'use strict';

    // =========================================================================
    // 1. Nav scroll spy — highlight the link matching the current section
    // =========================================================================
    const navLinks = document.querySelectorAll('nav .nav-links a[href^="#"]');
    const sections = [];

    navLinks.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        var sec = document.getElementById(id);
        if (sec) sections.push({ id: id, el: sec, link: link });
    });

    function onScroll() {
        var scrollY = window.scrollY + 80;
        var atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 2);

        var current = sections[0];
        if (atBottom) {
            current = sections[sections.length - 1];
        } else {
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].el.offsetTop <= scrollY) current = sections[i];
            }
        }
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        if (current) current.link.classList.add('active');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // =========================================================================
    // 2. Fade-in on scroll — pub cards, timeline items, news items, awards
    // =========================================================================
    var fadeEls = document.querySelectorAll(
        '.pub-card, .timeline-item, .news-list li, .awards-list li, .service-card, .talks-list li'
    );

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        fadeEls.forEach(function (el) {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // =========================================================================
    // 3. Dark mode toggle — respects system preference, persists choice
    // =========================================================================
    var STORAGE_KEY = 'theme';
    var html = document.documentElement;

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            btn.querySelector('.icon-sun').style.display = theme === 'dark' ? 'block' : 'none';
            btn.querySelector('.icon-moon').style.display = theme === 'dark' ? 'none' : 'block';
        }
    }

    var stored = localStorage.getItem(STORAGE_KEY);
    applyTheme(stored || getSystemTheme());

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
    });

    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem(STORAGE_KEY, next);
            applyTheme(next);
        });
    }
})();
