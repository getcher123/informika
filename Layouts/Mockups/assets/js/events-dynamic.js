/* EVENTS-DYNAMIC.JS - рендер календаря и лент из списка данных */

document.addEventListener('DOMContentLoaded', () => {
  const view = document.querySelector('[data-events-view]');
  if (!view) return;

  const debugBlock = view.querySelector('[data-events-debug]');
  const showError = (message, error) => {
    if (debugBlock) {
      debugBlock.textContent = message;
      debugBlock.hidden = false;
    }
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  };

  const dataList = view.querySelector('.events-data');
  if (!dataList) {
    showError('Не найден источник данных событий (.events-data).');
    return;
  }

  const currentDateStr = view.dataset.currentDate || new Date().toISOString().slice(0, 10);
  const calendarGrid = view.querySelector('.js-calendar-grid');
  const calendarTitle = view.querySelector('[data-calendar-title]');
  const calendarPrev = view.querySelector('[data-calendar-prev]');
  const calendarNext = view.querySelector('[data-calendar-next]');
  const listContainers = view.querySelectorAll('.js-events-list');
  const searchInput = view.querySelector('[data-search-input]');
  const formatButtons = view.querySelectorAll('[data-filter-format]');
  const typeSelect = view.querySelector('[data-filter-type]');

  let events = [];
  try {
    events = Array.from(dataList.querySelectorAll('li')).map(parseEvent).filter(Boolean);
  } catch (error) {
    showError('Ошибка при чтении списка событий.', error);
    return;
  }

  const filters = {
    format: 'all',
    type: 'all',
    query: ''
  };

  const typeMap = {
    webinar: {
      label: 'Вебинар',
      badgeClass: 'badge--primary',
      calendarClass: 'calendar-event--webinar'
    },
    pitch: {
      label: 'Питч‑сессия',
      badgeClass: 'badge--purple',
      calendarClass: 'calendar-event--pitch'
    },
    demo: {
      label: 'Демо‑день',
      badgeClass: 'badge--warning',
      calendarClass: 'calendar-event--demo'
    },
    meeting: {
      label: 'Встреча проектных команд',
      badgeClass: 'badge--success',
      calendarClass: 'calendar-event--meeting'
    },
    other: {
      label: 'Другое',
      badgeClass: 'badge--gray',
      calendarClass: ''
    }
  };

  const formatMap = {
    online: 'Онлайн',
    offline: 'Офлайн'
  };

  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ];

  const currentDate = parseDateTime(currentDateStr, '00:00');

  const applyFilters = (items) => {
    let filtered = [...items];

    if (filters.format !== 'all') {
      filtered = filtered.filter(event => event.format === filters.format);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(event => event.type === filters.type);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(event => event.title.toLowerCase().includes(query));
    }

    return filtered;
  };

  const updateFormatButtons = (activeValue) => {
    formatButtons.forEach(button => {
      button.classList.toggle('filter-pill--active', button.dataset.filterFormat === activeValue);
    });
  };

  const getFilteredEvents = () => applyFilters(events);

  const renderAll = () => {
    const filtered = getFilteredEvents();
    renderCalendar(filtered);
    renderLists(filtered);
  };

  const renderCalendarOnly = () => {
    renderCalendar(getFilteredEvents());
  };

  const renderCalendar = (items) => {
    if (!calendarGrid) return;

    const monthAttr = calendarGrid.dataset.calendarMonth || currentDateStr.slice(0, 7);
    const [year, month] = monthAttr.split('-').map(Number);
    updateCalendarControls(year, month);
    buildCalendarGrid(calendarGrid, year, month, currentDateStr);

    const eventsInMonth = items.filter(event => event.date.startsWith(monthAttr));
    eventsInMonth.sort((a, b) => a.startDate - b.startDate);

    eventsInMonth.forEach(event => {
      const dayCell = calendarGrid.querySelector(`[data-date="${event.date}"]`);
      if (!dayCell) return;
      dayCell.appendChild(buildCalendarEvent(event));
    });
  };

  const renderLists = (items) => {
    listContainers.forEach(container => {
      const mode = container.dataset.eventsList;
      const isPastMode = mode === 'past';
      const filtered = items.filter(event => isPast(event) === isPastMode);
      filtered.sort((a, b) => isPastMode ? b.startDate - a.startDate : a.startDate - b.startDate);
      container.innerHTML = '';

      if (!filtered.length) {
        const empty = document.createElement('p');
        empty.className = 'events-empty';
        empty.textContent = 'События не найдены.';
        container.appendChild(empty);
        return;
      }

      filtered.forEach(event => {
        container.appendChild(buildListCard(event, isPastMode));
      });
    });
  };

  const isPast = (event) => {
    const compareDate = event.endDate || event.startDate;
    return compareDate < currentDate;
  };

  const buildCalendarGrid = (container, year, month, todayStr) => {
    container.innerHTML = '';
    const firstDay = new Date(year, month - 1, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const totalCells = 42;

    for (let i = 0; i < totalCells; i += 1) {
      const cellDate = new Date(year, month - 1, 1 - startOffset + i);
      const cellDateStr = formatDate(cellDate);
      const isMuted = cellDate.getMonth() !== month - 1;
      const isToday = cellDateStr === todayStr;

      const day = document.createElement('div');
      day.className = 'calendar-day';
      if (isMuted) day.classList.add('calendar-day--muted');
      if (isToday) day.classList.add('calendar-day--today');
      day.dataset.date = cellDateStr;

      const dateEl = document.createElement('span');
      dateEl.className = 'calendar-day__date';
      dateEl.textContent = cellDate.getDate();

      day.appendChild(dateEl);
      container.appendChild(day);
    }
  };

  const buildCalendarEvent = (event) => {
    const typeConfig = typeMap[event.type] || typeMap.other;
    const wrapper = document.createElement('div');
    wrapper.className = 'calendar-event';
    if (typeConfig.calendarClass) wrapper.classList.add(typeConfig.calendarClass);
    if (event.status === 'cancelled') wrapper.classList.add('calendar-event--danger');
    wrapper.dataset.tooltip = event.title;

    const time = document.createElement('span');
    time.className = 'calendar-event__time';
    time.textContent = formatTimeRange(event.start, event.end);

    const badge = document.createElement('span');
    badge.className = event.status === 'cancelled' ? 'badge badge--cancelled' : 'badge badge--format';
    badge.textContent = event.status === 'cancelled' ? 'Отменено' : formatMap[event.format] || 'Формат';

    const title = document.createElement('a');
    title.className = 'calendar-event__title';
    title.href = event.url;
    title.textContent = event.title;

    wrapper.appendChild(time);
    wrapper.appendChild(badge);
    wrapper.appendChild(title);

    return wrapper;
  };

  const buildListCard = (event, isPastMode) => {
    const typeConfig = typeMap[event.type] || typeMap.other;
    const article = document.createElement('article');
    article.className = 'card event-card';

    const meta = document.createElement('div');
    meta.className = 'event-card__meta';

    const dateBadge = document.createElement('span');
    dateBadge.className = 'badge badge--date badge--deadline-muted';
    const dateText = `${formatShortDate(event.date)} · ${formatTimeRange(event.start, event.end)}`;
    if (isPastMode && event.status !== 'cancelled') {
      dateBadge.innerHTML = `<strong>Завершено</strong> · ${dateText}`;
    } else {
      dateBadge.textContent = dateText;
    }

    meta.appendChild(dateBadge);

    const formatBadge = document.createElement('span');
    formatBadge.className = event.status === 'cancelled' ? 'badge badge--cancelled' : 'badge badge--format';
    formatBadge.textContent = event.status === 'cancelled' ? 'Отменено' : formatMap[event.format] || 'Формат';
    meta.appendChild(formatBadge);

    const typeBadge = document.createElement('span');
    typeBadge.className = `badge ${typeConfig.badgeClass}`.trim();
    typeBadge.textContent = typeConfig.label;
    meta.appendChild(typeBadge);

    const title = document.createElement('h3');
    title.className = 'heading-section event-card__title';
    title.innerHTML = `<a class="event-card__title-link" href="${event.url}">${event.title}</a>`;

    const body = document.createElement('div');
    body.className = 'event-card__body';

    const details = document.createElement('div');
    details.className = 'event-card__details';
    const detailItems = [];

    if (event.status === 'cancelled') {
      if (event.cancelReason) {
        detailItems.push(`Причина отмены: ${event.cancelReason}`);
      }
    } else {
      if (event.format === 'online' && event.link) {
        detailItems.push(`Ссылка: ${event.link}`);
      }
      if (event.format === 'offline' && event.location) {
        detailItems.push(`Адрес: ${event.location}`);
      }
      if (event.speakers) {
        detailItems.push(`Спикеры: ${event.speakers}`);
      }
    }

    if (event.note) {
      detailItems.push(event.note);
    }

    if (!detailItems.length) {
      detailItems.push('Подробности будут опубликованы организатором.');
    }

    detailItems.forEach(text => {
      const item = document.createElement('p');
      item.className = 'text-muted';
      item.textContent = text;
      details.appendChild(item);
    });

    const actions = document.createElement('div');
    actions.className = 'event-card__actions';
    actions.innerHTML = `<a class="btn btn--primary btn--sm" href="${event.url}">Подробнее</a>`;

    body.appendChild(details);
    body.appendChild(actions);

    article.appendChild(meta);
    article.appendChild(title);
    article.appendChild(body);

    return article;
  };

  function parseEvent(item) {
    if (!item.dataset.date || !item.dataset.start || !item.dataset.title) return null;
    const startDate = parseDateTime(item.dataset.date, item.dataset.start);
    const endDate = item.dataset.end ? parseDateTime(item.dataset.date, item.dataset.end) : null;

    return {
      id: item.dataset.id || item.dataset.title,
      title: item.dataset.title,
      date: item.dataset.date,
      start: item.dataset.start,
      end: item.dataset.end || '',
      startDate,
      endDate,
      type: item.dataset.type || 'other',
      format: item.dataset.format || 'online',
      status: item.dataset.status || 'published',
      url: item.dataset.url || '#',
      link: item.dataset.link || '',
      location: item.dataset.location || '',
      speakers: item.dataset.speakers || '',
      note: item.dataset.note || '',
      cancelReason: item.dataset.cancelReason || ''
    };
  }

  function getCalendarMonth() {
    if (!calendarGrid) {
      const [year, month] = currentDateStr.slice(0, 7).split('-').map(Number);
      return { year, month };
    }
    const monthAttr = calendarGrid.dataset.calendarMonth || currentDateStr.slice(0, 7);
    const [year, month] = monthAttr.split('-').map(Number);
    return { year, month };
  }

  function setCalendarMonth(year, month) {
    if (!calendarGrid) return;
    const monthStr = String(month).padStart(2, '0');
    calendarGrid.dataset.calendarMonth = `${year}-${monthStr}`;
    updateCalendarControls(year, month);
  }

  function updateCalendarControls(year, month) {
    if (calendarTitle) {
      calendarTitle.textContent = `${monthNames[month - 1]} ${year}`;
    }
    const prev = shiftMonth(year, month, -1);
    const next = shiftMonth(year, month, 1);
    if (calendarPrev) {
      calendarPrev.textContent = `← ${monthNames[prev.month - 1]}`;
    }
    if (calendarNext) {
      calendarNext.textContent = `${monthNames[next.month - 1]} →`;
    }
  }

  function shiftMonth(year, month, delta) {
    const date = new Date(year, month - 1 + delta, 1);
    return { year: date.getFullYear(), month: date.getMonth() + 1 };
  }

  function parseDateTime(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}`);
  }

  function formatShortDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}`;
  }

  function formatTimeRange(start, end) {
    return end ? `${start}–${end}` : start;
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (calendarPrev) {
    calendarPrev.addEventListener('click', () => {
      const { year, month } = getCalendarMonth();
      const prev = shiftMonth(year, month, -1);
      setCalendarMonth(prev.year, prev.month);
      renderCalendarOnly();
    });
  }

  if (calendarNext) {
    calendarNext.addEventListener('click', () => {
      const { year, month } = getCalendarMonth();
      const next = shiftMonth(year, month, 1);
      setCalendarMonth(next.year, next.month);
      renderCalendarOnly();
    });
  }

  formatButtons.forEach(button => {
    button.addEventListener('click', () => {
      filters.format = button.dataset.filterFormat || 'all';
      updateFormatButtons(filters.format);
      renderAll();
    });
  });

  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      filters.type = typeSelect.value || 'all';
      renderAll();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filters.query = searchInput.value.trim();
      renderAll();
    });
  }

  try {
    updateFormatButtons(filters.format);
    if (calendarGrid) {
      const { year, month } = getCalendarMonth();
      setCalendarMonth(year, month);
    }
    renderAll();
    if (debugBlock) {
      debugBlock.hidden = true;
    }
  } catch (error) {
    showError('Ошибка при рендере календаря или лент.', error);
  }
});
