const demoAccounts = {
  parent: { email: "parent@example.com", password: "parent123", name: "Алия", roleLabel: "Родитель" },
  center: { email: "center@example.com", password: "center123", name: "Администратор центра", roleLabel: "Образовательный центр" },
};

const baseCenters = [
  {
    id: 1,
    owner: "system",
    name: "EduStep Karaganda",
    category: "Образование",
    district: "Центр",
    age: [6, 14],
    price: 35000,
    rating: 4.8,
    distance: 1.2,
    trial: true,
    places: true,
    online: true,
    days: ["Пн", "Ср", "Пт"],
    time: "16:00-19:00",
    language: "Русский, казахский",
    address: "пр. Бухар-Жырау, 53",
    phone: "+7 7212 45 12 90",
    description: "IT, английский язык, подготовка к школе и проектные занятия для школьников.",
    accent: "#1f8a70",
    map: [62, 45],
    badge: "IT",
  },
  {
    id: 2,
    owner: "system",
    name: "Arman Football School",
    category: "Спорт",
    district: "Юго-Восток",
    age: [5, 13],
    price: 28000,
    rating: 4.6,
    distance: 3.7,
    trial: true,
    places: true,
    online: false,
    days: ["Вт", "Чт", "Сб"],
    time: "15:30-20:00",
    language: "Русский",
    address: "ул. Муканова, 21",
    phone: "+7 700 346 77 10",
    description: "Футбол, ОФП, турниры выходного дня и индивидуальные тренировки.",
    accent: "#256f9c",
    map: [72, 68],
    badge: "SP",
  },
  {
    id: 3,
    owner: "system",
    name: "ArtLab Studio",
    category: "Творчество",
    district: "Центр",
    age: [3, 16],
    price: 24000,
    rating: 4.9,
    distance: 0.8,
    trial: true,
    places: false,
    online: true,
    days: ["Пн", "Вт", "Вс"],
    time: "10:00-18:00",
    language: "Русский, английский",
    address: "ул. Ермекова, 38",
    phone: "+7 707 230 88 13",
    description: "Рисование, керамика, дизайн-мышление и семейные мастер-классы.",
    accent: "#d65d4a",
    map: [48, 40],
    badge: "AR",
  },
];

const state = {
  user: JSON.parse(localStorage.getItem("kk_user") || "null"),
  favorites: new Set(JSON.parse(localStorage.getItem("kk_favorites") || "[]")),
  compare: new Set(),
  userCenters: JSON.parse(localStorage.getItem("kk_user_centers") || "[]"),
};

const els = {
  authStatus: document.querySelector("#authStatus"),
  openLogin: document.querySelector("#openLogin"),
  loginDialog: document.querySelector("#loginDialog"),
  closeLogin: document.querySelector("#closeLogin"),
  loginForm: document.querySelector("#loginForm"),
  loginEmail: document.querySelector("#loginEmail"),
  loginPassword: document.querySelector("#loginPassword"),
  loginMessage: document.querySelector("#loginMessage"),
  search: document.querySelector("#searchInput"),
  category: document.querySelector("#categoryFilter"),
  age: document.querySelector("#ageFilter"),
  district: document.querySelector("#districtFilter"),
  price: document.querySelector("#priceFilter"),
  priceValue: document.querySelector("#priceValue"),
  trial: document.querySelector("#trialFilter"),
  places: document.querySelector("#placesFilter"),
  online: document.querySelector("#onlineFilter"),
  sort: document.querySelector("#sortSelect"),
  cards: document.querySelector("#cards"),
  count: document.querySelector("#countLabel"),
  map: document.querySelector("#cityMap"),
  compare: document.querySelector("#compareList"),
  centerForm: document.querySelector("#centerForm"),
  addCenterHint: document.querySelector("#addCenterHint"),
  formMessage: document.querySelector("#formMessage"),
  favoriteSummary: document.querySelector("#favoriteSummary"),
  myCentersSummary: document.querySelector("#myCentersSummary"),
  profileSummary: document.querySelector("#profileSummary"),
  messagesSummary: document.querySelector("#messagesSummary"),
  cabinetTitle: document.querySelector("#cabinetTitle"),
  dialog: document.querySelector("#centerDialog"),
  dialogContent: document.querySelector("#dialogContent"),
};

