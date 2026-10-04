const data = [
  {
    id: 1,
    title: "Playing God by Polyphia",
    category: "Marimba",
    kind: "Solo arrangement",
    level: "Advanced · 4 mallets",
    price: 18,
  },
  {
    id: 2,
    title: "Mia and Sebastian's Theme by Justin Hurwitz",
    category: "Marimba",
    kind: "Solo arrangement",
    level: "Intermediate · 4 mallets",
    price: 20,
  },
  {
    id: 3,
    title: "Truman Sleeps by Philip Glass",
    category: "Marimba",
    kind: "Original composition",
    level: "Intermediate · 4 mallets",
    price: 16,
  },
  {
    id: 4,
    title: "Rico Blanco Medley",
    category: "Drumline",
    kind: "Original composition",
    level: "Open class · 8 voices",
    price: 42,
  },
  {
    id: 5,
    title: "Scharton",
    category: "Drumline",
    kind: "Battery arrangement",
    level: "World class · 11 voices",
    price: 38,
  },
  {
    id: 6,
    title: "What We Carry",
    category: "Percussion Ensemble",
    kind: "Ensemble arrangement",
    level: "Advanced · 19 players",
    price: 34,
  },
  {
    id: 7,
    title: "Kalapastangan by Fitterkarma",
    category: "Percussion Ensemble",
    kind: "Ensemble arrangement",
    level: "Intermediate · 22 players",
    price: 29,
  },
  {
    id: 8,
    title: "Blue by Yung Kai",
    category: "Percussion Ensemble",
    kind: "Ensemble arrangement",
    level: "Flexible · 10-15 players",
    price: 32,
  },
  {
    id: 9,
    title: "Mapa by SB19",
    category: "Percussion Ensemble",
    kind: "Ensemble arrangement",
    level: "Advanced · 15 players",
    price: 36,
  },
  {
    id: 10,
    title: "Moira medley",
    category: "Percussion Ensemble",
    kind: "Ensemble arrangement",
    level: "Intermediate · 15 players",
    price: 30,
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

let slide = 0;
let filter = "all";
let bag = [];

const productBox = document.getElementById("products");
const getId = (id) => document.getElementById(id);

function getLoggedInUser() {
  try {
    const session = JSON.parse(localStorage.getItem("segnoSession") || "null");
    if (!session || typeof session.email !== "string") return null;

    const users = JSON.parse(localStorage.getItem("segnoUsers") || "{}");
    return users && typeof users === "object" ? users[session.email] || null : null;
  } catch {
    return null;
  }
}

function updateLoggedInGreeting() {
  const user = getLoggedInUser();
  const greetingNode = getId("SignUpLogin");

  if (!greetingNode || !user) return;

  const name = user.name || user.email;
  greetingNode.textContent = `Welcome, ${name}`;
  greetingNode.setAttribute("aria-label", `Account for ${name}`);
}

function getFilteredProducts() {
  const searchInput = getId("search");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  return data.filter(
    (product) =>
      (filter === "all" || product.category === filter) &&
      `${product.title} ${product.category} ${product.kind} ${product.level}`
        .toLowerCase()
        .includes(query),
  );
}

function productCardMarkup(product) {
  const cardId =
    product.category === "Percussion Ensemble"
      ? "ensemble"
      : product.category.toLowerCase();

  return `
    <article class="card" id="${cardId}">
      <div class="art">
        <label>Digital score</label>
        <span>${product.title.toUpperCase()}</span>
      </div>
      <div class="info">
        <div class="type">${product.category} · ${product.kind}</div>
        <h3>${product.title}</h3>
        <div class="details">${product.level}</div>
        <div class="purchase">
          <span>$${product.price.toFixed(2)}</span>
          <button class="add" data-add="${product.id}">Add to bag +</button>
        </div>
      </div>
    </article>
  `;
}

function render() {
  if (!productBox) return;

  const list = getFilteredProducts();

  productBox.innerHTML = list.length
    ? list.map(productCardMarkup).join("")
    : '<div class="empty">No scores found. Try another title or collection.</div>';
}

function choose(value) {
  filter = value;

  document
    .querySelectorAll(".filter")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.filter === value),
    );

  const shopTitle = getId("shopTitle");
  if (shopTitle) {
    shopTitle.textContent =
      value === "all" ? "Music that you come back to." : `${value} scores.`;
  }

  render();
}

