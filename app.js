const ICONS = {
  website: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4"/><path d="M3 10h14M10 3a11 11 0 0 1 0 14m0-14a11 11 0 0 0 0 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  text: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 5h12M4 9h12m-12 4h8m-8 4h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  wifi: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.5 7a11.2 11.2 0 0 1 15 0m-12.4 3a7.4 7.4 0 0 1 9.8 0m-7.1 3a3.5 3.5 0 0 1 4.4 0M10 16.2h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  email: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4" width="15" height="12" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="m3.5 6 6.5 4.7L16.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 3 2.1-.5L10 6l-1.5 1.4a12 12 0 0 0 4.1 4.1L14 10l3.5 1.9L17 14c-.4 1.6-1.8 2.4-3.4 1.9A15.5 15.5 0 0 1 4.1 6.4C3.6 4.8 4.4 3.4 6 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  contact: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="8" r="2.2" stroke="currentColor" stroke-width="1.4"/><path d="M6.5 14.5a3.5 3.5 0 0 1 7 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  payment: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4" width="15" height="12" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14m-10 4h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
};

const TYPES = {
  website: {
    label: "Website",
    description: "Website",
    fields: [
      { key: "url", label: "Website address", type: "url", placeholder: "https://your-website.com", required: true, hint: "Add https:// so every phone knows where to go." }
    ]
  },
  text: {
    label: "Plain text",
    description: "Plain text",
    fields: [
      { key: "message", label: "Your message", type: "textarea", placeholder: "A note, invitation, instructions, or anything else.", required: true, rows: 4, maxlength: 2000 }
    ]
  },
  wifi: {
    label: "Wi-Fi",
    description: "Wi-Fi",
    fields: [
      { key: "ssid", label: "Network name", type: "text", placeholder: "Your Wi-Fi network name", required: true, autocomplete: "off" },
      { key: "security", label: "Security", type: "select", options: [{ value: "WPA", label: "WPA / WPA2 / WPA3" }, { value: "WEP", label: "WEP" }, { value: "nopass", label: "No password" }] },
      { key: "password", label: "Wi-Fi password", type: "text", placeholder: "Enter your network password", required: true, autocomplete: "off", conditional: { key: "security", value: "nopass" }, hint: "Only encoded into the QR; never sent anywhere else." },
      { key: "hidden", label: "This network is hidden", type: "checkbox" }
    ]
  },
  email: {
    label: "Email",
    description: "Email",
    fields: [
      { key: "email", label: "Email address", type: "email", placeholder: "hello@example.com", required: true },
      { key: "subject", label: "Subject", type: "text", placeholder: "A little hello (optional)" },
      { key: "body", label: "Message", type: "textarea", placeholder: "Add a draft for the email (optional).", rows: 3 }
    ]
  },
  phone: {
    label: "Phone",
    description: "Phone",
    fields: [
      { key: "phone", label: "Phone number", type: "tel", placeholder: "+1 555 010 2026", required: true, hint: "Include a country code for international visitors." }
    ]
  },
  contact: {
    label: "Contact card",
    description: "Contact card",
    fields: [
      { key: "fullName", label: "Full name", type: "text", placeholder: "Alex Morgan", required: true, autocomplete: "name" },
      { key: "organization", label: "Organization", type: "text", placeholder: "Studio name (optional)", autocomplete: "organization" },
      { key: "phone", label: "Phone number", type: "tel", placeholder: "+1 555 010 2026", autocomplete: "tel" },
      { key: "email", label: "Email address", type: "email", placeholder: "hello@example.com", autocomplete: "email" },
      { key: "website", label: "Website", type: "url", placeholder: "https://your-website.com" }
    ]
  },
  payment: {
    label: "Payment & more",
    description: "Payment & more",
    fields: [
      { key: "details", label: "Payment link or details", type: "textarea", placeholder: "Paste a checkout URL, UPI link, wallet address, invoice reference, bank transfer instructions, or any text.", required: true, rows: 4, maxlength: 2000, tall: true, hint: "Compatible with payment links, UPI, crypto, invoices, and plain instructions." }
    ]
  }
};

