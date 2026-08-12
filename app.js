const STORAGE_KEY = "plain-lift-log-v2";

const defaultExercises = {
  어깨: ["숄더 프레스", "사이드 레터럴 레이즈", "리어 델트 플라이", "업라이트 로우"],
  가슴: [
    "바벨 벤치 프레스",
    "인클라인 스미스 머신 벤치 프레스",
    "스미스 머신 벤치 프레스",
    "덤벨 체스트 플라이",
    "해머 스트렝스 체스트 프레스 머신",
    "머신 펙덱 (팔 편 VER)",
  ],
  등: ["랫 풀다운", "바벨 로우", "시티드 로우", "풀업"],
  복근: ["크런치", "레그 레이즈", "케이블 크런치", "플랭크"],
  하체: ["스쿼트", "레그 프레스", "루마니안 데드리프트", "레그 컬"],
};

const defaultPrescription = [
  { id: crypto.randomUUID(), type: "warmup", rir: "6 RIR", weight: "47.1", reps: "6", completed: false },
  { id: crypto.randomUUID(), type: "warmup", rir: "5 RIR", weight: "49.1", reps: "5", completed: false },
  { id: crypto.randomUUID(), type: "top", rir: "1 RIR", weight: "54.3", reps: "4-7", completed: false },
  { id: crypto.randomUUID(), type: "working", rir: "1 RIR", weight: "55", reps: "5-6", completed: false },
  { id: crypto.randomUUID(), type: "working", rir: "1 RIR", weight: "45", reps: "8-9", completed: false },
];

const state = {
  data: loadData(),
  activeRoutineId: null,
  activeCategory: "가슴",
  selectedExercise: null,
  editingRoutineId: null,
  calendarDate: new Date(),
  selectedCalendarDate: toDateInputValue(new Date()),
  timerId: null,
  timerRemaining: 0,
};

const els = {
  restBanner: document.querySelector("#restBanner"),
  restCountdown: document.querySelector("#restCountdown"),
  stopTimerButton: document.querySelector("#stopTimerButton"),
  restSeconds: document.querySelector("#restSeconds"),
  homeScreen: document.querySelector("#homeScreen"),
  routineScreen: document.querySelector("#routineScreen"),
  detailScreen: document.querySelector("#detailScreen"),
  calendarScreen: document.querySelector("#calendarScreen"),
  progressScreen: document.querySelector("#progressScreen"),
  routineForm: document.querySelector("#routineForm"),
  routineTitle: document.querySelector("#routineTitle"),
  routineList: document.querySelector("#routineList"),
  routineEditor: document.querySelector("#routineEditor"),
  closeRoutineEditor: document.querySelector("#closeRoutineEditor"),
  editingRoutineTitle: document.querySelector("#editingRoutineTitle"),
  selectedRoutineExercises: document.querySelector("#selectedRoutineExercises"),
  inlineExerciseForm: document.querySelector("#inlineExerciseForm"),
  inlineExerciseName: document.querySelector("#inlineExerciseName"),
  routineCategoryStrip: document.querySelector("#routineCategoryStrip"),
  routineExercisePicker: document.querySelector("#routineExercisePicker"),
  saveRoutineButton: document.querySelector("#saveRoutineButton"),
  routineName: document.querySelector("#routineName"),
  todayRoutineSummary: document.querySelector("#todayRoutineSummary"),
  exerciseList: document.querySelector("#exerciseList"),
  finishWorkoutButton: document.querySelector("#finishWorkoutButton"),
  backButton: document.querySelector("#backButton"),
  exerciseHero: document.querySelector("#exerciseHero"),
  detailRoutineName: document.querySelector("#detailRoutineName"),
  detailExerciseName: document.querySelector("#detailExerciseName"),
  completionPill: document.querySelector("#completionPill"),
  previousTopSet: document.querySelector("#previousTopSet"),
  warmupSetList: document.querySelector("#warmupSetList"),
  topSetList: document.querySelector("#topSetList"),
  workingSetList: document.querySelector("#workingSetList"),
  addSetButton: document.querySelector("#addSetButton"),
  removeSetButton: document.querySelector("#removeSetButton"),
  bottomNavButtons: document.querySelectorAll(".bottom-nav button"),
  calendarMonthLabel: document.querySelector("#calendarMonthLabel"),
  calendarGrid: document.querySelector("#calendarGrid"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
  selectedDayTitle: document.querySelector("#selectedDayTitle"),
  dayLogList: document.querySelector("#dayLogList"),
  progressExercise: document.querySelector("#progressExercise"),
  progressChart: document.querySelector("#progressChart"),
  progressSummary: document.querySelector("#progressSummary"),
  exerciseDialog: document.querySelector("#exerciseDialog"),
  exerciseForm: document.querySelector("#exerciseForm"),
  newExerciseCategory: document.querySelector("#newExerciseCategory"),
  newExerciseName: document.querySelector("#newExerciseName"),
  cancelExercise: document.querySelector("#cancelExercise"),
};

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return normalizeData(JSON.parse(saved));
  }

  const routineId = crypto.randomUUID();
  return {
    selectedRoutineId: routineId,
    routines: [
      {
        id: routineId,
        title: "Day 1a",
        createdAt: new Date().toISOString(),
        exerciseItems: defaultRoutineItems(),
      },
    ],
    exercises: defaultExercises,
    logs: [
      {
        id: crypto.randomUUID(),
        routineId,
        routineTitle: "Day 1a",
        category: "가슴",
        exercise: "인클라인 스미스 머신 벤치 프레스",
        weight: 50,
        reps: 8,
        date: toDateInputValue(addDays(new Date(), -7)),
        createdAt: addDays(new Date(), -7).toISOString(),
      },
    ],
    activeSets: {},
  };
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function init() {
  state.activeRoutineId = state.data.selectedRoutineId ?? state.data.routines[0]?.id ?? null;
  renderAll();
  bindEvents();
}

