/*  Configure your objects here.
    Each object gets: title, side (optional meta label), and an emoji or short icon.
    Click behavior: animates toward the right “rail” and removes from the DOM.
    Use Reset to bring them all back.
*/
const OBJECTS = [
  // — Spirit set —
  { title: "Faith",       side: "Spirit", emoji: "🕊️" },
  { title: "Prayer",      side: "Spirit", emoji: "🙏" },
  { title: "Scripture",   side: "Spirit", emoji: "📖" },
  { title: "Forgiveness", side: "Spirit", emoji: "🤝" },
  { title: "Worship",     side: "Spirit", emoji: "🎶" },
  { title: "Patience",    side: "Spirit", emoji: "⏳" },
  { title: "Gratitude",   side: "Spirit", emoji: "🌿" },
  { title: "Hope",        side: "Spirit", emoji: "🌅" },
  { title: "Purity",      side: "Spirit", emoji: "💧" },
  { title: "Obedience",   side: "Spirit", emoji: "🛡️" },

  // — Flesh set —
  { title: "Fear",        side: "Flesh",  emoji: "😨" },
  { title: "Gossip",      side: "Flesh",  emoji: "🗣️" },
  { title: "Distraction", side: "Flesh",  emoji: "📱" },
  { title: "Grudge",      side: "Flesh",  emoji: "🪨" },
  { title: "Idolatry",    side: "Flesh",  emoji: "🗿" },
  { title: "Impulse",     side: "Flesh",  emoji: "⚡" },
  { title: "Complaining", side: "Flesh",  emoji: "🙄" },
  { title: "Doubt",       side: "Flesh",  emoji: "❓" },
  { title: "Temptation",  side: "Flesh",  emoji: "🍎" },
  { title: "Rebellion",   side: "Flesh",  emoji: "🔥" }
];

const grid = document.getElementById("objectsGrid");
const resetBtn = document.getElementById("resetBtn");

function renderObjects(items) {
  grid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  items.forEach((obj, idx) => {
    const chip = document.createElement("button");
    chip.className = "object-chip";
    chip.setAttribute("type", "button");
    chip.setAttribute("aria-label", `${obj.title} (${obj.side || "Object"})`);

    chip.innerHTML = `
      <div class="object-emoji" aria-hidden="true">${obj.emoji || "🔹"}</div>
      <div>
        <div class="object-title">${escapeHTML(obj.title)}</div>
        <div class="object-meta">${escapeHTML(obj.side || "")}</div>
      </div>
    `;

    chip.addEventListener("click", () => flyOutAndRemove(chip));
    chip.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.key === " ") chip.click();
    });

    fragment.appendChild(chip);
  });

  grid.appendChild(fragment);
}

/** Animate toward the right and remove */
function flyOutAndRemove(el) {
  // Guard against double-clicks during animation
  if (el.classList.contains("fly-out")) return;

  // Lock the element’s current position to avoid grid reflow hiccups
  const rect = el.getBoundingClientRect();
  const placeholder = document.createElement("div");
  placeholder.style.width = rect.width + "px";
  placeholder.style.height = rect.height + "px";
  placeholder.style.borderRadius = getComputedStyle(el).borderRadius;

  // Convert to absolute for smooth flight
  const abs = el.cloneNode(true);
  abs.style.position = "fixed";
  abs.style.top = rect.top + "px";
  abs.style.left = rect.left + "px";
  abs.style.width = rect.width + "px";
  abs.style.height = rect.height + "px";
  abs.style.margin = "0";
  abs.classList.add("object-chip");

  // Replace original with placeholder in the grid
  grid.replaceChild(placeholder, el);

  // Add the animated clone to the body and run animation
  document.body.appendChild(abs);
  requestAnimationFrame(() => {
    abs.classList.add("fly-out");
  });

  // Clean up after animation
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = prefersReduced ? 0 : 700;

  setTimeout(() => {
    abs.remove();
    placeholder.remove();
  }, duration + 30);
}

/** Reset */
resetBtn.addEventListener("click", () => renderObjects(OBJECTS));

/** Utils */
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

/** Initial render */
renderObjects(OBJECTS);