const STORAGE_KEY = "glyph-qr-saved-v1";
const DEFAULT_EXAMPLES = {
  website: { fields: { url: "https://example.com" }, name: "My little corner of the internet" },
  wifi: { fields: { ssid: "The Good Wi-Fi", security: "WPA", password: "A-cozy-example-password", hidden: false }, name: "Guest Wi-Fi" },
  payment: { fields: { details: "upi://pay?pa=merchant%40example.com&pn=Demo%20Shop&cu=INR" }, name: "Demo payment link" }
};

const elements = {
  navigation: document.getElementById("typeNavigation"),
  libraryToggle: document.getElementById("libraryToggle"),
  savedCount: document.getElementById("savedCount"),
  savedList: document.getElementById("savedList"),
  form: document.getElementById("generatorForm"),
  fields: document.getElementById("fields"),
  message: document.getElementById("formMessage"),
  codeName: document.getElementById("codeName"),
  typePill: document.getElementById("typePill"),
  qrImage: document.getElementById("qrImage"),
  qrLoading: document.getElementById("qrLoading"),
  qrTitle: document.getElementById("qrTitle"),
  qrSummary: document.getElementById("qrSummary"),
  downloadButton: document.getElementById("downloadButton"),
  saveButton: document.getElementById("saveButton"),
  saveButtonLabel: document.getElementById("saveButtonLabel"),
  moreButton: document.getElementById("moreButton"),
  moreMenu: document.getElementById("moreMenu"),
  deleteButton: document.getElementById("deleteButton"),
  copyButton: document.getElementById("copyButton")
};

let currentType = "website";
let currentFields = {};
let savedCodes = loadSavedCodes();
let selectedSavedId = null;
let qrUrl = "";
let qrData = "";
let refreshTimer = null;
let refreshSequence = 0;

function loadSavedCodes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const value = JSON.parse(raw);
    if (!Array.isArray(value) || !value.every((code) =>
      code && typeof code.id === "string" && typeof code.name === "string" &&
      typeof code.kind === "string" && TYPES[code.kind] &&
      code.fields && typeof code.fields === "object"
    )) {
      throw new Error("Saved QR codes have an unexpected format.");
    }
    return value;
  } catch (error) {
    showMessage(`Your saved library could not be read: ${error.message}`, "error");
    return [];
  }
}

function storeSavedCodes(nextCodes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCodes));
    savedCodes = nextCodes;
    renderSavedCodes();
    return true;
  } catch (error) {
    showMessage(`Your browser could not save this code: ${error.message}`, "error");
    return false;
  }
}

function renderNavigation() {
  for (const [kind, type] of Object.entries(TYPES)) {
    const button = document.createElement("button");
    button.className = "nav-type";
    button.type = "button";
    button.dataset.kind = kind;
    button.setAttribute("aria-current", String(kind === currentType));
    button.innerHTML = `<span class="nav-icon">${ICONS[kind]}</span><span>${type.label}</span>`;
    button.addEventListener("click", () => switchType(kind));
    elements.navigation.append(button);
  }
}

function renderSavedCodes() {
  const visibleCodes = [...savedCodes]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  elements.savedCount.textContent = String(savedCodes.length);
  elements.savedList.replaceChildren();

  if (savedCodes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "saved-empty";
    empty.textContent = "Saved codes will find a happy home here. Make a code, then save it to start your library.";
    elements.savedList.append(empty);
    return;
  }
  for (const code of visibleCodes) {
    const item = document.createElement("button");
    item.className = `saved-item${selectedSavedId === code.id ? " is-active" : ""}`;
    item.type = "button";
    item.setAttribute("aria-label", `Open saved ${TYPES[code.kind].label.toLocaleLowerCase()} code: ${code.name}`);
    item.setAttribute("aria-current", String(selectedSavedId === code.id));
    item.innerHTML = `<span class="saved-thumbnail">${ICONS[code.kind]}</span><span class="saved-item-copy"><strong></strong><span></span></span>`;
    item.querySelector(".saved-item-copy strong").textContent = code.name;
    item.querySelector(".saved-item-copy span").textContent = TYPES[code.kind].label;
    item.addEventListener("click", () => openSavedCode(code.id));
    elements.savedList.append(item);
  }
}

