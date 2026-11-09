// ---- EDIT HERE ----------------------------------------------------------
// WhatsApp number in international format, digits only (UK 07xxx -> 447xxx).
const WHATSAPP_NUMBER = "447000000000";
const MESSAGES = {
  book:  "Hi Shelley's Steam Press, I'd like to book an ironing pickup please.",
  quote: "Hi Shelley's Steam Press, could I get a quote for some ironing please?"
};
const PRICE_PER_KG = 3;
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
