// Minimal line icons (24×24, stroke = currentColor).

const PATHS = {
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z",
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  cap: "M2 9l10-5 10 5-10 5z M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5 M22 9v6",
  family: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2 21v-1.5A4.5 4.5 0 0 1 6.5 15h5a4.5 4.5 0 0 1 4.5 4.5V21 M17 11a2.5 2.5 0 1 0 0-5 M19 15.5a3.5 3.5 0 0 1 3 3.5v2",
  wallet: "M3 7a2 2 0 0 1 2-2h13v4 M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z M16.5 14.5h.01",
  receipt: "M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2z M9 7h6 M9 11h6 M9 15h4",
  train: "M6 15V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z M6 10h12 M9 21l1.5-4 M15 21l-1.5-4 M9.5 13.5h.01 M14.5 13.5h.01",
  city: "M3 21h18 M5 21V9l7-5 7 5v12 M9 21v-5h6v5 M9 11h.01 M15 11h.01",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z",
  lock: "M6 11h12v10H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  code: "M8 7l-5 5 5 5 M16 7l5 5-5 5 M13.5 4l-3 16",
  arrow: "M7 17 17 7 M9 7h8v8",
  student: "M12 3l9 4.5-9 4.5-9-4.5z M6 9.5V15c0 1.7 2.7 3 6 3s6-1.3 6-3V9.5",
  people: "M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M1.5 20.5v-1A4.5 4.5 0 0 1 6 15h4a4.5 4.5 0 0 1 4.5 4.5v1 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18 15a4.5 4.5 0 0 1 4.5 4.5v1",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 7.5h.01",
  loan: "M4 10h16 M5 10V8l7-4 7 4v2 M6 10v8 M10 10v8 M14 10v8 M18 10v8 M3 21h18",
};

export function icon(name, cls = "") {
  const d = PATHS[name] || PATHS.info;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}

export const chevron = `<svg class="chev" viewBox="0 0 9 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 1.5 7.5 7.5l-6 6"/></svg>`;

export const check = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7"/></svg>`;

export const external = `<svg class="ext" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 2h6v6 M10 2 3 9"/></svg>`;
