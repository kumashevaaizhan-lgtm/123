const centers = [
  {
    id: 1,
    name: "EduStep Karaganda",
    category: "Образование",
    district: "Центр",
    age: [6, 14],
    price: 35000,
    rating: 4.8,
    distance: 1.2,
    format: ["Офлайн", "Групповые"],
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
    name: "Arman Football School",
    category: "Спорт",
    district: "Юго-Восток",
    age: [5, 13],
    price: 28000,
    rating: 4.6,
    distance: 3.7,
    format: ["Офлайн", "Групповые"],
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
    name: "ArtLab Studio",
    category: "Творчество",
    district: "Центр",
    age: [3, 16],
    price: 24000,
    rating: 4.9,
    distance: 0.8,
    format: ["Офлайн", "Индивидуальные"],
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
  {
    id: 4,
    name: "Qadam Robotics",
    category: "Образование",
    district: "Майкудук",
    age: [7, 15],
    price: 42000,
    rating: 4.7,
    distance: 6.1,
    format: ["Офлайн", "Групповые"],
    trial: false,
    places: true,
    online: true,
    days: ["Ср", "Пт", "Сб"],
    time: "14:00-19:30",
    language: "Казахский, русский",
    address: "ул. Магнитогорская, 12",
    phone: "+7 778 401 23 19",
    description: "Робототехника, Scratch, Python и олимпиадные задачи в малых группах.",
    accent: "#8a6f1f",
    map: [24, 32],
    badge: "RB",
  },
  {
    id: 5,
    name: "Balance Gym Kids",
    category: "Спорт",
    district: "Пришахтинск",
    age: [4, 12],
    price: 30000,
    rating: 4.4,
    distance: 8.5,
    format: ["Офлайн", "Групповые"],
    trial: true,
    places: true,
    online: false,
    days: ["Пн", "Чт", "Вс"],
    time: "09:00-17:00",
    language: "Русский",
    address: "ул. Зелинского, 4",
    phone: "+7 701 544 02 18",
    description: "Гимнастика, растяжка, координация и спортивная подготовка для детей.",
    accent: "#557f3d",
    map: [18, 72],
    badge: "GY",
  },
  {
    id: 6,
    name: "Voice & Stage",
    category: "Творчество",
    district: "Юго-Восток",
    age: [6, 17],
    price: 50000,
    rating: 4.9,
    distance: 4.4,
    format: ["Офлайн", "Индивидуальные"],
    trial: false,
    places: true,
    online: true,
    days: ["Вт", "Ср", "Сб"],
    time: "12:00-20:00",
    language: "Русский, казахский",
    address: "ул. Гапеева, 9",
    phone: "+7 747 812 39 92",
    description: "Вокал, актерское мастерство, сценическая речь и подготовка к конкурсам.",
    accent: "#aa4f7d",
    map: [77, 54],
    badge: "VS",
  },
];

const state = {
  favorites: new Set(),
  compare: new Set(),
};

const els = {
  search: document.querySelector("#searchInput"),
  category: document.querySelector("#categoryFilter"),
  age: document.querySelector("#ageFilter"),
  district: document.querySelector("#districtFilter"),
  price: document.querySelector("#priceFilter"),
  priceValue: document.querySelector("#priceValue"),
  rating: document.querySelector("#ratingFilter"),
  trial: document.querySelector("#trialFilter"),
  places: document.querySelector("#placesFilter"),
  online: document.querySelector("#onlineFilter"),
  group: document.querySelector("#groupFilter"),
  day: document.querySelector("#dayFilter"),
  sort: document.querySelector("#sortSelect"),
  cards: document.querySelector("#cards"),
  count: document.querySelector("#countLabel"),
  map: document.querySelector("#cityMap"),
  compare: document.querySelector("#compareList"),
  favoriteSummary: document.querySelector("#favoriteSummary"),
  dialog: document.querySelector("#centerDialog"),
  dialogContent: document.querySelector("#dialogContent"),
};

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function ageMatches(center, value) {
  if (value === "all") return true;
  const selected = Number(value);
  return selected >= center.age[0] && selected <= center.age[1];
}

function getFilteredCenters() {
  const query = els.search.value.trim().toLowerCase();
  const maxPrice = Number(els.price.value);
  const minRating = Number(els.rating.value);

  return centers
    .filter((center) => {
      const searchable = `${center.name} ${center.category} ${center.description}`.toLowerCase();
      return (
        (!query || searchable.includes(query)) &&
        (els.category.value === "all" || center.category === els.category.value) &&
        ageMatches(center, els.age.value) &&
        (els.district.value === "all" || center.district === els.district.value) &&
        center.price <= maxPrice &&
        center.rating >= minRating &&
        (!els.trial.checked || center.trial) &&
        (!els.places.checked || center.places) &&
        (!els.online.checked || center.online) &&
        (!els.group.checked || center.format.includes("Групповые")) &&
        (els.day.value === "all" || center.days.includes(els.day.value))
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
  const selected = centers.filter((center) => state.compare.has(center.id));
  els.compare.innerHTML = selected.length
    ? selected.map((center) => `<div class="compare-item"><span>${center.name}</span><strong>${formatPrice(center.price)} тг</strong></div>`).join("")
    : '<div class="muted">Добавьте центры кнопкой ≡</div>';
}

function renderProfile() {
  const favs = centers.filter((center) => state.favorites.has(center.id));
  els.favoriteSummary.textContent = favs.length
    ? favs.map((center) => center.name).join(", ")
    : "Пока нет сохраненных центров";
}

function render() {
  els.priceValue.textContent = formatPrice(Number(els.price.value));
  const list = getFilteredCenters();
  els.count.textContent = `${list.length} ${list.length === 1 ? "вариант" : "вариантов"}`;
  renderCards(list);
  renderMap(list);
  renderCompare();
  renderProfile();
}

function openDetails(id) {
  const center = centers.find((item) => item.id === Number(id));
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

document.addEventListener("input", (event) => {
  if (event.target.matches("input, select")) render();
});

document.addEventListener("change", (event) => {
  if (event.target.matches("input, select")) render();
});

document.addEventListener("click", (event) => {
  const detailId = event.target.dataset.detail;
  const favId = event.target.dataset.fav;
  const compareId = event.target.dataset.compare;
  const scrollId = event.target.dataset.scroll;

  if (detailId) openDetails(detailId);

  if (favId) {
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
    els.age.value = "all";
    els.district.value = "all";
    els.price.value = "60000";
    els.rating.value = "0";
    els.trial.checked = false;
    els.places.checked = false;
    els.online.checked = false;
    els.group.checked = false;
    els.day.value = "all";
    render();
  }

  if (scrollId) document.querySelector(`#${scrollId}`).scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#quickSearch").addEventListener("click", render);
document.querySelector("#closeDialog").addEventListener("click", () => els.dialog.close());

render();