function renderFields() {
  const definitions = TYPES[currentType].fields;
  const fields = document.createDocumentFragment();

  for (const definition of definitions) {
    if (definition.conditional &&
        currentFields[definition.conditional.key] === definition.conditional.value) continue;
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    if (definition.type === "checkbox") {
      wrapper.classList.add("checkbox-field");
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = definition.key;
      input.checked = Boolean(currentFields[definition.key]);
      const text = document.createElement("span");
      text.textContent = definition.label;
      label.append(input, text);
      wrapper.append(label);
      input.addEventListener("change", handleFieldChange);
    } else {
      const label = document.createElement("label");
      label.htmlFor = `field-${definition.key}`;
      label.textContent = definition.label;
      wrapper.append(label);

      let input;
      if (definition.type === "textarea") {
        input = document.createElement("textarea");
        input.rows = definition.rows || 3;
        if (definition.tall) input.classList.add("tall-textarea");
      } else if (definition.type === "select") {
        input = document.createElement("select");
        for (const option of definition.options) {
          const item = document.createElement("option");
          item.value = option.value;
          item.textContent = option.label;
          input.append(item);
        }
      } else {
        input = document.createElement("input");
        input.type = definition.type;
      }

      input.id = `field-${definition.key}`;
      input.name = definition.key;
      input.autocomplete = definition.autocomplete || "off";
      input.value = currentFields[definition.key] ?? definition.options?.[0]?.value ?? "";
      input.required = Boolean(definition.required);
      if (definition.maxlength) input.maxLength = definition.maxlength;
      if (definition.placeholder) input.placeholder = definition.placeholder;
      wrapper.append(input);

      if (definition.hint) {
        const hint = document.createElement("span");
        hint.className = "field-hint";
        hint.textContent = definition.hint;
        wrapper.append(hint);
      }
      input.addEventListener("input", handleFieldChange);
      input.addEventListener("change", handleFieldChange);
    }
    fields.append(wrapper);
  }

  elements.fields.replaceChildren(fields);
  elements.typePill.innerHTML = `${ICONS[currentType]}<span>${TYPES[currentType].label}</span>`;
  elements.navigation.querySelectorAll(".nav-type").forEach((button) => {
    button.setAttribute("aria-current", String(button.dataset.kind === currentType));
  });
}

function readFields() {
  for (const definition of TYPES[currentType].fields) {
    const input = elements.form.elements.namedItem(definition.key);
    if (!input) continue;
    currentFields[definition.key] = definition.type === "checkbox" ? input.checked : input.value;
  }
}

function handleFieldChange(event) {
  readFields();
  if (event.target.name === "security") renderFields();
  selectedSavedId = null;
  renderSavedCodes();
  closeMoreMenu();
  refreshQrSoon();
}

function switchType(kind) {
  if (!TYPES[kind]) return;
  readFields();
  currentType = kind;
  currentFields = {};
  selectedSavedId = null;
  elements.codeName.value = "";
  showMessage("");
  renderFields();
  renderSavedCodes();
  closeMoreMenu();
  refreshQrSoon();
}

function openSavedCode(id) {
  const code = savedCodes.find((item) => item.id === id);
  if (!code) return;
  readFields();
  currentType = code.kind;
  currentFields = { ...code.fields };
  selectedSavedId = code.id;
  elements.codeName.value = code.name;
  showMessage("");
  renderFields();
  renderSavedCodes();
  closeMoreMenu();
  refreshQrSoon();
}

