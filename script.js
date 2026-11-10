// ---- EDIT HERE ----------------------------------------------------------
// WhatsApp number in international format, digits only (UK 07xxx -> 447xxx).
const WHATSAPP_NUMBER = "447735280207";
const MESSAGES = {
  book:  "Hi Shelley's Steam Press, I'd like to arrange some ironing please.",
  quote: "Hi Shelley's Steam Press, could I get a price for some ironing please?",
  offer: "Hi Shelley's Steam Press, I'd like to claim 10% off my first order please."
};
const PRICE_PER_KG = 4;
// --------------------------------------------------------------------------

document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(MESSAGES[a.dataset.wa]);
  a.target = "_blank";
  a.rel = "noopener";
});

// Estimated weight of each item in kg (edit to adjust the item calculator)
const MIN_KG = 6;
const ITEMS = [
  ["T-shirt", 0.15], ["Shirt / blouse", 0.2], ["Vest / top", 0.1],
  ["Jeans", 0.6], ["Trousers", 0.4], ["Shorts", 0.2],
  ["Dress", 0.35], ["Skirt", 0.25], ["Jumper / hoodie", 0.5],
  ["Pyjamas (set)", 0.4], ["Pillowcase", 0.15], ["Bed sheet", 0.6],
  ["Duvet cover", 0.9], ["Tea towel", 0.08]
];

const kg = document.getElementById("kg");
const totalEl = document.getElementById("total");
const wtline = document.getElementById("wtline");
const fine = document.getElementById("fine");
const caveat = document.getElementById("caveat");
const itemsEl = document.getElementById("items");
const fmt = n => (Math.round(n * 10) / 10).toString();

if (kg) {
  const updateWeight = () => {
    document.getElementById("kgout").textContent = kg.value + " kg";
    totalEl.textContent = "£" + (kg.value * PRICE_PER_KG);
    const pct = (kg.value - kg.min) / (kg.max - kg.min) * 100;
    kg.style.setProperty("--fill", pct + "%");
  };
  kg.addEventListener("input", updateWeight);

  ITEMS.forEach(([name, w], i) => {
    const row = document.createElement("label");
    row.className = "item";
    row.innerHTML = '<span class="item__n">' + name + '<small>about ' + w + ' kg</small></span>' +
      '<input type="number" inputmode="numeric" min="0" max="99" step="1" value="0" data-w="' + w + '" aria-label="Number of ' + name + '">';
    itemsEl.appendChild(row);
  });

  const updateItems = () => {
    let est = 0;
    itemsEl.querySelectorAll("input").forEach(inp => {
      const n = Math.max(0, Math.min(99, parseInt(inp.value, 10) || 0));
      est += n * parseFloat(inp.dataset.w);
    });
    const billed = Math.max(est, MIN_KG);
    totalEl.textContent = "£" + Math.round(billed * PRICE_PER_KG);
    wtline.textContent = est === 0
      ? "Add your items above to see an estimate."
      : "Estimated weight: about " + fmt(est) + " kg" +
        (est < MIN_KG ? ". That's under our " + MIN_KG + " kg minimum for pickup and drop-off, so the price shown is for " + MIN_KG + " kg." : ".");
  };
  itemsEl.addEventListener("input", updateItems);

  const setMode = m => {
    const items = m === "items";
    document.getElementById("mode-weight").hidden = items;
    document.getElementById("mode-items").hidden = !items;
    wtline.hidden = !items;
    caveat.hidden = !items;
    fine.hidden = items;
    items ? updateItems() : updateWeight();
  };
  document.querySelectorAll('input[name="mode"]').forEach(r =>
    r.addEventListener("change", () => setMode(r.value)));
  updateWeight();
}
document.getElementById("yr").textContent = new Date().getFullYear();

// 10% off pop-up: shown once per visitor, a few seconds after arriving
(function () {
  const pop = document.getElementById("pop");
  if (!pop) return;
  try { if (localStorage.getItem("ssp_offer_seen")) return; } catch (e) {}
  const close = () => {
    pop.hidden = true;
    try { localStorage.setItem("ssp_offer_seen", "1"); } catch (e) {}
  };
  setTimeout(() => { pop.hidden = false; document.getElementById("popx").focus(); }, 4000);
  document.getElementById("popx").addEventListener("click", close);
  pop.addEventListener("click", e => { if (e.target === pop) close(); });
  pop.querySelector("[data-wa]").addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !pop.hidden) close(); });
})();
