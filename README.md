FrontlineSMS Campaign System Design: Business Survivors Club – SME Connect (Zambia)
Objectives
•	Inclusive outreach: Use SMS to connect with SMEs across all 10 provinces in Zambia, delivering information in each province’s primary language. FrontlineSMS can “deliver announcements, conduct polls and automate replies” to enable this two-way communication.
•	Membership management: Allow SMEs to register via SMS and self-select or be assigned a tier (Basic, Silver, Gold, Institutional). Store each contact’s name and tier in the system database for personalized messaging.
•	Timely updates: Broadcast announcements about bootcamps, meetups, expos, competition deadlines, and funding opportunities to the relevant members. Filter by region/language so each SME receives only pertinent alerts.
•	Mentorship follow-ups: Automate periodic check-ins and scheduling prompts for mentorship. For example, the system can text a mentee (“How is your project progressing?”) and let them reply to set up their next session.
•	Data collection & evaluation: Use built-in polling/survey tools to collect feedback and measure impact. Schedule SMS surveys or quizzes and automatically record responses for analysis. (FrontlineSMS makes it easy to run SMS quizzes and automatically group correct answers to reward participants.)
•	Engagement gamification: Incentivize participation with badges and rewards. For instance, when a member completes a milestone (like attending a workshop), send a congratulatory message (“You’ve earned the Business Innovator badge!”) and prompt them to earn more in upcoming events. SFCG found that SMS quizzes with prizes strongly motivate engagement, which can be emulated with badge notifications.
•	Integration with backend: Link SMS data to a central CRM or database for tracking. FrontlineSMS can export contact and message data to CSV or integrate directly with CRM systems. (For example, FrontlineCloud allows exporting contacts or sending data to systems like Salesforce.) A robust CRM backend will efficiently handle SME profiles and interaction history.
Features
•	SMS Registration & Tiering: Users register by texting a keyword (SME JOIN). An automated workflow asks for their business name and tier preference. FrontlineSMS stores each new member’s contact with custom fields (name, province, tier). This lets us personalize messages by name and track membership level.
•	Scheduled Broadcasts: Send targeted announcements (bootcamps, expos, deadlines) by province and language. For example, schedule a broadcast to all Lusaka SMEs in Nyanja with event details. FrontlineSMS supports bulk messaging to filtered contact groups. As one case study noted, sending a reminder SMS the day before an event dramatically increased responses (from 37 to 168 feedback texts).
•	Two-Way Mentorship: Implement auto-responses to manage mentor check-ins. For instance, after a mentoring session, the system might wait 14 days and then text the SME (“Hello [Name], how is your project progress? Reply CALL to set up a follow-up meeting.”). The SME’s reply triggers a reminder to the mentor or auto-schedules the call. All replies are captured in the contact’s log for follow-up.
•	Polls & Surveys: Use FrontlineSMS’s polls/activities to ask single or multi-question surveys. For example, send “Quick poll: Did last month’s expo help your business? Reply 1=Yes, 2=No.” The software automatically records and categorizes each response. By automating these surveys, SMEs can easily give feedback and the team collects structured data without manual entry.
•	Segmentation & Personalization: Store custom fields (province, language, industry). Before sending, filter contacts by these fields. Messages can auto-include personal data (the SME’s name). FrontlineSMS’s contact database supports names, so bulk SMS can greet each recipient by name. Segmentation ensures, for example, that a Bemba-language message is only sent to contacts in Northern or Copperbelt provinces.
•	Gamified Engagement: Track member actions (attending events, completing surveys) and trigger SMS “reward” messages. For example, if an SME submits a grant proposal through the program, the system sends: “Congratulations [Name]! You’ve unlocked the Innovator badge for applying to a grant. Join our next webinar to earn more.” Such badges and reward reminders keep SMEs engaged. SFCG’s experience shows that quizzes with prizes greatly boost participation; similarly, badges can be sent via SMS as light incentives.
•	CRM/Database Integration: Sync all contact and SMS data to a central backend. The most scalable approach is a proper CRM (Salesforce, HubSpot, Zoho). FrontlineSMS can export contacts as CSV or integrate via API/FrontlineCloud. For example, Frontline offers “seamless Salesforce integration” so that messages and contact updates flow into your CRM. This ensures every SME’s tier, event attendance, and SMS interactions are logged in their profile for reporting.
Campaign Flows
Sample flow diagrams (conceptual): SMEs interact with the SMS system through keyword menus, and automated workflows handle their responses. For example, a new SME texts “sme JOIN” and receives an automated welcome. If they reply with their desired tier, the system assigns it and confirms (“You are now a Silver member of SME Connect”). Later, broadcasts or polls are sent to them based on their region and interests. The image above illustrates a planning meeting where coordinators map out these SMS flows.
Key flows might include:
•	Registration & Onboarding: SME texts JOIN (or misses a call that triggers subscription). The system replies: “Welcome to SME Connect! Reply 1 for Basic, 2 for Silver, 3 for Gold membership.” After they respond (e.g. “2”), the system asks for their business name and region. It then confirms: “Hello [Name], you are now a Silver member of BSC SME Connect. We will notify you of upcoming opportunities. Reply HELP for options or STOP to unsubscribe.” The contact is added to the database with all details.
•	Tier Assignment: If an SME wants to upgrade or change tier, they can text a code (e.g. “UPGRADE 3” to move to Gold). The system detects keywords and updates their tier field in the contact list, sending a confirmation message. All tier changes are logged.
•	Event Broadcast: Coordinators compose an event message (e.g. “Agri Bootcamp this Friday at 9AM in Ndola”). They choose target filters (Northern Province, Bemba language). FrontlineSMS queues the SMS and sends it at the scheduled time. Recipients receive it in their language. (In a past campaign, sending a timely reminder via SMS significantly increased audience response.)
•	Mentor Check-In: The system can trigger follow-up texts after set intervals. For instance, 7 days after registration or after each workshop, send: “Hi [Name], how is your [specific task] going? Reply CALL to set up a mentor phone call.” If the SME replies “CALL”, FrontlineSMS flags it or sends an appointment prompt to the mentor. All replies are automatically recorded under the SME’s profile.
•	Polls & Surveys: Using Frontline’s poll activity, send questions like “Did last month’s webinar help your business? Reply 1=Yes, 2=No.” Each incoming response is automatically tallied. After the poll closes, export or review results in FrontlineSMS (or FrontlineCloud). This real-time feedback loop lets the program adapt quickly. (In similar SMS programs, responses were automatically recorded and grouped by answer, motivating participants and informing organizers.)
•	Gamified Reminders: Send achievement messages when members reach milestones. For example, if an SME submits a business plan via SMS or attends a workshop, automatically text: “Great job, [Name]! You’ve earned the Starter badge for participating. Attend our next webinar to unlock more rewards.” These friendly reminders are sent as part of scheduled campaign activities.
Language Management
•	Multi-Language Templates: Create separate SMS templates for Zambia’s seven key languages (Bemba, Nyanja, Lozi, Tonga, Kaonde, Luvale, Lunda). For each message (announcements, replies, keywords), maintain a version in each language. Local experts should translate and verify content. The system either sends the language based on the SME’s stored preference or province. For example, a Bemba speaker in Copperbelt receives the Bemba template.
•	Contact Language Tag: When registering, ask SME for their preferred language or infer it from their province. Store this as a field. Before sending any broadcast or poll, filter contacts by language and use the corresponding message text.
•	Local Cultural Context: Ensure messages respect local phrasing and length limits. Test messages with native speakers to avoid confusion. Keep content concrete and simple. As one FrontlineSMS user noted, asking very clear questions and greeting people in their own language (“wish a good weekend in Bemba”, etc.) improves understanding.
•	Compliance (STOP/HELP): Provide instructions in every language. For example, include a line like “Reply ‘STOP’ (in your language) to unsubscribe.” Twilio’s guidelines stress that SMS campaigns “should support HELP/STOP messages… in the end-user’s local language.”. We will prepare appropriate STOP/HELP keywords and auto-reply explanations in each language so SMEs can easily opt out or get help.
Data Integration
•	Central CRM: We recommend using a scalable CRM for SME tracking. All contacts and SMS interactions can be synced to, for example, Salesforce or HubSpot. FrontlineCloud supports direct Salesforce integration, letting you send collected data (contacts, messages, tags) into the CRM automatically. This ensures each SME’s profile shows their tier, language, event sign-ups, and survey responses in one place.
•	Spreadsheet Backup: For simplicity or initial piloting, a spreadsheet (Google Sheets or Excel) can serve as a basic CRM. Export FrontlineSMS contacts and messages as CSV and import into the sheet daily. (FrontlineSMS can export data via CSV.) However, as the member list grows, a true CRM is more efficient.
•	Unique IDs: Assign a unique ID to each SME (e.g. the phone number or a generated code) to merge SMS data with external records. Use this ID across all systems.
•	Analytics & Reporting: Store poll/survey results and event attendance in the backend. This allows filtering by province, tier or date. For impact evaluation, export data to analysis tools. The contact database itself (with custom fields) can be queried to produce reports on engagement by region or language.
Sample Messages
•	Welcome/Registration:
English: “Hello {Name}, welcome to BSC SME Connect! Reply 1 for Basic, 2 for Silver, 3 for Gold membership. Reply STOP to unsubscribe.”
•	Bootcamp Announcement:
English: “Hi {Name}, reminder: Women in Agri bootcamp on June 15 in Lusaka. Reply YES to RSVP or STOP to opt out. See you there!”
•	Mentorship Check-in:
English: “Hello {Name}, it’s been a month since your last meeting. Reply CALL to schedule a follow-up call with your mentor, or STOP to stop messages.”
•	Survey/Poll:
English: “Quick poll: Did last month’s expo help your business? Reply with 1=Yes or 2=No. Thank you for your feedback!”
•	Gamified Badge Notice:
English: “Congrats {Name}! You’ve unlocked the Innovator Badge for submitting your business plan. 🎉 Attend our next webinar on grants to earn more badges.”
Each of the above messages would be translated into the recipient’s language (Bemba, Nyanja, etc.) when sent to non-English speakers. The {Name} placeholder is automatically filled from the database for personalization.
Implementation Notes
•	Platform Setup: Install FrontlineSMS (desktop version) on a dedicated Windows/Mac/Linux computer with a GSM modem or use FrontlineCloud with a virtual SIM/Twilio number. If using a modem, keep the computer powered on until all messages are sent. Ensure reliable power and internet (for FrontlineCloud) or cellular signal.
•	Opt-In and Compliance: Collect explicit opt-in from SMEs before sending messages. Include clear instructions for opting out. Per best practices, include a STOP command in local languages. Do not send SMS outside allowed hours. Maintain a do-not-contact list for anyone who replies “STOP” – FrontlineSMS can auto-apply the STOP response to remove the contact from broadcasts.
•	Message Scheduling: Stagger broadcasts to avoid overload. For large campaigns, send in batches. Monitor delivery status in FrontlineSMS to catch any failures (e.g., network issues). If response volume is high, assign a moderator to triage replies and follow up.
•	Data Handling: Backup the FrontlineSMS workspace daily. Export contacts and message logs to the CRM or spreadsheet each night so all data is preserved. Use the CRM to track SME interactions and follow-up tasks.
•	Telecom Partnership: Engage local mobile operators to negotiate bulk SMS rates and possibly obtain a free incoming number. (An SFCG case study recommends partnering with telecoms to reduce costs and secure a free short code, making it easier for SMEs to participate.)
•	Monitoring & Iteration: Continuously monitor response rates and survey results. If engagement is low in a province, consider adjusting language or sending additional reminders. Like other programs that used FrontlineSMS, we will adapt messages based on feedback (for example, tailoring content when one character in a radio drama unexpectedly became popular – similarly, we will refine our messaging based on SME responses).
•	Staffing: Dedicate a small team to manage the SMS system. One person can oversee message scheduling and data exports, and another can handle incoming replies (filtering out queries, updating CRM, rescheduling calls). Regular training on the software will ensure smooth operations.
•	// FAQ accordion
•	const faqQuestions = document.querySelectorAll('.faq-question');
•	faqQuestions.forEach(btn => {
•	  btn.addEventListener('click', () => {
•	    const item = btn.parentElement;
•	    item.classList.toggle('open');
•	  });
•	});
•	
•	// Simple registration form handler (old)
•	const regForm = document.querySelector('.register-form');
•	if (regForm) {
•	  regForm.addEventListener('submit', function(e) {
•	    e.preventDefault();
•	    alert('Thank you for registering! We will contact you soon.');
•	    regForm.reset();
•	  });
•	}
•	
•	// Contact form handler
•	const contactForm = document.querySelector('.contact-form');
•	if (contactForm) {
•	  contactForm.addEventListener('submit', function(e) {
•	    e.preventDefault();
•	    alert('Thank you for contacting us! We will respond soon.');
•	    contactForm.reset();
•	  });
•	}
•	
•	// Smooth scroll for nav links
•	const navLinks = document.querySelectorAll('.nav-links a');
•	navLinks.forEach(link => {
•	  link.addEventListener('click', function(e) {
•	    const href = link.getAttribute('href');
•	    if (href && href.startsWith('#')) {
•	      e.preventDefault();
•	      const target = document.querySelector(href);
•	      if (target) {
•	        window.scrollTo({
•	          top: target.offsetTop - 60,
•	          behavior: 'smooth'
•	        });
•	      }
•	    }
•	  });
•	});
•	
•	// --- FrontlineSMS Web Registration & CSV Export ---
•	const webRegForm = document.getElementById('web-register-form');
•	const exportBtn = document.getElementById('export-csv-btn');
•	const isAdmin = window.location.search.includes('admin=1');
•	if (isAdmin && exportBtn) exportBtn.style.display = 'inline-block';
•	
•	function getRegistrations() {
•	  return JSON.parse(localStorage.getItem('sme_registrations') || '[]');
•	}
•	function saveRegistration(data) {
•	  const regs = getRegistrations();
•	  regs.push({...data, date: new Date().toISOString()});
•	  localStorage.setItem('sme_registrations', JSON.stringify(regs));
•	}
•	function toCSV(rows) {
•	  const header = Object.keys(rows[0] || {}).join(',');
•	  const body = rows.map(r => Object.values(r).map(v => '"'+(v||'')+'"').join(',')).join('\n');
•	  return header + '\n' + body;
•	}
•	if (webRegForm) {
•	  webRegForm.addEventListener('submit', function(e) {
•	    e.preventDefault();
•	    const form = e.target;
•	    const data = {
•	      tier: form.tier.value,
•	      name: form.name.value,
•	      phone: form.phone.value,
•	      province: form.province.value,
•	      language: form.language.value
•	    };
•	    saveRegistration(data);
•	    alert('Thank you for registering! We will contact you soon.');
•	    form.reset();
•	  });
•	}
•	if (exportBtn) {
•	  exportBtn.addEventListener('click', function() {
•	    const regs = getRegistrations();
•	    if (!regs.length) return alert('No registrations to export.');
•	    const csv = toCSV(regs);
•	    const blob = new Blob([csv], {type: 'text/csv'});
•	    const url = URL.createObjectURL(blob);
•	    const a = document.createElement('a');
•	    a.href = url;
•	    a.download = 'sme_registrations.csv';
•	    document.body.appendChild(a);
•	    a.click();
•	    document.body.removeChild(a);
•	    URL.revokeObjectURL(url);
•	  });
•	}
•	
•	// --- Quick Phone Registration ---
•	const quickPhoneForm = document.getElementById('quick-phone-form');
•	if (quickPhoneForm) {
•	  quickPhoneForm.addEventListener('submit', function(e) {
•	    e.preventDefault();
•	    const phone = quickPhoneForm.phone.value;
•	    if (!phone) return;
•	    saveRegistration({
•	      tier: '',
•	      name: '',
•	      phone: phone,
•	      province: '',
•	      language: ''
•	    });
•	    alert('Thank you! You are now registered and will receive updates via SMS.');
•	    quickPhoneForm.reset();
•	  });
•	}
•	
•	// --- AI Chatbot Widget ---
•	const chatbotToggle = document.getElementById('chatbot-toggle');
•	const chatbotWindow = document.getElementById('chatbot-window');
•	const chatbotClose = document.getElementById('chatbot-close');
•	const chatbotForm = document.getElementById('chatbot-form');
•	const chatbotInput = document.getElementById('chatbot-input');
•	const chatbotMessages = document.getElementById('chatbot-messages');
•	const chatbotLang = document.getElementById('chatbot-language');
•	
•	let chatbotLanguage = localStorage.getItem('chatbot_lang') || 'English';
•	if (chatbotLang) chatbotLang.value = chatbotLanguage;
•	
•	// Ensure chatbot window is closed by default
•	if (chatbotWindow && !chatbotWindow.classList.contains('chatbot-closed')) {
•	  chatbotWindow.classList.add('chatbot-closed');
•	}
•	
•	function addChatMsg(text, sender = 'bot') {
•	  const msg = document.createElement('div');
•	  msg.className = 'chatbot-msg ' + sender;
•	  const bubble = document.createElement('div');
•	  bubble.className = 'bubble';
•	  bubble.textContent = text;
•	  msg.appendChild(bubble);
•	  chatbotMessages.appendChild(msg);
•	  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
•	}
•	function botReply(userMsg) {
•	  // Simulate AI: respond in selected language (demo only)
•	  const lang = chatbotLanguage;
•	  let reply = '';
•	  if (/register|join|sign/i.test(userMsg)) {
•	    reply = {
•	      English: 'To register, use the Join form or text JOIN to our SMS number. What else can I help you with?',
•	      Bemba: 'Ukulefwaya ukwikala membala, landa JOIN ku SMS number yesu. Fyonse ifyo mwalefwaya?',
•	      Nyanja: 'Kulembetsa, tumizani JOIN pa nambala ya SMS. Ndingakuthandizeni chiyani?',
•	      Lozi: 'U kwata membala, tumela JOIN ku SMS number. Ndo ku thusa ka?',
•	      Tonga: 'Kulembela membala, tumizha JOIN ku SMS number. Ndingakubotu chiyani?',
•	      Kaonde: 'Kulembela membala, tuma JOIN ku SMS number. Ndeku sambila chiyani?',
•	      Luvale: 'Kulembela membala, tuma JOIN ku SMS number. Ndeku sambila chiyani?',
•	      Lunda: 'Kulembela membala, tuma JOIN ku SMS number. Ndeku sambila chiyani?'
•	    }[lang] || 'To register, use the Join form or text JOIN to our SMS number.';
•	  } else if (/event|bootcamp|expo|summit|meeting/i.test(userMsg)) {
•	    reply = {
•	      English: 'Upcoming events: Bootcamp, Expo, and Summit. Check the Events section or ask for details.',
•	      Bemba: 'Ifintu ifyakweba: Bootcamp, Expo, na Summit. Landa Events section.',
•	      Nyanja: 'Zochitika: Bootcamp, Expo, ndi Summit. Onani Events section.',
•	      Lozi: 'Zwa kutwala: Bootcamp, Expo, na Summit. Bona Events section.',
•	      Tonga: 'Zochitika: Bootcamp, Expo, na Summit. Onani Events section.',
•	      Kaonde: 'Zochitika: Bootcamp, Expo, na Summit. Onani Events section.',
•	      Luvale: 'Zochitika: Bootcamp, Expo, na Summit. Onani Events section.',
•	      Lunda: 'Zochitika: Bootcamp, Expo, na Summit. Onani Events section.'
•	    }[lang] || 'Upcoming events: Bootcamp, Expo, and Summit.';
•	  } else if (/mentor|coach|help/i.test(userMsg)) {
•	    reply = {
•	      English: 'Mentorship is available! Ask for a mentor or reply CALL to schedule a session by SMS.',
•	      Bemba: 'Mentorship ili! Landa mentor, kapena landa CALL ku SMS.',
•	      Nyanja: 'Mentorship ilipo! Funsani mentor kapena tumizani CALL pa SMS.',
•	      Lozi: 'Mentorship ili! Funsani mentor kana tumela CALL.',
•	      Tonga: 'Mentorship ilipo! Funsani mentor kana tumizha CALL.',
•	      Kaonde: 'Mentorship ilipo! Funsani mentor kana tumizha CALL.',
•	      Luvale: 'Mentorship ilipo! Funsani mentor kana tumizha CALL.',
•	      Lunda: 'Mentorship ilipo! Funsani mentor kana tumizha CALL.'
•	    }[lang] || 'Mentorship is available! Ask for a mentor or reply CALL to schedule.';
•	  } else if (/badge|reward|quiz/i.test(userMsg)) {
•	    reply = {
•	      English: 'Earn badges by attending events and participating in quizzes. We'll notify you by SMS when you unlock a badge!',
•	      Bemba: 'Fola badges ukuti wa attend events na quiz. Tukutumina SMS pa badge!',
•	      Nyanja: 'Pezani badges mukakhala pa events ndi quiz. Tikutumizani SMS pa badge!',
•	      Lozi: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!',
•	      Tonga: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!',
•	      Kaonde: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!',
•	      Luvale: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!',
•	      Lunda: 'Fumana badges ka u attend events na quiz. Tuta SMS pa badge!'
•	    }[lang] || 'Earn badges by attending events and participating in quizzes.';
•	  } else {
•	    reply = {
•	      English: 'Hello! I am your SME Connect AI assistant. Ask me about registration, events, mentorship, or rewards.',
•	      Bemba: 'Shani! Ndi SME Connect AI assistant. Buzani pa registration, events, mentorship, na rewards.',
•	      Nyanja: 'Moni! Ndine SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.',
•	      Lozi: 'Lumela! SME Connect AI assistant. Buzani pa registration, events, mentorship, kana rewards.',
•	      Tonga: 'Muli bwanji! SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.',
•	      Kaonde: 'Muli bwanji! SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.',
•	      Luvale: 'Muli bwanji! SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.',
•	      Lunda: 'Muli bwanji! SME Connect AI assistant. Funsani pa registration, events, mentorship, kapena rewards.'
•	    }[lang] || 'Hello! I am your SME Connect AI assistant. Ask me about registration, events, mentorship, or rewards.';
•	  }
•	  setTimeout(() => addChatMsg(reply, 'bot'), 600);
•	}
•	if (chatbotToggle && chatbotWindow) {
•	  chatbotToggle.onclick = () => {
•	    console.log('Chatbot toggle clicked');
•	    chatbotWindow.classList.toggle('chatbot-closed');
•	  };
•	}
•	if (chatbotClose && chatbotWindow) {
•	  chatbotClose.onclick = () => chatbotWindow.classList.add('chatbot-closed');
•	}
•	if (chatbotForm && chatbotInput) {
•	  chatbotForm.onsubmit = e => {
•	    e.preventDefault();
•	    const msg = chatbotInput.value.trim();
•	    if (!msg) return;
•	    addChatMsg(msg, 'user');
•	    chatbotInput.value = '';
•	    botReply(msg);
•	  };
•	}
•	if (chatbotLang) {
•	  chatbotLang.onchange = e => {
•	    chatbotLanguage = chatbotLang.value;
•	    localStorage.setItem('chatbot_lang', chatbotLanguage);
•	    addChatMsg('Language set to ' + chatbotLanguage + '.', 'bot');
•	  };
•	}
•	// Greet on open
•	if (chatbotMessages) {
•	  addChatMsg('Hello! I am your SME Connect AI assistant. Ask me about registration, events, mentorship, or rewards.', 'bot');
•	} 