function bindEvents() {
  els.routineForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = els.routineTitle.value.trim();
    if (!title) return;
    const routine = { id: crypto.randomUUID(), title, createdAt: new Date().toISOString(), exerciseItems: [] };
    state.data.routines.unshift(routine);
    state.editingRoutineId = routine.id;
    state.activeCategory = "어깨";
    els.routineTitle.value = "";
    saveData();
    renderAll();
    openRoutineEditor(routine.id);
  });

  els.routineList.addEventListener("click", (event) => {
    const chooseButton = event.target.closest("button[data-choose-routine]");
    if (chooseButton) {
      state.activeRoutineId = chooseButton.dataset.chooseRoutine;
      state.data.selectedRoutineId = state.activeRoutineId;
      state.selectedExercise = null;
      saveData();
      renderAll();
      showScreen("home");
      return;
    }

    const deleteButton = event.target.closest("button[data-delete-routine]");
    if (deleteButton) {
      deleteRoutine(deleteButton.dataset.deleteRoutine);
      return;
    }

    const editButton = event.target.closest("button[data-edit-routine]");
    if (editButton) {
      openRoutineEditor(editButton.dataset.editRoutine);
    }
  });

  els.closeRoutineEditor.addEventListener("click", () => {
    closeRoutineEditor();
  });

  els.saveRoutineButton.addEventListener("click", () => {
    closeRoutineEditor();
    saveData();
  });

  els.routineCategoryStrip.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    state.activeCategory = button.dataset.category;
    renderRoutineEditor();
  });

  els.routineExercisePicker.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-routine-exercise]");
    if (!button) return;
    toggleExerciseInEditingRoutine(button.dataset.category, button.dataset.routineExercise);
    saveData();
    renderRoutineEditor();
  });

  els.selectedRoutineExercises.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove-exercise]");
    if (!button) return;
    removeExerciseFromEditingRoutine(button.dataset.category, button.dataset.removeExercise);
    saveData();
    renderRoutineEditor();
  });

  els.inlineExerciseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addInlineExerciseToRoutine();
  });

  els.finishWorkoutButton.addEventListener("click", () => {
    finishWorkout();
  });

  els.exerciseList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-exercise]");
    if (!button) return;
    state.selectedExercise = button.dataset.exercise;
    state.activeCategory = button.dataset.category;
    showScreen("detail");
    renderDetail();
  });

  els.backButton.addEventListener("click", () => {
    showScreen("home");
    renderHome();
  });

  els.exerciseHero.addEventListener("click", (event) => {
    if (event.target.closest(".more-button")) return;
    showScreen("home");
    renderHome();
  });

  els.exerciseHero.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    showScreen("home");
    renderHome();
  });

  els.warmupSetList.addEventListener("input", updateSetFromInput);
  els.topSetList.addEventListener("input", updateSetFromInput);
  els.workingSetList.addEventListener("input", updateSetFromInput);
  els.warmupSetList.addEventListener("click", handleSetClick);
  els.topSetList.addEventListener("click", handleSetClick);
  els.workingSetList.addEventListener("click", handleSetClick);

  els.addSetButton.addEventListener("click", () => {
    getCurrentSets().push({
      id: crypto.randomUUID(),
      type: "working",
      rir: "1 RIR",
      weight: "",
      reps: "",
      completed: false,
    });
    saveData();
    renderDetail();
  });

  els.removeSetButton.addEventListener("click", () => {
    const sets = getCurrentSets();
    const index = sets.map((set) => set.type).lastIndexOf("working");
    if (index >= 0) {
      sets.splice(index, 1);
      saveData();
      renderDetail();
    }
  });

  els.bottomNavButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.view);
    });
  });

  els.prevMonth.addEventListener("click", () => {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() - 1, 1);
    renderCalendar();
  });

  els.nextMonth.addEventListener("click", () => {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 1);
    renderCalendar();
  });

  els.calendarGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-date]");
    if (!button) return;
    state.selectedCalendarDate = button.dataset.date;
    renderCalendar();
  });

  els.progressExercise.addEventListener("change", renderProgress);
  els.stopTimerButton.addEventListener("click", stopRestTimer);

  els.cancelExercise.addEventListener("click", () => els.exerciseDialog.close());

  els.exerciseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const category = els.newExerciseCategory.value;
    const name = els.newExerciseName.value.trim();
    if (!category || !name) return;
    if (!state.data.exercises[category].includes(name)) {
      state.data.exercises[category].push(name);
    }
    state.activeCategory = category;
    state.selectedExercise = name;
    els.newExerciseName.value = "";
    els.exerciseDialog.close();
    saveData();
    renderAll();
    showScreen("detail");
  });
}

