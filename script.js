document.addEventListener('DOMContentLoaded', function(){

  // Mobile menu
  try {
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');

    function setMenu(open){
      links.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.textContent = open ? '✕' : '☰';
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    window.toggleMobileMenu = function(){
      setMenu(!links.classList.contains('open'));
    };

    document.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click', function(){ setMenu(false); });
    });

    document.addEventListener('click', function(e){
      if(window.innerWidth <= 900 &&
         links.classList.contains('open') &&
         !links.contains(e.target) &&
         !toggle.contains(e.target)){
        setMenu(false);
      }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function(){
      if(window.innerWidth > 900) setMenu(false);
    });

    setMenu(false);
  } catch(e){ console.error('menu init failed', e); }

  // Active nav link on scroll
  try {
    const sections = document.querySelectorAll('section[id]');
    const navAs = document.querySelectorAll('.nav-links a');
    const obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          navAs.forEach(function(a){ a.classList.remove('active'); });
          const match = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
          if(match) match.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function(s){ obs.observe(s); });
  } catch(e){ console.error('scrollspy init failed', e); }

  // Light / dark theme toggle
  try {
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    function getSavedTheme(){
      try{ return localStorage.getItem('theme'); } catch(e){ return null; }
    }
    function saveTheme(theme){
      try{ localStorage.setItem('theme', theme); } catch(e){}
    }
    function getPreferredTheme(){
      const saved = getSavedTheme();
      if(saved === 'light' || saved === 'dark') return saved;
      try{
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      } catch(e){ return 'dark'; }
    }
    function applyTheme(theme){
      root.setAttribute('data-theme', theme);
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      saveTheme(theme);
    }

    applyTheme(getPreferredTheme());

    window.toggleTheme = function(){
      const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(current);
    };
  } catch(e){ console.error('theme init failed', e); }

  // Contact form
  try {
    const contactForm = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendBtn');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async function(e){
      e.preventDefault();
      document.getElementById('localTime').value = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata'
      }) + ' IST';
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending...';
      formStatus.style.display = 'none';

      try{
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if(response.ok){
          formStatus.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
          formStatus.style.color = 'var(--green)';
          contactForm.reset();
        } else {
          formStatus.textContent = "Something went wrong. Please try again or email me directly.";
          formStatus.style.color = 'var(--danger)';
        }
      } catch(err){
        formStatus.textContent = "Something went wrong. Please try again or email me directly.";
        formStatus.style.color = 'var(--danger)';
      }

      formStatus.style.display = 'block';
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message →';
    });
  } catch(e){ console.error('contact form init failed', e); }

  // Resume viewer modal
  try {
    const overlay = document.getElementById('resumeOverlay');
    const closeBtn = document.getElementById('resumeCloseBtn');

    function openResume(){
      overlay.classList.add('open');
      document.body.classList.add('resume-open');
    }
    function closeResume(){
      overlay.classList.remove('open');
      document.body.classList.remove('resume-open');
    }

    window.openResume = openResume;

    closeBtn.addEventListener('click', closeResume);
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeResume();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && overlay.classList.contains('open')) closeResume();
    });
  } catch(e){ console.error('resume modal init failed', e); }

  // Certificate viewer modal (used by experience + achievements)
  try {
    const certOverlay = document.getElementById('certOverlay');
    const certImage = document.getElementById('certImage');
    const certTitle = document.getElementById('certModalTitle');
    const certDownloadBtn = document.getElementById('certDownloadBtn');
    const certCloseBtn = document.getElementById('certCloseBtn');

    function openCertificate(src, title){
      certImage.src = src;
      certImage.alt = title || 'Certificate';
      certTitle.textContent = title || 'Certificate';
      certDownloadBtn.href = src;
      certDownloadBtn.setAttribute('download', (title || 'certificate').replace(/[^a-z0-9]+/gi,'_') + '.jpg');
      certOverlay.classList.add('open');
      document.body.classList.add('cert-open');
    }
    function closeCertificate(){
      certOverlay.classList.remove('open');
      document.body.classList.remove('cert-open');
    }

    window.openCertificate = openCertificate;

    certCloseBtn.addEventListener('click', closeCertificate);
    certOverlay.addEventListener('click', function(e){
      if(e.target === certOverlay) closeCertificate();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && certOverlay.classList.contains('open')) closeCertificate();
    });
  } catch(e){ console.error('certificate modal init failed', e); }

  // Scroll progress + back-to-top
  try {
    const progress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    function updateScrollUI(){
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = percent + '%';
      backToTop.classList.toggle('show', window.scrollY > 500);
    }

    window.addEventListener('scroll', updateScrollUI, {passive:true});
    backToTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
    updateScrollUI();
  } catch(e){ console.error('scroll UI init failed', e); }

});