function allCenters() {
  return [...baseCenters, ...state.userCenters];
}

function saveState() {
  localStorage.setItem("kk_favorites", JSON.stringify([...state.favorites]));
  localStorage.setItem("kk_user_centers", JSON.stringify(state.userCenters));
  if (state.user) localStorage.setItem("kk_user", JSON.stringify(state.user));
  else localStorage.removeItem("kk_user");
}

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0));
}

function ageMatches(center, value) {
  if (value === "all") return true;
  const selected = Number(value);
  return selected >= center.age[0] && selected <= center.age[1];
}

function getFilteredCenters() {
  const query = els.search.value.trim().toLowerCase();
  const maxPrice = Number(els.price.value);

  return allCenters()
    .filter((center) => {
      const searchable = `${center.name} ${center.category} ${center.district} ${center.description}`.toLowerCase();
      return (
        (!query || searchable.includes(query)) &&
        (els.category.value === "all" || center.category === els.category.value) &&
        (els.district.value === "all" || center.district === els.district.value) &&
        ageMatches(center, els.age.value) &&
        center.price <= maxPrice &&
        (!els.trial.checked || center.trial) &&
        (!els.places.checked || center.places) &&
        (!els.online.checked || center.online)
      );
    })
    .sort((a, b) => {
      if (els.sort.value === "price") return a.price - b.price;
      if (els.sort.value === "distance") return a.distance - b.distance;
      return b.rating - a.rating;
    });
}

function renderCards(list) {
  els.cards.innerHTML = "";
  if (!list.length) {
    els.cards.innerHTML = '<div class="empty">По выбранным фильтрам пока нет центров.</div>';
    return;
  }

  list.forEach((center) => {
    const card = document.createElement("article");
    card.className = "center-card";
    card.innerHTML = `
      <div class="card-media" style="--accent:${center.accent}">
        <span class="logo-chip">${center.badge}</span>
        ${center.owner !== "system" ? '<span class="moderation-chip">Новая карточка</span>' : ""}
      </div>
      <div class="card-top">
        <div>
          <h3>${center.name}</h3>
          <div class="muted">${center.category} · ${center.district}</div>
        </div>
        <div class="rating">${center.rating.toFixed(1)}</div>
      </div>
      <div class="tags">
        <span class="tag">${center.age[0]}-${center.age[1]} лет</span>
        <span class="tag">${formatPrice(center.price)} тг</span>
        <span class="tag">${center.distance} км</span>
      </div>
      <div class="meta">
        <span>${center.address}</span>
        <span>${center.days.join(", ")} · ${center.time}</span>
        <span>${center.trial ? "Есть пробное занятие" : "Запись после консультации"} · ${center.places ? "места есть" : "лист ожидания"}</span>
      </div>
      <div class="card-actions">
        <button class="secondary-btn" data-detail="${center.id}">Подробнее</button>
        <button class="icon-btn ${state.favorites.has(center.id) ? "active" : ""}" title="В избранное" data-fav="${center.id}">♡</button>
        <button class="icon-btn ${state.compare.has(center.id) ? "active" : ""}" title="Добавить к сравнению" data-compare="${center.id}">≡</button>
      </div>
    `;
    els.cards.appendChild(card);
  });
}

function renderMap(list) {
  els.map.innerHTML = "";
  list.forEach((center) => {
    const pin = document.createElement("button");
    pin.className = "pin";
    pin.style.left = `${center.map[0]}%`;
    pin.style.top = `${center.map[1]}%`;
    pin.title = center.name;
    pin.innerHTML = `<span>${center.badge}</span>`;
    pin.addEventListener("click", () => openDetails(center.id));
    els.map.appendChild(pin);
  });
}