function renderAll() {
  renderHome();
  renderRoutines();
  renderDetail();
  renderCalendar();
  renderProgressOptions();
  renderProgress();
}

function renderHome() {
  const routine = getActiveRoutine();
  els.routineName.textContent = routine?.title ?? "Day 1a";
  const items = routine?.exerciseItems ?? [];
  els.todayRoutineSummary.textContent = items.length
    ? `${items.length}개 종목으로 오늘 운동을 시작합니다.`
    : "루틴 탭에서 이 루틴에 운동 종목을 추가하세요.";

  els.exerciseList.innerHTML = items.length
    ? items
        .map((item) => {
          const best = getBestForExercise(item.category, item.exercise);
          return `
        <button class="exercise-button" data-category="${escapeAttr(item.category)}" data-exercise="${escapeAttr(item.exercise)}" type="button">
          <span>
            <strong>${escapeHtml(item.exercise)}</strong>
            <span>${escapeHtml(item.category)} · ${best ? `최고 ${best.weight}kg / ${best.reps}회` : "아직 기록 없음"}</span>
          </span>
          <span class="arrow">›</span>
        </button>
      `;
        })
        .join("")
    : `<div class="empty-list">아직 이 루틴에 담긴 운동이 없습니다.</div>`;
}

function renderRoutines() {
  els.routineList.classList.toggle("hidden", Boolean(state.editingRoutineId));
  els.routineEditor.classList.toggle("hidden", !state.editingRoutineId);
  els.routineList.innerHTML = state.data.routines
    .map((routine) => {
      const isActive = routine.id === state.activeRoutineId;
      const itemCount = routine.exerciseItems?.length ?? 0;
      return `
        <article class="routine-card${isActive ? " active" : ""}" data-routine-card="${routine.id}">
          <span>
            <strong>${escapeHtml(routine.title)}</strong>
            <small>${itemCount}개 종목${isActive ? " · 오늘 선택됨" : ""}</small>
          </span>
          <span class="routine-actions">
            <button data-edit-routine="${routine.id}" type="button">편집</button>
            <button class="choose-action" data-choose-routine="${routine.id}" type="button">${isActive ? "기록" : "선택"}</button>
            <button class="danger-action" data-delete-routine="${routine.id}" type="button">삭제</button>
          </span>
        </article>
      `;
    })
    .join("");
  if (state.editingRoutineId) renderRoutineEditor();
}