function showSlide(n) {
  slide = (n + slides.length) % slides.length;
  const activeSlide = slides[slide];
  const eyebrow = getId("eyebrow");
  const title = getId("title");
  const description = getId("description");
  const heroLink = getId("heroLink");
  const slideNumber = getId("slideNumber");

  if (eyebrow) eyebrow.textContent = activeSlide.eyebrow;
  if (title) title.innerHTML = activeSlide.title;
  if (description) description.textContent = activeSlide.text;
  if (heroLink) {
    heroLink.href = activeSlide.href;
    heroLink.textContent = `Explore ${activeSlide.name.toLowerCase()} scores ↗`;
  }
  if (slideNumber) slideNumber.textContent = `0${slide + 1}`;
}

function bagItemMarkup(item) {
  return `
    <div class="item">
      <div>
        <strong>${item.title}</strong>
        <small>${item.category} · Qty ${item.qty}</small>
      </div>
      <div>
        $${(item.price * item.qty).toFixed(2)}<br>
        <button class="remove" data-remove="${item.id}">Remove</button>
      </div>
    </div>
  `;
}

function updateBag() {
  const qty = bag.reduce((total, item) => total + item.qty, 0);
  const totalAmount = bag.reduce((total, item) => total + item.price * item.qty, 0);

  document.getElementById("count").textContent = `(${qty})`;
  document.getElementById("drawerCount").textContent = `(${qty})`;
  document.getElementById("total").textContent = "$" + totalAmount.toFixed(2);
  document.getElementById("items").innerHTML = bag.length
    ? bag.map(bagItemMarkup).join("")
    : '<p style="margin:15px;padding:0;text-align:center;color:#76766f;font-size:13px">Your bag is waiting for its first score.</p>';
}

function cart(open) {
  document.getElementById("drawer").classList.toggle("open", open);
  document.getElementById("overlay").classList.toggle("open", open);
}

function message(text) {
  const notice = document.getElementById("notice");
  notice.textContent = text;
  notice.classList.add("show");
  setTimeout(() => notice.classList.remove("show"), 1900);
}

document.getElementById("prev").onclick = () => showSlide(slide - 1);
document.getElementById("next").onclick = () => showSlide(slide + 1);
document.getElementById("heroLink").onclick = () => choose(slides[slide].name);

document.querySelectorAll(".collection a").forEach(
  (link) =>
    (link.onclick = () =>
      choose(
        link.hash === "#ensemble"
          ? "Percussion Ensemble"
          : link.hash === "#drumline"
            ? "Drumline"
            : "Marimba",
      )),
);

document.querySelectorAll(".filter").forEach(
  (button) => (button.onclick = () => choose(button.dataset.filter)),
);

document.getElementById("search").addEventListener("input", render);

productBox.addEventListener("click", (event) => {
  const product = data.find((item) => item.id === Number(event.target.dataset.add));

  if (!product) return;

  const existingItem = bag.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    bag.push({ ...product, qty: 1 });
  }

  updateBag();
  message(`${product.title} added to your bag`);
});

document.getElementById("items").onclick = (event) => {
  const id = Number(event.target.dataset.remove);

  if (id) {
    bag = bag.filter((item) => item.id !== id);
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

document.querySelectorAll("#nav a").forEach(
  (link) =>
    (link.onclick = () => document.getElementById("nav").classList.remove("open")),
);

render();
updateBag();
updateLoggedInGreeting();
setInterval(() => showSlide(slide + 1), 7000);