function renderCompare() {
  const selected = allCenters().filter((center) => state.compare.has(center.id));
  els.compare.innerHTML = selected.length
    ? selected.map((center) => `<div class="compare-item"><span>${center.name}</span><strong>${formatPrice(center.price)} тг</strong></div>`).join("")
    : '<div class="muted">Добавьте центры кнопкой ≡</div>';
}

function renderAuth() {
  if (!state.user) {
    els.authStatus.textContent = "Гость";
    els.openLogin.textContent = "Войти";
    els.cabinetTitle.textContent = "Гостевой режим";
    els.profileSummary.textContent = "Войдите как родитель или образовательный центр.";
    els.messagesSummary.textContent = "Войдите, чтобы общаться с центрами и родителями.";
    els.addCenterHint.textContent = "Войдите как образовательный центр, чтобы отправить карточку в каталог.";
    els.centerForm.classList.add("locked");
    return;
  }

  els.authStatus.textContent = `${state.user.roleLabel}: ${state.user.name}`;
  els.openLogin.textContent = "Выйти";
  els.cabinetTitle.textContent = state.user.role === "center" ? "Кабинет образовательного центра" : "Кабинет родителя";
  els.profileSummary.textContent =
    state.user.role === "center"
      ? "Вы можете добавлять карточки центра, обновлять контакты и смотреть заявки."
      : "Вы можете сохранять избранное, сравнивать центры и записываться на пробные занятия.";
  els.messagesSummary.textContent =
    state.user.role === "center" ? "Новые обращения родителей будут появляться здесь." : "Диалоги с выбранными центрами будут появляться здесь.";
  els.addCenterHint.textContent =
    state.user.role === "center" ? "Заполните форму, и карточка сразу появится в каталоге." : "Добавлять карточки могут пользователи с ролью образовательного центра.";
  els.centerForm.classList.toggle("locked", state.user.role !== "center");
}

function renderProfile() {
  const favs = allCenters().filter((center) => state.favorites.has(center.id));
  const myCenters = state.userCenters.filter((center) => state.user?.role === "center" && center.owner === state.user.email);
  els.favoriteSummary.textContent = favs.length ? favs.map((center) => center.name).join(", ") : "Пока нет сохраненных центров";
  els.myCentersSummary.textContent = myCenters.length
    ? myCenters.map((center) => center.name).join(", ")
    : "Карточки появятся после добавления центра.";
}

function render() {
  els.priceValue.textContent = formatPrice(els.price.value);
  const list = getFilteredCenters();
  els.count.textContent = `${list.length} ${list.length === 1 ? "вариант" : "вариантов"}`;
  renderCards(list);
  renderMap(list);
  renderCompare();
  renderAuth();
  renderProfile();
  saveState();
}

function openDetails(id) {
  const center = allCenters().find((item) => item.id === Number(id));
  if (!center) return;

  els.dialogContent.innerHTML = `
    <div class="dialog-inner">
      <div class="card-media" style="--accent:${center.accent}">
        <span class="logo-chip">${center.badge}</span>
      </div>
      <div>
        <p class="eyebrow">${center.category} · ${center.district}</p>
        <h2>${center.name}</h2>
        <p class="muted">${center.description}</p>
      </div>
      <div class="dialog-grid">
        <div class="detail-box"><strong>Рейтинг</strong><br>${center.rating.toFixed(1)} из 5</div>
        <div class="detail-box"><strong>Стоимость</strong><br>${formatPrice(center.price)} тг / месяц</div>
        <div class="detail-box"><strong>Адрес</strong><br>${center.address}</div>
        <div class="detail-box"><strong>Контакты</strong><br>${center.phone}</div>
        <div class="detail-box"><strong>Расписание</strong><br>${center.days.join(", ")} · ${center.time}</div>
        <div class="detail-box"><strong>Язык обучения</strong><br>${center.language}</div>
      </div>
      <button class="primary-btn" type="button">Записаться на пробное занятие</button>
    </div>
  `;
  els.dialog.showModal();
}