function renderDetail() {
  const routine = getActiveRoutine();
  const firstItem = routine?.exerciseItems?.[0];
  let activeItem = routine?.exerciseItems?.find(
    (item) => item.category === state.activeCategory && item.exercise === state.selectedExercise,
  );
  if (!activeItem) {
    activeItem = firstItem;
  }
  if (!activeItem) return;
  state.selectedExercise = activeItem.exercise;
  state.activeCategory = activeItem.category;

  els.detailRoutineName.textContent = routine?.title ?? "Day 1a";
  els.detailExerciseName.textContent = activeItem.exercise;

  const sets = getCurrentSets();
  const completed = sets.filter((set) => set.completed).length;
  els.completionPill.textContent = `${completed}/${sets.length} 완료`;

  const previous = getPreviousTopSet(state.activeCategory, activeItem.exercise);
  els.previousTopSet.innerHTML = previous
    ? `지난주 탑 세트 <span>중량 <strong>${previous.weight}kg</strong></span><span>횟수 <strong>${previous.reps}회</strong></span>`
    : "지난주 탑 세트 <strong>기록 없음</strong>";

  renderSetGroup(els.warmupSetList, sets.filter((set) => set.type === "warmup"));
  renderSetGroup(els.topSetList, sets.filter((set) => set.type === "top"));
  renderSetGroup(els.workingSetList, sets.filter((set) => set.type === "working"));
}

function renderSetGroup(container, sets) {
  container.innerHTML = sets
    .map(
      (set) => `
        <div class="set-row${set.completed ? " completed" : ""}" data-set-id="${set.id}">
          <span class="rir">${escapeHtml(set.rir)}</span>
          <input data-field="weight" inputmode="decimal" value="${escapeAttr(set.weight)}" placeholder="0" />
          <input data-field="reps" inputmode="numeric" value="${escapeAttr(set.reps)}" placeholder="0" />
          <button class="check-button" data-check="${set.id}" type="button" aria-label="세트 완료">✓</button>
        </div>
      `,
    )
    .join("");
}

function updateSetFromInput(event) {
  const input = event.target.closest("input[data-field]");
  if (!input) return;
  const row = input.closest(".set-row");
  const set = getCurrentSets().find((item) => item.id === row.dataset.setId);
  if (!set) return;
  set[input.dataset.field] = input.value;
  saveData();
}

function handleSetClick(event) {
  const button = event.target.closest("button[data-check]");
  if (!button) return;
  const set = getCurrentSets().find((item) => item.id === button.dataset.check);
  if (!set) return;
  set.completed = !set.completed;
  saveCompletedSet(set);
  saveData();
  renderAll();
  startRestTimer(Number(els.restSeconds.value));
}

function saveCompletedSet(set) {
  if (!set.completed) return;
  const routine = getActiveRoutine();
  const weight = Number.parseFloat(set.weight);
  const reps = Number.parseInt(set.reps, 10);
  if (!routine || Number.isNaN(weight) || Number.isNaN(reps)) return;
  state.data.logs.push({
    id: crypto.randomUUID(),
    routineId: routine.id,
    routineTitle: routine.title,
    category: state.activeCategory,
    exercise: state.selectedExercise,
    weight,
    reps,
    date: toDateInputValue(new Date()),
    createdAt: new Date().toISOString(),
  });
}

function startRestTimer(seconds) {
  state.timerRemaining = seconds;
  els.restBanner.classList.remove("hidden");
  updateTimerText();
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.timerRemaining -= 1;
    updateTimerText();
    if (state.timerRemaining <= 0) {
      stopRestTimer();
    }
  }, 1000);
}

function stopRestTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
  state.timerRemaining = 0;
  els.restBanner.classList.add("hidden");
}

