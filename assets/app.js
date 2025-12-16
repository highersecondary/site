function el(id){ return document.getElementById(id); }

function renderSchools(list){
  const wrap = el("schoolList");
  if(!wrap) return;
  wrap.innerHTML = "";

  if(list.length === 0){
    wrap.innerHTML = `<div class="card notice">No schools match your filters. Try clearing search or filters.</div>`;
    return;
  }

  for(const s of list){
    const card = document.createElement("div");
    card.className = "card school-card";
    card.innerHTML = `
      <h3>${escapeHtml(s.name)}</h3>
      <div class="meta">
        <span>${escapeHtml(s.level || "School")}</span>
        <span>${escapeHtml(s.area)}</span>
        <span>${escapeHtml(s.areaType)}</span>
      </div>
      <div class="hr"></div>
      <div class="small">
        <div><b>Address:</b> ${escapeHtml(s.address || "—")}</div>
        <div><b>Phone:</b> ${escapeHtml(s.phone || "—")}</div>
        ${s.notes ? `<div style="margin-top:8px;"><b>Notes:</b> ${escapeHtml(s.notes)}</div>` : ``}
      </div>
    `;
    wrap.appendChild(card);
  }
}

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function initSchoolsPage(){
  const data = window.SCHOOLS || [];

  const areaSelect = el("area");
  const levelSelect = el("level");
  const typeSelect = el("areaType");
  const searchInput = el("search");

  // Populate filters
  const areas = ["All", ...new Set(data.map(s => s.area).filter(Boolean))].sort();
  const levels = ["All", ...new Set(data.map(s => s.level).filter(Boolean))].sort();
  const types  = ["All", ...new Set(data.map(s => s.areaType).filter(Boolean))].sort();

  for(const a of areas){ areaSelect.add(new Option(a, a)); }
  for(const l of levels){ levelSelect.add(new Option(l, l)); }
  for(const t of types){ typeSelect.add(new Option(t, t)); }

  function apply(){
    const q = (searchInput.value || "").trim().toLowerCase();
    const area = areaSelect.value;
    const level = levelSelect.value;
    const areaType = typeSelect.value;

    const filtered = data.filter(s => {
      const matchesQ =
        !q ||
        (s.name || "").toLowerCase().includes(q) ||
        (s.address || "").toLowerCase().includes(q) ||
        (s.area || "").toLowerCase().includes(q);

      const matchesArea = (area === "All") || s.area === area;
      const matchesLevel = (level === "All") || s.level === level;
      const matchesType = (areaType === "All") || s.areaType === areaType;

      return matchesQ && matchesArea && matchesLevel && matchesType;
    });

    renderSchools(filtered);
    const count = el("count");
    if(count) count.textContent = `${filtered.length} school(s) found`;
  }

  ["change","input"].forEach(evt => {
    areaSelect.addEventListener(evt, apply);
    levelSelect.addEventListener(evt, apply);
    typeSelect.addEventListener(evt, apply);
    searchInput.addEventListener(evt, apply);
  });

  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  if(document.body.dataset.page === "schools"){
    initSchoolsPage();
  }
});