function showMessage(message, kind = "error") {
  elements.message.textContent = message;
  elements.message.classList.toggle("is-note", kind === "note");
  elements.message.classList.toggle("is-success", kind === "success");
}

function makePayload() {
  const value = (key) => String(currentFields[key] ?? "").trim();
  const escapeVCard = (input) => input.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

  switch (currentType) {
    case "website": return value("url");
    case "text": return value("message");
    case "payment": return value("details");
    case "phone": return `tel:${value("phone").replace(/\s+/g, "")}`;
    case "email": {
      const email = `mailto:${value("email")}`;
      const params = new URLSearchParams();
      if (value("subject")) params.set("subject", value("subject"));
      if (value("body")) params.set("body", value("body"));
      return params.size ? `${email}?${params}` : email;
    }
    case "wifi": {
      const escapeWifi = (input) => input.replace(/([\\;,:"])/g, "\\$1");
      const security = value("security") || "WPA";
      const password = security === "nopass" ? "" : `P:${escapeWifi(value("password"))};`;
      const hidden = currentFields.hidden ? "H:true;" : "";
      return `WIFI:T:${security};S:${escapeWifi(value("ssid"))};${password}${hidden};`;
    }
    case "contact": {
      const name = value("fullName");
      const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${escapeVCard(name)}`];
      const nameParts = name.split(/\s+/);
      lines.push(`N:${escapeVCard(nameParts.slice(1).join(" "))};${escapeVCard(nameParts[0])};;;`);
      if (value("organization")) lines.push(`ORG:${escapeVCard(value("organization"))}`);
      if (value("phone")) lines.push(`TEL;TYPE=CELL:${escapeVCard(value("phone"))}`);
      if (value("email")) lines.push(`EMAIL:${escapeVCard(value("email"))}`);
      if (value("website")) lines.push(`URL:${escapeVCard(value("website"))}`);
      lines.push("END:VCARD");
      return lines.join("\r\n");
    }
    default: return "";
  }
}

function summarize(data) {
  if (currentType === "website") {
    try { return new URL(data).hostname; } catch { return data; }
  }
  if (currentType === "wifi") return `Network · ${currentFields.ssid || "your Wi-Fi"}`;
  if (currentType === "contact") return currentFields.organization || "A handy little contact card";
  if (currentType === "email") return currentFields.email || "Opens a new email";
  if (currentType === "phone") return currentFields.phone || "Opens your phone app";
  if (currentType === "payment") return "A payment link, finance detail, or any text.";
  return data.replace(/\s+/g, " ").slice(0, 72);
}

function makeTitle() {
  const customName = elements.codeName.value.trim();
  if (customName) return customName;
  if (currentType === "website") {
    try { return new URL(currentFields.url).hostname.replace(/^www\./i, "") || "Your website"; } catch { return "Your website"; }
  }
  if (currentType === "wifi") return currentFields.ssid || "Guest Wi-Fi";
  if (currentType === "contact") return currentFields.fullName || "Contact card";
  if (currentType === "email") return currentFields.email ? `Email · ${currentFields.email}` : "Email";
  if (currentType === "phone") return currentFields.phone ? `Phone · ${currentFields.phone}` : "Phone";
  if (currentType === "payment") return "Payment & more";
  return "A little note";
}

function refreshQrSoon() {
  clearTimeout(refreshTimer);
  refreshSequence += 1;
  clearQr();
  elements.qrTitle.textContent = makeTitle();
  elements.qrSummary.textContent = "";
  elements.deleteButton.hidden = !selectedSavedId;
  refreshTimer = setTimeout(refreshQr, 220);
}

async function refreshQr() {
  const requestId = ++refreshSequence;
  elements.qrTitle.textContent = makeTitle();
  elements.qrSummary.textContent = "";
  elements.qrImage.hidden = true;
  elements.qrLoading.hidden = false;
  elements.downloadButton.disabled = true;
  elements.saveButton.disabled = true;
  elements.deleteButton.hidden = !selectedSavedId;
  closeMoreMenu();

  if (!elements.form.checkValidity()) {
    const missing = elements.form.querySelector(":invalid");
    if (!missing) {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
      qrUrl = "";
      qrData = "";
      elements.qrLoading.textContent = "Finish the details to see your QR.";
      return;
    }
    if (!missing.value.trim()) {
      elements.qrLoading.textContent = "Your QR will\nappear right here";
      return clearQr();
    }
    elements.qrLoading.textContent = "Check the details to see your QR.";
    return clearQr();
  }

  const data = makePayload();
  if (!data) {
    clearQr();
    return;
  }

  elements.qrLoading.textContent = "Making your code...";
  try {
    const response = await fetch("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
      signal: AbortSignal.timeout(15000)
    });
    if (requestId !== refreshSequence) return;
    if (!response.ok) {
      const result = await response.json();
      showMessage(result.error || "The QR code could not be generated.", "error");
      elements.qrLoading.textContent = "Let's check those details.";
      return clearQr(false);
    }
    const image = await response.blob();
    if (requestId !== refreshSequence) return;
    if (qrUrl) URL.revokeObjectURL(qrUrl);
    qrUrl = URL.createObjectURL(image);
    qrData = data;
    elements.qrImage.src = qrUrl;
    elements.qrImage.hidden = false;
    elements.qrLoading.hidden = true;
    elements.qrSummary.textContent = summarize(data);
    elements.qrTitle.textContent = makeTitle();
    elements.downloadButton.disabled = false;
    elements.saveButton.disabled = false;
    elements.saveButtonLabel.textContent = selectedSavedId ? "Update saved code" : "Save to my library";
    showMessage("");
  } catch (error) {
    if (requestId !== refreshSequence || error.name === "AbortError") return;
    clearQr();
    showMessage(error.name === "TimeoutError"
      ? "QR generation timed out. Please try again."
      : "Couldn't reach the local QR generator. Start it with python app.py and try again.", "error");
  }
}

function clearQr(resetImage = true) {
  if (qrUrl) URL.revokeObjectURL(qrUrl);
  qrUrl = "";
  qrData = "";
  if (resetImage) {
    elements.qrImage.removeAttribute("src");
    elements.qrImage.hidden = true;
    elements.qrLoading.hidden = false;
    elements.qrLoading.innerHTML = '<span class="placeholder-symbol" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M8 8h14v14H8zM26 8h14v14H26zM8 26h14v14H8zM28 28h4v4h-4zM36 26h4v4h-4zM28 36h4v4h-4zM36 36h4v4h-4z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M12 12h6v6h-6zM30 12h6v6h-6zM12 30h6v6h-6z" fill="currentColor"/></svg></span><span>Your QR will<br>appear right here</span>';
  }
  elements.downloadButton.disabled = true;
  elements.saveButton.disabled = true;
  return false;
}

function saveCurrentCode() {
  if (!qrData) return;
  const now = new Date().toISOString();
  const existing = selectedSavedId && savedCodes.find((code) => code.id === selectedSavedId);
  const name = elements.codeName.value.trim() || makeTitle();
  const code = {
    id: existing ? existing.id : crypto.randomUUID(),
    name,
    kind: currentType,
    fields: { ...currentFields },
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now
  };
  const nextCodes = existing
    ? savedCodes.map((item) => item.id === existing.id ? code : item)
    : [code, ...savedCodes];
  if (storeSavedCodes(nextCodes)) {
    selectedSavedId = code.id;
    renderSavedCodes();
    elements.saveButtonLabel.textContent = "Update saved code";
    showMessage("Saved in your browser on this device.", "success");
  }
}

function slugify(input) {
  return input.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55) || "my-qr-code";
}

function downloadCurrentCode() {
  if (!qrUrl) return;
  const link = document.createElement("a");
  link.href = qrUrl;
  link.download = `${slugify(elements.codeName.value.trim() || makeTitle())}.png`;
  document.body.append(link);
  link.click();
  link.remove();
}

async function copyQrImage() {
  if (!qrUrl || !navigator.clipboard || !window.ClipboardItem) {
    showMessage("Image copying is not supported in this browser. Download the PNG instead.", "error");
    return;
  }
  try {
    const image = await (await fetch(qrUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ [image.type]: image })]);
    showMessage("QR image copied to your clipboard.", "success");
  } catch (error) {
    showMessage(`Your browser could not copy the image: ${error.message}`, "error");
  }
  closeMoreMenu();
}

function deleteCurrentCode() {
  if (!selectedSavedId) return;
  const code = savedCodes.find((item) => item.id === selectedSavedId);
  if (!code) return;
  const nextCodes = savedCodes.filter((item) => item.id !== selectedSavedId);
  if (!storeSavedCodes(nextCodes)) return;
  selectedSavedId = null;
  elements.codeName.value = "";
  elements.qrTitle.textContent = makeTitle();
  elements.saveButtonLabel.textContent = "Save to my library";
  renderSavedCodes();
  closeMoreMenu();
  showMessage(`Removed "${code.name}" from your saved library.`, "success");
}

function closeMoreMenu() {
  elements.moreMenu.hidden = true;
  elements.moreButton.setAttribute("aria-expanded", "false");
}

function showExample(kind) {
  const example = DEFAULT_EXAMPLES[kind];
  if (!example) return;
  readFields();
  currentType = kind;
  currentFields = { ...example.fields };
  selectedSavedId = null;
  elements.codeName.value = example.name;
  renderFields();
  renderSavedCodes();
  showMessage("A sample you can edit. Try your own details when you're ready.", "note");
  refreshQrSoon();
  elements.fields.querySelector("input, textarea")?.focus();
}

elements.form.addEventListener("submit", (event) => event.preventDefault());
elements.codeName.addEventListener("input", () => {
  elements.qrTitle.textContent = makeTitle();
  elements.saveButtonLabel.textContent = selectedSavedId ? "Update saved code" : "Save to my library";
});
elements.codeName.addEventListener("change", () => {
  elements.qrTitle.textContent = makeTitle();
});
elements.libraryToggle.addEventListener("click", () => {
  const expanded = elements.libraryToggle.getAttribute("aria-expanded") !== "true";
  elements.libraryToggle.setAttribute("aria-expanded", String(expanded));
  elements.savedList.hidden = !expanded;
});
document.getElementById("newCodeButton").addEventListener("click", () => switchType("website"));
document.getElementById("downloadButton").addEventListener("click", downloadCurrentCode);
document.getElementById("saveButton").addEventListener("click", saveCurrentCode);
elements.deleteButton.addEventListener("click", deleteCurrentCode);
elements.copyButton.addEventListener("click", copyQrImage);
elements.moreButton.addEventListener("click", () => {
  const isOpen = elements.moreButton.getAttribute("aria-expanded") === "true";
  elements.moreButton.setAttribute("aria-expanded", String(!isOpen));
  elements.moreMenu.hidden = isOpen;
});
document.addEventListener("click", (event) => {
  if (!elements.moreMenu.contains(event.target) && !elements.moreButton.contains(event.target)) closeMoreMenu();
});
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
  if (event.key === "Escape") closeMoreMenu();
  if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key.toLowerCase() === "n") switchType("website");
});
document.querySelectorAll("[data-example]").forEach((button) =>
  button.addEventListener("click", () => showExample(button.dataset.example))
);

renderNavigation();
renderFields();
renderSavedCodes();
refreshQrSoon();