function showLogin(role = "parent") {
  els.loginForm.elements.role.value = role;
  els.loginEmail.value = demoAccounts[role].email;
  els.loginPassword.value = demoAccounts[role].password;
  els.loginMessage.textContent = "";
  els.loginDialog.showModal();
}

function createBadge(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "KC";
}

function createUserCenter(form) {
  const fields = form.elements;
  const minAge = Number(fields.centerAgeMin.value);
  const maxAge = Number(fields.centerAgeMax.value);
  const name = fields.centerName.value.trim();
  return {
    id: Date.now(),
    owner: state.user.email,
    name,
    category: fields.centerCategory.value,
    district: fields.centerDistrict.value,
    age: [Math.min(minAge, maxAge), Math.max(minAge, maxAge)],
    price: Number(fields.centerPrice.value),
    rating: 5.0,
    distance: Number((Math.random() * 8 + 0.6).toFixed(1)),
    trial: fields.centerTrial.checked,
    places: fields.centerPlaces.checked,
    online: fields.centerOnline.checked,
    days: ["Пн", "Ср", "Пт"],
    time: "10:00-19:00",
    language: "Русский, казахский",
    address: fields.centerAddress.value.trim(),
    phone: fields.centerPhone.value.trim(),
    description: fields.centerDescription.value.trim(),
    accent: "#6f7fcb",
    map: [Math.round(Math.random() * 70 + 15), Math.round(Math.random() * 55 + 20)],
    badge: createBadge(name),
  };
}

document.addEventListener("input", (event) => {
  if (event.target.closest(".filters") || event.target === els.sort) render();
});

document.addEventListener("change", (event) => {
  if (event.target.closest(".filters") || event.target === els.sort) render();
});

document.addEventListener("click", (event) => {
  const detailId = event.target.dataset.detail;
  const favId = event.target.dataset.fav;
  const compareId = event.target.dataset.compare;
  const demo = event.target.dataset.demo;

  if (detailId) openDetails(detailId);
  if (demo) showLogin(demo);

  if (favId) {
    if (!state.user || state.user.role !== "parent") {
      showLogin("parent");
      els.loginMessage.textContent = "Войдите как родитель, чтобы сохранять избранное.";
      return;
    }
    const id = Number(favId);
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    render();
  }

  if (compareId) {
    const id = Number(compareId);
    state.compare.has(id) ? state.compare.delete(id) : state.compare.add(id);
    render();
  }

  if (event.target.id === "resetFilters") {
    els.search.value = "";
    els.category.value = "all";
    els.district.value = "all";
    els.age.value = "all";
    els.price.value = "60000";
    els.trial.checked = false;
    els.places.checked = false;
    els.online.checked = false;
    render();
  }
});

els.openLogin.addEventListener("click", () => {
  if (state.user) {
    state.user = null;
    render();
    return;
  }
  showLogin("parent");
});

els.closeLogin.addEventListener("click", () => els.loginDialog.close());
document.querySelector("#closeDialog").addEventListener("click", () => els.dialog.close());

els.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const role = els.loginForm.elements.role.value;
  const account = demoAccounts[role];
  if (els.loginEmail.value.trim() !== account.email || els.loginPassword.value !== account.password) {
    els.loginMessage.textContent = "Неверный логин или пароль для выбранной роли.";
    return;
  }
  state.user = { role, email: account.email, name: account.name, roleLabel: account.roleLabel };
  els.loginDialog.close();
  render();
});

els.centerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.user || state.user.role !== "center") {
    showLogin("center");
    els.loginMessage.textContent = "Войдите как образовательный центр, чтобы добавить карточку.";
    return;
  }

  const center = createUserCenter(event.target);
  state.userCenters.unshift(center);
  event.target.reset();
  els.formMessage.textContent = "Карточка добавлена в каталог и сохранена в этом браузере.";
  render();
  document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" });
});

render();
