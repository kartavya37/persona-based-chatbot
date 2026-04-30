// CONFIG
const API_URL_LOCAL = "http://localhost:3000";
const API_URL_PROD = "https://persona-chatbot-backend-03h6.onrender.com";

const isLocal =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1" ||
  location.hostname === "";
const API_URL = isLocal ? API_URL_LOCAL : API_URL_PROD;

// PERSONA DATA
const PERSONAS = {
  kshitij: {
    label: "Kshitij Mishra",
    role: "Head of Instructors · Dean, SST",
    avatar: "K",
    suggestions: [
      "Explain consistent hashing",
      "How does an LRU cache work?",
      "Walk me through hash maps",
      "How should I prepare for system design?",
    ],
  },
  anshuman: {
    label: "Anshuman Singh",
    role: "Co-founder & CEO, Scaler",
    avatar: "An",
    suggestions: [
      "How do I grow faster as an engineer?",
      "Real-world software vs competitive programming?",
      "Is clean code really worth the effort?",
      "What separates a senior engineer from a junior one?",
    ],
  },
  abhimanyu: {
    label: "Abhimanyu Saxena",
    role: "Co-founder, Scaler & InterviewBit",
    avatar: "Ab",
    suggestions: [
      "Should I focus on a degree or skills?",
      "How do I know when to pivot?",
      "I'm stuck between two career paths",
      "What did you learn from InterviewBit → Scaler?",
    ],
  },
};

// STATE
let activePerson = "kshitij";
let history = [];
let isSending = false;

// DOM
const $body = document.body;
const $messages = document.getElementById("messages");
const $emptyState = document.getElementById("empty-state");
const $emptyHint = document.getElementById("empty-hint");
const $suggestions = document.getElementById("suggestions");
const $form = document.getElementById("form");
const $query = document.getElementById("query");
const $send = document.getElementById("send");
const $clear = document.getElementById("clear");
const $activeLabel = document.getElementById("active-label");
const $activeRole = document.getElementById("active-role");
const $topAvatar = document.getElementById("top-avatar");
const $personaButtons = document.querySelectorAll(".persona");
const $sidebar = document.querySelector(".sidebar");
const $sidebarToggle = document.getElementById("sidebar-toggle");

// INIT
renderActivePerson();
renderSuggestions();
updateClearButton();

// PERSONA SWITCHING
$personaButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = btn.dataset.person;
    if (!next || next === activePerson) {
      closeSidebar();
      return;
    }
    setActivePerson(next);
    closeSidebar();
  });
});

function setActivePerson(key) {
  activePerson = key;
  history = [];
  $body.dataset.active = key;

  $personaButtons.forEach((b) => {
    b.setAttribute("aria-pressed", b.dataset.person === key ? "true" : "false");
  });

  renderActivePerson();
  $messages.innerHTML = "";
  $messages.appendChild($emptyState);
  renderSuggestions();
  updateClearButton();
  $query.focus();
}

function renderActivePerson() {
  const p = PERSONAS[activePerson];
  $activeLabel.textContent = p.label;
  $activeRole.textContent = p.role;
  $topAvatar.textContent = p.avatar;
  $emptyHint.textContent = `Or pick one to see how ${p.label.split(" ")[0]} thinks:`;
}

function renderSuggestions() {
  $suggestions.innerHTML = "";
  PERSONAS[activePerson].suggestions.forEach((text) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      $query.value = text;
      autoresize();
      submitMessage();
    });
    $suggestions.appendChild(btn);
  });
}

// SIDEBAR (mobile)
function openSidebar() {
  $sidebar.classList.add("open");
}
function closeSidebar() {
  $sidebar.classList.remove("open");
}
$sidebarToggle?.addEventListener("click", () => {
  if ($sidebar.classList.contains("open")) closeSidebar();
  else openSidebar();
});
// click outside to close
document.addEventListener("click", (e) => {
  if (!$sidebar.classList.contains("open")) return;
  if ($sidebar.contains(e.target) || $sidebarToggle.contains(e.target)) return;
  closeSidebar();
});

// MESSAGE RENDERING
function appendMessage(role, text, opts = {}) {
  if ($emptyState.parentElement === $messages) {
    $messages.removeChild($emptyState);
  }

  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;
  if (opts.error) wrap.classList.add("error");
  if (role === "bot") wrap.dataset.person = activePerson;

  const avatar = document.createElement("span");
  avatar.className = "msg-avatar";
  avatar.textContent =
    role === "user" ? "Y" : PERSONAS[activePerson].avatar;

  const body = document.createElement("div");
  body.className = "msg-body";

  const name = document.createElement("span");
  name.className = "msg-name";
  name.textContent =
    role === "user" ? "You" : PERSONAS[activePerson].label;

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  if (opts.html) {
    bubble.innerHTML = opts.html;
  } else {
    bubble.textContent = text;
  }

  body.appendChild(name);
  body.appendChild(bubble);

  wrap.appendChild(avatar);
  wrap.appendChild(body);
  $messages.appendChild(wrap);
  scrollToBottom();
  return wrap;
}

function showTypingIndicator() {
  const wrap = document.createElement("div");
  wrap.className = "msg bot typing-msg";
  wrap.dataset.person = activePerson;

  const avatar = document.createElement("span");
  avatar.className = "msg-avatar";
  avatar.textContent = PERSONAS[activePerson].avatar;

  const body = document.createElement("div");
  body.className = "msg-body";

  const name = document.createElement("span");
  name.className = "msg-name";
  name.textContent = PERSONAS[activePerson].label;

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;

  body.appendChild(name);
  body.appendChild(bubble);

  wrap.appendChild(avatar);
  wrap.appendChild(body);
  $messages.appendChild(wrap);
  scrollToBottom();
  return wrap;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    $messages.scrollTop = $messages.scrollHeight;
  });
}

function updateClearButton() {
  $clear.disabled = history.length === 0 && $messages.children.length <= 1;
}

// SEND
async function submitMessage() {
  if (isSending) return;
  const message = $query.value.trim();
  if (!message) return;

  isSending = true;
  $send.disabled = true;

  appendMessage("user", message);
  history.push({ role: "user", content: message });
  $query.value = "";
  autoresize();
  updateClearButton();

  const typingNode = showTypingIndicator();

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        person: activePerson,
        message,
        history: history.slice(0, -1),
      }),
    });

    const data = await res.json().catch(() => ({}));
    typingNode.remove();

    if (!res.ok) {
      throw new Error(data?.error || `Request failed (${res.status})`);
    }

    const reply = data.reply || "(empty response)";
    appendMessage("bot", reply);
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    typingNode.remove();
    appendMessage("bot", `Couldn't reach the mentor right now — ${err.message}`, {
      error: true,
    });
  } finally {
    isSending = false;
    $send.disabled = false;
    updateClearButton();
    $query.focus();
  }
}

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitMessage();
});

$query.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    submitMessage();
  }
});

// AUTORESIZE TEXTAREA
function autoresize() {
  $query.style.height = "auto";
  const next = Math.min($query.scrollHeight, 180);
  $query.style.height = next + "px";
}
$query.addEventListener("input", autoresize);

// CLEAR
$clear.addEventListener("click", () => {
  if (history.length === 0) return;
  history = [];
  $messages.innerHTML = "";
  $messages.appendChild($emptyState);
  renderSuggestions();
  updateClearButton();
  $query.focus();
});
