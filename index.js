const data = [
  {
    id: 1,
    title: "Glasslight",
    category: "Marimba",
    kind: "Original composition",
    level: "Advanced · 4 mallets",
    price: 18,
  },
  {
    id: 2,
    title: "After the Rain",
    category: "Marimba",
    kind: "Solo arrangement",
    level: "Intermediate · 4 mallets",
    price: 15,
  },
  {
    id: 3,
    title: "Paper Moons",
    category: "Marimba",
    kind: "Original composition",
    level: "Intermediate · 4 mallets",
    price: 16,
  },
  {
    id: 4,
    title: "Northbound",
    category: "Drumline",
    kind: "Original composition",
    level: "Open class · 8 voices",
    price: 42,
  },
  {
    id: 5,
    title: "Signal / Noise",
    category: "Drumline",
    kind: "Battery arrangement",
    level: "World class · 10 voices",
    price: 38,
  },
  {
    id: 6,
    title: "Small Hours",
    category: "Percussion Ensemble",
    kind: "Original composition",
    level: "Advanced · 5 players",
    price: 34,
  },
  {
    id: 7,
    title: "Tidal Memory",
    category: "Percussion Ensemble",
    kind: "Ensemble arrangement",
    level: "Intermediate · 7 players",
    price: 29,
  },
  {
    id: 8,
    title: "Common Ground",
    category: "Percussion Ensemble",
    kind: "Original composition",
    level: "Flexible · 6-8 players",
    price: 32,
  },
];
const slides = [
  {
    name: "Marimba",
    eyebrow: "Resonance & reflection",
    title: "Let every note<br><em>linger.</em>",
    text: "Intimate solos and vivid arrangements that let the marimba sing in its own unmistakable voice.",
    href: "#marimba",
  },
  {
    name: "Drumline",
    eyebrow: "Precision in motion",
    title: "Make the<br><em>ground move.</em>",
    text: "Powerful battery writing for the performers who turn precision into pure energy.",
    href: "#drumline",
  },
  {
    name: "Percussion Ensemble",
    eyebrow: "Many voices, one pulse",
    title: "Find the pulse<br><em>between us.</em>",
    text: "Colorful, collaborative repertoire built for the chemistry of the percussion ensemble.",
    href: "#ensemble",
  },
];
let slide = 0,
  filter = "all",
  bag = [];
const productBox = document.getElementById("products");
function render() {
  let q = document.getElementById("search").value.toLowerCase().trim();
  let list = data.filter(
    (p) =>
      (filter === "all" || p.category === filter) &&
      `${p.title} ${p.category} ${p.kind} ${p.level}`.toLowerCase().includes(q),
  );
  productBox.innerHTML = list.length
    ? list
        .map(
          (p) =>
            `<article class="card" id="${p.category === "Percussion Ensemble" ? "ensemble" : p.category.toLowerCase()}"><div class="art"><label>Digital score</label><span>${p.title.toUpperCase()}</span></div><div class="info"><div class="type">${p.category} · ${p.kind}</div><h3>${p.title}</h3><div class="details">${p.level}</div><div class="purchase"><span>$${p.price.toFixed(2)}</span><button class="add" data-add="${p.id}">Add to bag +</button></div></div></article>`,
        )
        .join("")
    : '<div class="empty">No scores found. Try another title or collection.</div>';
}
function choose(value) {
  filter = value;
  document
    .querySelectorAll(".filter")
    .forEach((b) => b.classList.toggle("active", b.dataset.filter === value));
  document.getElementById("shopTitle").textContent =
    value === "all" ? "Music that you come back to." : `${value} scores.`;
  render();
}
function showSlide(n) {
  slide = (n + slides.length) % slides.length;
  let s = slides[slide];
  document.getElementById("eyebrow").textContent = s.eyebrow;
  document.getElementById("title").innerHTML = s.title;
  document.getElementById("description").textContent = s.text;
  document.getElementById("heroLink").href = s.href;
  document.getElementById("heroLink").textContent =
    `Explore ${s.name.toLowerCase()} scores ↗`;
  document.getElementById("slideNumber").textContent = `0${slide + 1}`;
}
function updateBag() {
  let qty = bag.reduce((n, p) => n + p.qty, 0);
  document.getElementById("count").textContent = `(${qty})`;
  document.getElementById("drawerCount").textContent = `(${qty})`;
  document.getElementById("total").textContent =
    "$" + bag.reduce((n, p) => n + p.price * p.qty, 0).toFixed(2);
  document.getElementById("items").innerHTML = bag.length
    ? bag
        .map(
          (p) =>
            `<div class="item"><div><strong>${p.title}</strong><small>${p.category} · Qty ${p.qty}</small></div><div>$${(p.price * p.qty).toFixed(2)}<br><button class="remove" data-remove="${p.id}">Remove</button></div></div>`,
        )
        .join("")
    : '<p style="margin:15px;padding:0;text-align:center;color:#76766f;font-size:13px">Your bag is waiting for its first score.</p>';
}
function cart(open) {
  document.getElementById("drawer").classList.toggle("open", open);
  document.getElementById("overlay").classList.toggle("open", open);
}
function message(text) {
  let n = document.getElementById("notice");
  n.textContent = text;
  n.classList.add("show");
  setTimeout(() => n.classList.remove("show"), 1900);
}
document.getElementById("prev").onclick = () => showSlide(slide - 1);
document.getElementById("next").onclick = () => showSlide(slide + 1);
document.getElementById("heroLink").onclick = () => choose(slides[slide].name);
document
  .querySelectorAll(".collection a")
  .forEach(
    (a) =>
      (a.onclick = () =>
        choose(
          a.hash === "#ensemble"
            ? "Percussion Ensemble"
            : a.hash === "#drumline"
              ? "Drumline"
              : "Marimba",
        )),
  );
document
  .querySelectorAll(".filter")
  .forEach((b) => (b.onclick = () => choose(b.dataset.filter)));
document.getElementById("search").addEventListener("input", render);
productBox.addEventListener("click", (e) => {
  let p = data.find((x) => x.id === Number(e.target.dataset.add));
  if (!p) return;
  let item = bag.find((x) => x.id === p.id);
  if (item) item.qty++;
  else bag.push({ ...p, qty: 1 });
  updateBag();
  message(`${p.title} added to your bag`);
});
document.getElementById("items").onclick = (e) => {
  let id = Number(e.target.dataset.remove);
  if (id) {
    bag = bag.filter((p) => p.id !== id);
    updateBag();
  }
};
document.getElementById("openCart").onclick = () => cart(true);
document.getElementById("close").onclick = () => cart(false);
document.getElementById("overlay").onclick = () => cart(false);
document.getElementById("checkout").onclick = () =>
  message(
    bag.length
      ? "Checkout is coming soon. Your scores are saved."
      : "Add a score to your bag to get started.",
  );
document.getElementById("menu").onclick = () =>
  document.getElementById("nav").classList.toggle("open");
document
  .querySelectorAll("#nav a")
  .forEach(
    (a) =>
      (a.onclick = () =>
        document.getElementById("nav").classList.remove("open")),
  );
render();
updateBag();
setInterval(() => showSlide(slide + 1), 7000);
