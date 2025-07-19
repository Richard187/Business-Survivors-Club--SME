// FAQ accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('open');
  });
});

// Simple registration form handler (old)
const regForm = document.querySelector('.register-form');
if (regForm) {
  regForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for registering! We will contact you soon.');
    regForm.reset();
  });
}

// Contact form handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for contacting us! We will respond soon.');
    contactForm.reset();
  });
}

// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    }
  });
});

// --- FrontlineSMS Web Registration & CSV Export ---
const webRegForm = document.getElementById('web-register-form');
const exportBtn = document.getElementById('export-csv-btn');
const isAdmin = window.location.search.includes('admin=1');
if (isAdmin && exportBtn) exportBtn.style.display = 'inline-block';

function getRegistrations() {
  return JSON.parse(localStorage.getItem('sme_registrations') || '[]');
}
function saveRegistration(data) {
  const regs = getRegistrations();
  regs.push({...data, date: new Date().toISOString()});
  localStorage.setItem('sme_registrations', JSON.stringify(regs));
}
function toCSV(rows) {
  if (!rows.length) return '';
  
  const escapeValue = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const header = Object.keys(rows[0]).join(',');
  const body = rows.map(r => 
    Object.values(r).map(v => escapeValue(v)).join(',')
  ).join('\n');

  return header + '\n' + body;
}
if (webRegForm) {
  webRegForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      tier: form.tier.value,
      name: form.name.value,
      phone: form.phone.value,
      province: form.province.value,
      language: form.language.value
    };
    saveRegistration(data);
    alert('Thank you for registering! We will contact you soon.');
    form.reset();
  });
}
if (exportBtn) {
  exportBtn.addEventListener('click', function() {
    const regs = getRegistrations();
    if (!regs.length) return alert('No registrations to export.');
    const csv = toCSV(regs);
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sme_registrations.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// --- Quick Phone Registration ---
const quickPhoneForm = document.getElementById('quick-phone-form');
if (quickPhoneForm) {
  quickPhoneForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const phone = quickPhoneForm.phone.value;
    if (!phone) return;
    saveRegistration({
      tier: '',
      name: '',
      phone: phone,
      province: '',
      language: ''
    });
    alert('Thank you! You are now registered and will receive updates via SMS.');
    quickPhoneForm.reset();
  });
}

// --- AI Chatbot Widget ---
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotLang = document.getElementById('chatbot-language');

let chatbotLanguage = localStorage.getItem('chatbot_lang') || 'English';
if (chatbotLang) chatbotLang.value = chatbotLanguage;

// Ensure chatbot window is closed by default
if (chatbotWindow && !chatbotWindow.classList.contains('chatbot-closed')) {
  chatbotWindow.classList.add('chatbot-closed');
}

function addChatMsg(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.className = 'chatbot-msg ' + sender;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  msg.appendChild(bubble);
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// === Section Reveal on Scroll ===
function revealSections() {
  const reveals = document.querySelectorAll('.section, .leader-card, .blog-post, .event-card, .member-card, .resource-list li');
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 60) {
      el.classList.add('reveal', 'visible');
    }
  });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('DOMContentLoaded', revealSections);

// === Animated Number Counters ===
function animateCounters() {
  document.querySelectorAll('.hero-stats strong').forEach(el => {
    const target = parseInt(el.textContent.replace(/\D/g, ''));
    if (!target || el.dataset.animated) return;
    el.dataset.animated = '1';
    let count = 0;
    const step = Math.ceil(target / 60);
    const update = () => {
      count += step;
      if (count >= target) {
        el.textContent = target;
      } else {
        el.textContent = count;
        requestAnimationFrame(update);
      }
    };
    update();
  });
}
window.addEventListener('DOMContentLoaded', animateCounters);

