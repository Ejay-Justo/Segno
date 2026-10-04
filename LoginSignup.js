(() => {
  const USERS_KEY = "segnoUsers";
  const SESSION_KEY = "segnoSession";
  const card = document.getElementById("accountCard");
  let mode = "signup";
  const readUsers = () => {
    try {
      const value = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch {
      return {};
    }
  };
  const safe = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const getSession = () => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  };
  const showLoggedInUsername = (user) => {
    const username = user.name || user.email;
    document.querySelectorAll("a, button").forEach((element) => {
      if (/^(log\s*in|sign\s*up|login|signup)$/i.test(element.textContent.trim())) {
        element.textContent = username;
      }
    });
  };
  const drawProfile = (user) => {
    const initial = safe(
      (user.name || user.email || "S").trim().charAt(0).toUpperCase(),
    );
    card.innerHTML = `<div class="eyebrow">Your Segno account</div><h2>Your profile.</h2><p class="sub">Your account information is saved in this browser.</p><div class="profile"><div class="profile-top"><div class="avatar">${initial}</div><div><h3>${safe(user.name || "Musician")}</h3><p>Segno Editions member</p></div></div><dl><div><dt>Name</dt><dd>${safe(user.name || "—")}</dd></div><div><dt>Email</dt><dd>${safe(user.email)}</dd></div><div><dt>Member since</dt><dd>${safe(user.joined || "—")}</dd></div></dl></div><div class="profile-actions"><a class="secondary" href="0039JustoMyWebPage.html" style="text-align:center;padding-top:13px">Visit the shop</a><button class="secondary" id="logout" type="button">Log out</button></div>`;
    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem(SESSION_KEY);
      mode = "login";
      drawForms();
    });
  };
  const drawForms = (error = "") => {
    const signup = mode === "signup";
    card.innerHTML = `<div class="eyebrow">${signup ? "Join the community" : "Welcome back"}</div><h2>${signup ? "Create account." : "Sign in."}</h2><p class="sub">${signup ? "Save your details and stay connected with the music you love." : "Enter your account details to continue."}</p><div class="tabs" role="tablist"><button class="tab ${signup ? "active" : ""}" type="button" data-mode="signup" role="tab" aria-selected="${signup}">Sign up</button><button class="tab ${!signup ? "active" : ""}" type="button" data-mode="login" role="tab" aria-selected="${!signup}">Log in</button></div><form id="authForm" novalidate>${signup ? '<div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" maxlength="80" required /></div>' : ""}<div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required /></div><div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="8" required /></div>${signup ? '<div class="field"><label for="confirm">Confirm password</label><input id="confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required /></div>' : ""}<button class="submit" type="submit">${signup ? "Create account" : "Log in"}</button><p class="message" id="message" role="alert">${safe(error)}</p></form><div class="notice">Demo accounts are stored only in this browser and are not backed by a secure server. Do not reuse a password from another service.</div>`;
    card.querySelectorAll("[data-mode]").forEach((button) =>
      button.addEventListener("click", () => {
        mode = button.dataset.mode;
        drawForms();
      }),
    );
    document.getElementById("authForm").addEventListener("submit", submitForm);
  };
  const hashPassword = async (password) => {
    if (!crypto.subtle)
      throw new Error(
        "Password hashing is unavailable. Open this page through HTTPS or localhost.",
      );
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
      key,
      256,
    );
    return {
      salt: Array.from(salt, (b) => b.toString(16).padStart(2, "0")).join(""),
      hash: Array.from(new Uint8Array(bits), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join(""),
    };
  };
  const verifyPassword = async (password, saved) => {
    if (!saved || !saved.salt || !saved.hash || !crypto.subtle) return false;
    const salt = new Uint8Array(
      saved.salt.match(/.{2}/g).map((byte) => parseInt(byte, 16)),
    );
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
      key,
      256,
    );
    const hash = Array.from(new Uint8Array(bits), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    return hash === saved.hash;
  };
  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(data.get("password") || "");
    const message = document.getElementById("message");
    if (!form.reportValidity()) return;
    try {
      const users = readUsers();
      if (mode === "signup") {
        const name = String(data.get("name") || "").trim();
        if (!name) {
          message.textContent = "Please enter your name.";
          return;
        }
        if (password !== data.get("confirm")) {
          message.textContent = "Your passwords do not match.";
          return;
        }
        if (users[email]) {
          message.textContent =
            "An account with this email already exists. Please log in.";
          return;
        }
        users[email] = {
          name,
          email,
          credential: await hashPassword(password),
          joined: new Date().toLocaleDateString(),
        };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      } else {
        const user = users[email];
        if (!user || !(await verifyPassword(password, user.credential))) {
          message.textContent = "Email or password is incorrect.";
          return;
        }
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
      window.location.href = "0039JustoMyWebPage.html";
    } catch (error) {
      message.textContent =
        error && error.message
          ? error.message
          : "Unable to save your account in this browser.";
    }
  }
  const session = getSession();
  const user = session && session.email ? readUsers()[session.email] : null;
  if (user) {
    showLoggedInUsername(user);
    drawProfile(user);
  }
  else drawForms();
})();
