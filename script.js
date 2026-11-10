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

const kg = document.getElementById("kg");
if (kg) {
  const update = () => {
    document.getElementById("kgout").textContent = kg.value + " kg";
    document.getElementById("total").textContent = "£" + (kg.value * PRICE_PER_KG);
    const pct = (kg.value - kg.min) / (kg.max - kg.min) * 100;
    kg.style.setProperty("--fill", pct + "%");
  };
  kg.addEventListener("input", update);
  update();
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