// === Chatbot Typing Indicator ===
let typingTimeout = null;
function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'chatbot-msg bot chatbot-typing';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = 'AI is typing...';
  typing.appendChild(bubble);
  chatbotMessages.appendChild(typing);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return typing;
}
function botReply(userMsg) {
  const lang = chatbotLanguage;
  let reply = '';
  let typingEl = showTyping();
  setTimeout(() => {
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
    if (/register|join|sign/i.test(userMsg)) {
      reply = {
        English: 'To register, use the Join form or text JOIN to our SMS number. What else can I help you with?',
        Bemba: 'Ukulefwaya ukwikala membala, landa JOIN ku SMS number yesu. Fyonse ifyo mwalefwaya?',
        Nyanja: 'Kulembetsa, tumizani JOIN pa nambala ya SMS. Ndingakuthandizeni chiyani?',
        Lozi: 'U kwata membala, tumela JOIN ku SMS number. Ndo ku thusa ka?',
        Tonga: 'Kulembela membala, tumizha JOIN ku SMS number. Ndingakubotu chiyani?',
        Kaonde: 'Kulembela membala, tuma JOIN ku SMS number. Ndeku sambila chiyani?',
        Luvale: 'Kulembela membala, tuma JOIN ku SMS number. Ndeku sambila chiyani?',
        Lunda: 'Kulembela membala, tuma JOIN ku SMS number. Ndeku sambila chiyani?'
      }[lang] || 'To register, use the Join form or text JOIN to our SMS number.';
    } else if (/event|bootcamp|expo|summit|meeting/i.test(userMsg)) {
      reply = {
        English: 'Upcoming events: Bootcamp, Expo, and Summit. Check the Events section or ask for details.',
        Bemba: 'Ifintu ifyakweba: Bootcamp, Expo, na Summit. Landa Events section.',
        Nyanja: 'Zochitika: Bootcamp, Expo, ndi Summit. Onani Events section.',
        Lozi: 'Zwa kutwala: Bootcamp, Expo, na Summit. Bona Events section.',
        Tonga: 'Zochitika: Bootcamp, Expo, na Summit. Onani Events section.',
        Kaonde: 'Zochitika: Bootcamp, Expo, na Summit. Onani Events section.',
        Luvale: 'Zochitika: Bootcamp, Expo, na Summit. Onani Events section.',
        Lunda: 'Zochitika: Bootcamp, Expo, na Summit. Onani Events section.'
      }[lang] || 'Upcoming events: Bootcamp, Expo, and Summit.';
    } else if (/mentor|coach|help/i.test(userMsg)) {
      reply = {
        English: 'Mentorship is available! Ask for a mentor or reply CALL to schedule a session by SMS.',
        Bemba: 'Mentorship ili! Landa mentor, kapena landa CALL ku SMS.',
        Nyanja: 'Mentorship ilipo! Funsani mentor kapena tumizani CALL pa SMS.',
        Lozi: 'Mentorship ili! Funsani mentor kana tumela CALL.',
        Tonga: 'Mentorship ilipo! Funsani mentor kana tumizha CALL.',
        Kaonde: 'Mentorship ilipo! Funsani mentor kana tumizha CALL.',
        Luvale: 'Mentorship ilipo! Funsani mentor kana tumizha CALL.',
        Lunda: 'Mentorship ilipo! Funsani mentor kana tumizha CALL.'
      }[lang] || 'Mentorship is available! Ask for a mentor or reply CALL to schedule.';
    } else if (/badge|reward|quiz/i.test(userMsg)) {
      reply = {
        English: 'Earn badges by attending events and participating in quizzes. We\'ll notify you by SMS when you unlock a badge!',
        Bemba: 'Fola badges ukuti wa attend events na quiz. Tukutumina SMS pa badge!',
        Nyanja: 'Pezani badges mukakhala pa events ndi quiz. Tikutumizani SMS pa badge!',
        Lozi: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!',
        Tonga: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!',
        Kaonde: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!',
        Luvale: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!',
        Lunda: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!'
      }[lang] || 'Earn badges by attending events and participating in quizzes.';
    } else {
      reply = {
        English: 'Hello! I am your SME Connect AI assistant. Ask me about registration, events, mentorship, or rewards.',
        Bemba: 'Shani! Ndi SME Connect AI assistant. Buzani pa registration, events, mentorship, na rewards.',
        Nyanja: 'Moni! Ndine SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.',
        Lozi: 'Lumela! SME Connect AI assistant. Buzani pa registration, events, mentorship, kana rewards.',
        Tonga: 'Muli bwanji! SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.',
        Kaonde: 'Muli bwanji! SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.',
        Luvale: 'Muli bwanji! SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.',
        Lunda: 'Muli bwanji! SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.'
      }[lang] || 'Hello! I am your SME Connect AI assistant. Ask me about registration, events, mentorship, or rewards.';
    }
    addChatMsg(reply, 'bot');
  }, 700);
}

if (chatbotToggle && chatbotWindow) {
  chatbotToggle.onclick = () => {
    console.log('Chatbot toggle clicked');
    chatbotWindow.classList.toggle('chatbot-closed');
  };
}
if (chatbotClose && chatbotWindow) {
  chatbotClose.onclick = () => chatbotWindow.classList.add('chatbot-closed');
}
if (chatbotForm && chatbotInput) {
  chatbotForm.onsubmit = e => {
    e.preventDefault();
    const msg = chatbotInput.value.trim();
    if (!msg) return;
    addChatMsg(msg, 'user');
    chatbotInput.value = '';
    botReply(msg);
  };
}
if (chatbotLang) {
  chatbotLang.onchange = e => {
    chatbotLanguage = chatbotLang.value;
    localStorage.setItem('chatbot_lang', chatbotLanguage);
    addChatMsg('Language set to ' + chatbotLanguage + '.', 'bot');
  };
}
// Greet on open
if (chatbotMessages) {
  setTimeout(() => {
    addChatMsg('Hello! I am your SME Connect AI assistant. Ask me about registration, events, mentorship, or rewards.', 'bot');
  }, 300);
}

// Ensure % sign after hero-stats numbers if missing
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.hero-stats strong').forEach(el => {
    if (!el.nextElementSibling || !el.nextElementSibling.classList.contains('stat-suffix')) {
      const span = document.createElement('span');
      span.className = 'stat-suffix';
      span.textContent = '%';
      el.parentNode.insertBefore(span, el.nextSibling);
    }
  });
});