function updateTimerText() {
  els.restCountdown.textContent = formatTimer(Math.max(0, state.timerRemaining));
}

function showScreen(name) {
  if (name !== "routine") {
    state.editingRoutineId = null;
  }
  const screens = {
    home: els.homeScreen,
    routine: els.routineScreen,
    detail: els.detailScreen,
    calendar: els.calendarScreen,
    progress: els.progressScreen,
  };
  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle("active", key === name);
  });
  els.bottomNavButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name || (name === "detail" && button.dataset.view === "home"));
  });
  if (name === "calendar") renderCalendar();
  if (name === "progress") renderProgress();
  if (name === "routine") renderRoutines();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderCalendar() {
  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  els.calendarMonthLabel.textContent = `${year}년 ${month + 1}월`;
  els.calendarGrid.innerHTML = "";

  ["월", "화", "수", "목", "금", "토", "일"].forEach((day) => {
    els.calendarGrid.insertAdjacentHTML("beforeend", `<div class="weekday">${day}</div>`);
  });

  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - startOffset);

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dateKey = toDateInputValue(date);
    const logs = logsForDate(dateKey);
    els.calendarGrid.insertAdjacentHTML(
      "beforeend",
      `<button class="day-cell${date.getMonth() === month ? "" : " muted"}${dateKey === state.selectedCalendarDate ? " active" : ""}" data-date="${dateKey}" type="button">
        <strong>${date.getDate()}</strong>${logs.length ? '<span class="dot"></span>' : ""}
      </button>`,
    );
  }

  const selectedLogs = logsForDate(state.selectedCalendarDate);
  els.selectedDayTitle.textContent = formatKoreanDate(state.selectedCalendarDate);
  els.dayLogList.innerHTML = selectedLogs.length
    ? selectedLogs
        .map(
          (log) => `
            <div class="log-row">
              <div>
                <strong>${escapeHtml(log.exercise)}</strong>
                <p>${escapeHtml(log.routineTitle)} · ${escapeHtml(log.category)}</p>
              </div>
              <strong>${log.weight}kg / ${log.reps}회</strong>
            </div>
          `,
        )
        .join("")
    : "<p>이 날의 기록이 아직 없습니다.</p>";
}

function renderProgressOptions() {
  const exercises = getAllExerciseNames();
  const value = els.progressExercise.value || state.selectedExercise || exercises[0] || "";
  els.progressExercise.innerHTML = exercises
    .map((exercise) => `<option value="${escapeAttr(exercise)}">${escapeHtml(exercise)}</option>`)
    .join("");
  els.progressExercise.value = exercises.includes(value) ? value : exercises[0] ?? "";
}

function renderProgress() {
  const exercise = els.progressExercise.value || getAllExerciseNames()[0] || "";
  const logs = state.data.logs
    .filter((log) => log.exercise === exercise)
    .sort((a, b) => a.date.localeCompare(b.date));
  const points = [];
  logs.forEach((log) => {
    const last = points.at(-1);
    points.push({ date: log.date, weight: Math.max(log.weight, last?.weight ?? 0), category: log.category });
  });
  drawChart(points, exercise || "운동");

  if (!points.length) {
    els.progressSummary.textContent = exercise ? `${exercise} 기록이 아직 없습니다.` : "아직 그래프로 볼 기록이 없습니다.";
    return;
  }
  const first = points[0];
  const last = points.at(-1);
  els.progressSummary.textContent = `${exercise} 최고 중량은 ${first.weight}kg에서 ${last.weight}kg까지 기록되어 있습니다.`;
}

