(() => {
  const button = document.getElementById("SignUpLogin");
  if (!button) return;

  const imageFields = [
    "photoURL",
    "photoUrl",
    "profilePicture",
    "profilePic",
    "avatarUrl",
    "avatar",
    "picture",
    "image",
  ];
  const readProfile = (value) => {
    if (!value || typeof value !== "object") return "";
    for (const field of imageFields) {
      if (typeof value[field] === "string" && value[field].trim())
        return value[field].trim();
    }
    return value.user && typeof value.user === "object"
      ? readProfile(value.user)
      : "";
  };

  let profileImage = "";
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      for (let index = 0; index < storage.length && !profileImage; index += 1) {
        const key = storage.key(index);
        const raw = storage.getItem(key);
        let value;
        try {
          value = JSON.parse(raw);
        } catch {
          value = raw;
        }
        if (value && typeof value === "object") {
          const signedOut =
            value.isLoggedIn === false ||
            value.loggedIn === false ||
            value.authenticated === false;
          if (!signedOut && /(user|account|auth|profile|session)/i.test(key))
            profileImage = readProfile(value);
        }
      }
    } catch {
      // Storage may be unavailable in restricted browsing contexts.
    }
  }

  if (!profileImage) return;
  const image = document.createElement("img");
  image.src = profileImage;
  image.alt = "Your profile";
  image.width = 40;
  image.height = 40;
  image.style.cssText =
    "width:40px;height:40px;border-radius:50%;object-fit:cover;vertical-align:middle";
  button.replaceChildren(image);
  button.removeAttribute("onclick");
  button.setAttribute("aria-label", "Your profile");
})();