function drawChart(points, category) {
  const canvas = els.progressChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#e0e5df";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(54, 48);
  ctx.lineTo(54, height - 54);
  ctx.lineTo(width - 42, height - 54);
  ctx.stroke();
  ctx.fillStyle = "#202821";
  ctx.font = "20px system-ui";
  ctx.fillText(category, 54, 34);

  if (!points.length) {
    ctx.fillStyle = "#7c877f";
    ctx.font = "18px system-ui";
    ctx.fillText("기록이 쌓이면 추이가 표시됩니다.", 54, height / 2);
    return;
  }

  const max = Math.max(...points.map((point) => point.weight), 10);
  const plotWidth = width - 108;
  const plotHeight = height - 112;
  const xFor = (index) => 54 + (points.length === 1 ? plotWidth / 2 : (plotWidth * index) / (points.length - 1));
  const yFor = (value) => height - 54 - (value / max) * plotHeight;

  ctx.strokeStyle = "#2f9f63";
  ctx.lineWidth = 5;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = xFor(index);
    const y = yFor(point.weight);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    const x = xFor(index);
    const y = yFor(point.weight);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#2f9f63";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

function getCurrentSets() {
  const key = `${state.activeRoutineId}:${state.activeCategory}:${state.selectedExercise}`;
  if (!state.data.activeSets[key]) {
    state.data.activeSets[key] = defaultPrescription.map((set) => ({ ...set, id: crypto.randomUUID() }));
  }
  return state.data.activeSets[key];
}

function openRoutineEditor(routineId) {
  state.editingRoutineId = routineId;
  showScreen("routine");
  renderRoutines();
}

function closeRoutineEditor() {
  state.editingRoutineId = null;
  renderRoutines();
}

function renderRoutineEditor() {
  const routine = getEditingRoutine();
  if (!routine) return;
  els.editingRoutineTitle.textContent = routine.title;
  const items = routine.exerciseItems ?? [];
  els.selectedRoutineExercises.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <button class="selected-chip" data-category="${escapeAttr(item.category)}" data-remove-exercise="${escapeAttr(item.exercise)}" type="button">
              ${escapeHtml(item.exercise)} <span>×</span>
            </button>
          `,
        )
        .join("")
    : `<p class="empty-list compact">아래에서 운동을 골라 루틴에 추가하세요.</p>`;

  els.routineCategoryStrip.innerHTML = Object.keys(state.data.exercises)
    .map(
      (category) =>
        `<button class="category-button${category === state.activeCategory ? " active" : ""}" data-category="${category}" type="button">${category}</button>`,
    )
    .join("");

  els.routineExercisePicker.innerHTML = state.data.exercises[state.activeCategory]
    .map((exercise) => {
      const isSelected = items.some((item) => item.category === state.activeCategory && item.exercise === exercise);
      return `
        <button class="exercise-button${isSelected ? " selected" : ""}" data-category="${escapeAttr(state.activeCategory)}" data-routine-exercise="${escapeAttr(exercise)}" type="button">
          <span>
            <strong>${escapeHtml(exercise)}</strong>
            <span>${isSelected ? "루틴에 추가됨" : `${state.activeCategory} 운동`}</span>
          </span>
          <span class="arrow">${isSelected ? "✓" : "+"}</span>
        </button>
      `;
    })
    .join("");
}

function toggleExerciseInEditingRoutine(category, exercise) {
  const routine = getEditingRoutine();
  if (!routine) return;
  routine.exerciseItems = routine.exerciseItems ?? [];
  const index = routine.exerciseItems.findIndex((item) => item.category === category && item.exercise === exercise);
  if (index >= 0) {
    routine.exerciseItems.splice(index, 1);
    return;
  }
  routine.exerciseItems.push({ category, exercise });
}

function addInlineExerciseToRoutine() {
  const name = els.inlineExerciseName.value.trim();
  if (!name) return;
  state.data.exercises[state.activeCategory] = state.data.exercises[state.activeCategory] ?? [];
  if (!state.data.exercises[state.activeCategory].includes(name)) {
    state.data.exercises[state.activeCategory].push(name);
  }
  const routine = getEditingRoutine();
  if (routine) {
    routine.exerciseItems = routine.exerciseItems ?? [];
    const exists = routine.exerciseItems.some((item) => item.category === state.activeCategory && item.exercise === name);
    if (!exists) {
      routine.exerciseItems.push({ category: state.activeCategory, exercise: name });
    }
  }
  els.inlineExerciseName.value = "";
  saveData();
  renderRoutineEditor();
}

function deleteRoutine(routineId) {
  if (state.data.routines.length <= 1) {
    return;
  }
  state.data.routines = state.data.routines.filter((routine) => routine.id !== routineId);
  state.data.logs = state.data.logs.filter((log) => log.routineId !== routineId);
  state.data.sessions = (state.data.sessions ?? []).filter((session) => session.routineId !== routineId);
  Object.keys(state.data.activeSets).forEach((key) => {
    if (key.startsWith(`${routineId}:`)) {
      delete state.data.activeSets[key];
    }
  });
  if (state.activeRoutineId === routineId) {
    state.activeRoutineId = state.data.routines[0].id;
    state.data.selectedRoutineId = state.activeRoutineId;
    state.selectedExercise = null;
  }
  if (state.editingRoutineId === routineId) {
    state.editingRoutineId = null;
  }
  saveData();
  renderAll();
}

function removeExerciseFromEditingRoutine(category, exercise) {
  const routine = getEditingRoutine();
  if (!routine) return;
  routine.exerciseItems = (routine.exerciseItems ?? []).filter(
    (item) => !(item.category === category && item.exercise === exercise),
  );
}

function finishWorkout() {
  const routine = getActiveRoutine();
  if (!routine) return;
  const date = toDateInputValue(new Date());
  const todayLogs = state.data.logs.filter((log) => log.routineId === routine.id && log.date === date);
  state.data.sessions = state.data.sessions ?? [];
  state.data.sessions.push({
    id: crypto.randomUUID(),
    routineId: routine.id,
    routineTitle: routine.title,
    date,
    logIds: todayLogs.map((log) => log.id),
    completedAt: new Date().toISOString(),
  });

  Object.keys(state.data.activeSets).forEach((key) => {
    if (key.startsWith(`${routine.id}:`)) {
      delete state.data.activeSets[key];
    }
  });
  state.selectedExercise = null;
  saveData();
  renderAll();
  els.todayRoutineSummary.textContent = "오늘 운동을 저장했습니다.";
}

function getPreviousTopSet(category, exercise) {
  return state.data.logs
    .filter((log) => log.category === category && log.exercise === exercise)
    .sort((a, b) => b.weight - a.weight || b.reps - a.reps)[0];
}

function getBestForExercise(category, exercise) {
  return state.data.logs
    .filter((log) => log.category === category && log.exercise === exercise)
    .sort((a, b) => b.weight - a.weight || b.reps - a.reps)[0];
}

function getAllExerciseNames() {
  const names = new Set();
  Object.values(state.data.exercises).forEach((exercises) => {
    exercises.forEach((exercise) => names.add(exercise));
  });
  state.data.routines.forEach((routine) => {
    (routine.exerciseItems ?? []).forEach((item) => names.add(item.exercise));
  });
  state.data.logs.forEach((log) => names.add(log.exercise));
  return [...names].sort((a, b) => a.localeCompare(b, "ko"));
}

function getActiveRoutine() {
  return state.data.routines.find((routine) => routine.id === state.activeRoutineId);
}

function getEditingRoutine() {
  return state.data.routines.find((routine) => routine.id === state.editingRoutineId);
}

function normalizeData(data) {
  const routineId = data.routines?.[0]?.id ?? crypto.randomUUID();
  const routines = data.routines?.length
    ? data.routines.map((routine) => ({
        ...routine,
        exerciseItems: routine.exerciseItems ?? defaultRoutineItems(),
      }))
    : [{ id: routineId, title: "Day 1a", createdAt: new Date().toISOString(), exerciseItems: defaultRoutineItems() }];
  return {
    selectedRoutineId: data.selectedRoutineId ?? routines[0].id,
    routines,
    exercises: data.exercises ?? defaultExercises,
    logs: data.logs ?? [],
    sessions: data.sessions ?? [],
    activeSets: data.activeSets ?? {},
  };
}

function defaultRoutineItems() {
  return [
    { category: "가슴", exercise: "바벨 벤치 프레스" },
    { category: "가슴", exercise: "인클라인 스미스 머신 벤치 프레스" },
    { category: "가슴", exercise: "스미스 머신 벤치 프레스" },
  ];
}

function logsForDate(date) {
  return state.data.logs.filter((log) => log.date === date).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function populateExerciseDialog() {
  els.newExerciseCategory.innerHTML = Object.keys(state.data.exercises)
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
  els.newExerciseCategory.value = state.activeCategory;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatKoreanDate(value) {
  const date = parseDate(value);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char];
  });
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

init();
