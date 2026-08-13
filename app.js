const STORAGE_KEY = "plain-lift-log-v2";

const defaultExercises = {
  가슴: [
    "딥스",
    "딥스 머신",
    "벤치 프레스",
    "스미스 머신 벤치 프레스",
    "덤벨 체스트 플라이",
    "머신 펙덱",
    "머신 체스트 프레스",
    "케이블 체스트 플라이",
    "인클라인 스미스 머신 벤치 프레스",
    "인클라인 바벨 벤치 프레스",
    "인클라인 덤벨 체스트 프레스",
    "인클라인 덤벨 체스트 플라이",
    "디클라인 스미스 벤치 프레스",
    "인클라인 체스트 플라이 머신",
    "디클라인 체스트 프레스 머신",
    "푸시업",
  ],
  등: [
    "체스트 서포티드 덤벨 로우",
    "바벨 랙풀",
    "바벨 로우",
    "덤벨 로우",
    "덤벨 슈러그",
    "바벨 슈러그",
    "스미스 머신 바벨 슈러그",
    "시티드 로우",
    "시티드 로우 (넓은 그립)",
    "스미스 머신 랙풀",
    "스미스 머신 바벨 로우",
    "체스트 서포티드 티바 로우",
    "체스트 서포티드 머신 로우",
    "체스트 서포티드 켈소 슈러그",
    "티바 로우",
    "로우 로우",
    "하이 로우",
    "랫 풀다운 와이드 그립",
    "랫 풀다운 중간 그립",
    "랫 풀다운 뉴트럴 그립",
    "랫 풀다운 언더 그립",
    "풀업 오버 그립",
    "풀업 뉴트럴 그립",
    "친업",
    "와이드 랫 풀다운 머신",
    "풀오버",
    "암 풀다운",
    "어시스트 풀업",
  ],
  어깨: [
    "덤벨 숄더 프레스",
    "머신 숄더 프레스",
    "리버스 펙덱 플라이",
    "덤벨 레터럴 레이즈",
    "바벨 프론트 레이즈",
    "머신 레터럴 레이즈",
    "시티드 덤벨 레터럴 레이즈",
    "케이블 레터럴 레이즈",
    "페이스 풀",
    "스미스 머신 숄더 프레스",
    "벤트오버 덤벨 레터럴 레이즈",
    "스미스 머신 업라이트 로우",
    "아놀드 프레스",
    "덤벨 프론트 레이즈",
    "케이블 프론트 레이즈",
    "케이블 리버스 플라이",
    "오버헤드 프레스",
    "업라이트 로우",
  ],
  하체: [
    "힙 어브덕션",
    "어브덕션",
    "싯업",
    "힙 쓰러스트",
    "머신 핵스쿼트",
    "바벨 힙 쓰러스트",
    "데드리프트",
    "워킹 런지",
    "레그 익스텐션",
    "머신 레그 프레스",
    "행잉 레그 레이즈",
    "바벨 스쿼트",
    "스미스 머신 스쿼트",
    "브이 스쿼트",
    "스티프 데드리프트",
    "덤벨 고블릿 스쿼트",
    "레그 컬",
    "백 익스텐션",
    "리니어 핵스쿼트",
    "크런치 머신",
    "카프 레이즈",
    "불가리안 스플릿 스쿼트",
  ],
  "이두/전완": [
    "해머 바이셉 컬",
    "이지바 바이셉 컬",
    "덤벨 바이셉 컬",
    "바벨 바이셉 컬",
    "케이블 바이셉 컬",
    "머신 프리쳐 컬",
    "바벨 프리쳐 컬",
    "덤벨 리스트 컬",
    "바벨 리스트 컬",
    "덤벨 리버스 리스트 컬",
    "바벨 리버스 리스트 컬",
  ],
  삼두근: [
    "라잉 바벨 트라이셉 익스텐션",
    "케이블 트라이셉 익스텐션",
    "원암 케이블 트라이셉 익스텐션",
    "시티드 덤벨 트라이셉익스텐션",
    "원암 케이블 킥 백",
    "클로즈 그립 벤치 프레스",
    "케이블 트라이셉 푸시다운",
    "케이블 오버헤드 트라이셉 익스텐션",
  ],
};

const defaultPrescription = [
  { type: "warmup", rir: "6 RIR", weight: "", reps: "", note: "", completed: false },
  { type: "warmup", rir: "5 RIR", weight: "", reps: "", note: "", completed: false },
  { type: "top", rir: "1 RIR", weight: "", reps: "", note: "", completed: false },
  { type: "working", rir: "1 RIR", weight: "", reps: "", note: "", completed: false },
  { type: "working", rir: "1 RIR", weight: "", reps: "", note: "", completed: false },
];

const legacyDefaultSets = [
  ["47.1", "6"],
  ["49.1", "5"],
  ["54.3", "4-7"],
  ["55", "5-6"],
  ["45", "8-9"],
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
  timerEndAt: null,
  draggedExerciseIndex: null,
  pointerDragIndex: null,
  dropTargetExerciseIndex: null,
};

const els = {
  restBanner: document.querySelector("#restBanner"),
  restCountdown: document.querySelector("#restCountdown"),
  stopTimerButton: document.querySelector("#stopTimerButton"),
  restSeconds: document.querySelector("#restSeconds"),
  detailRestSeconds: document.querySelector("#detailRestSeconds"),
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

  return {
    selectedRoutineId: null,
    routines: [],
    exercises: defaultExercises,
    logs: [],
    activeSets: {},
  };
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function init() {
  state.activeRoutineId = state.data.selectedRoutineId ?? state.data.routines[0]?.id ?? null;
  populateRestSelects();
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
    if (!state.activeRoutineId) {
      state.activeRoutineId = routine.id;
      state.data.selectedRoutineId = routine.id;
    }
    state.editingRoutineId = routine.id;
    state.activeCategory = "가슴";
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
    updateEditingRoutineTitle();
    closeRoutineEditor();
    saveData();
    renderAll();
  });

  els.editingRoutineTitle.addEventListener("input", () => {
    updateEditingRoutineTitle();
    saveData();
    renderHome();
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
    renderHome();
    renderRoutineEditor();
  });

  els.selectedRoutineExercises.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove-exercise]");
    if (!button) return;
    removeExerciseFromEditingRoutine(button.dataset.category, button.dataset.removeExercise);
    saveData();
    renderHome();
    renderRoutineEditor();
  });

  els.inlineExerciseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addInlineExerciseToRoutine();
  });

  els.inlineExerciseName.addEventListener("input", () => {
    renderRoutineEditor();
  });

  els.finishWorkoutButton.addEventListener("click", () => {
    finishWorkout();
  });

  els.exerciseList.addEventListener("click", (event) => {
    if (event.target.closest(".drag-handle")) return;
    const button = event.target.closest("button[data-exercise]");
    if (!button) return;
    state.selectedExercise = button.dataset.exercise;
    state.activeCategory = button.dataset.category;
    showScreen("detail");
    renderDetail();
  });

  els.exerciseList.addEventListener("dragstart", handleExerciseDragStart);
  els.exerciseList.addEventListener("dragover", handleExerciseDragOver);
  els.exerciseList.addEventListener("drop", handleExerciseDrop);
  els.exerciseList.addEventListener("dragend", clearExerciseDrag);
  els.exerciseList.addEventListener("pointerdown", handleExercisePointerDown);
  els.exerciseList.addEventListener("pointercancel", clearExercisePointerDrag);
  document.addEventListener("pointermove", handleExercisePointerMove);
  document.addEventListener("pointerup", handleExercisePointerUp);

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
      note: "",
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
  els.restSeconds.addEventListener("change", syncRestSeconds);
  els.detailRestSeconds.addEventListener("change", syncRestSeconds);
  document.addEventListener("visibilitychange", updateTimerText);

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
  els.routineName.textContent = routine?.title ?? "루틴 없음";
  const items = routine?.exerciseItems ?? [];
  els.finishWorkoutButton.classList.toggle("hidden", !routine);
  els.todayRoutineSummary.textContent = !routine
    ? "루틴 탭에서 오늘 할 루틴을 먼저 만들어주세요."
    : items.length
    ? `${items.length}개 종목으로 오늘 운동을 시작합니다.`
    : "루틴 탭에서 이 루틴에 운동 종목을 추가하세요.";

  els.exerciseList.innerHTML = items.length
    ? items
        .map((item, index) => {
          const best = getBestForExercise(item.category, item.exercise);
          const dragIndex = state.pointerDragIndex ?? state.draggedExerciseIndex;
          const isDragging = dragIndex === index;
          const isDropTarget = state.dropTargetExerciseIndex === index && dragIndex !== null && !isDragging;
          const isDimmed = dragIndex !== null && !isDragging && !isDropTarget;
          return `
        <button class="exercise-button${isDragging ? " dragging" : ""}${isDropTarget ? " drop-target" : ""}${isDimmed ? " dimmed" : ""}" draggable="true" data-index="${index}" data-category="${escapeAttr(item.category)}" data-exercise="${escapeAttr(item.exercise)}" type="button">
          <span>
            <strong>${escapeHtml(item.exercise)}</strong>
            <span>${escapeHtml(item.category)} · ${best ? `최고 ${best.weight}kg / ${best.reps}회` : "아직 기록 없음"}</span>
          </span>
          <span class="drag-handle" aria-label="순서 변경">☰</span>
        </button>
      `;
        })
        .join("")
    : `<div class="empty-list">${routine ? "아직 이 루틴에 담긴 운동이 없습니다." : "아직 만든 루틴이 없습니다."}</div>`;
}

function handleExerciseDragStart(event) {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  state.draggedExerciseIndex = Number(button.dataset.index);
  state.dropTargetExerciseIndex = state.draggedExerciseIndex;
  renderHome();
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", button.dataset.index);
}

function handleExerciseDragOver(event) {
  if (state.draggedExerciseIndex === null) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  const target = event.target.closest("[data-index]");
  if (!target) return;
  updateDropTarget(Number(target.dataset.index));
}

function handleExerciseDrop(event) {
  event.preventDefault();
  const target = event.target.closest("[data-index]");
  if (!target) return;
  reorderActiveRoutineExercise(state.draggedExerciseIndex, Number(target.dataset.index));
  clearExerciseDrag();
}

function clearExerciseDrag() {
  state.draggedExerciseIndex = null;
  state.dropTargetExerciseIndex = null;
  renderHome();
}

function handleExercisePointerDown(event) {
  const handle = event.target.closest(".drag-handle");
  if (!handle) return;
  const button = handle.closest("[data-index]");
  if (!button) return;
  state.pointerDragIndex = Number(button.dataset.index);
  state.dropTargetExerciseIndex = state.pointerDragIndex;
  renderHome();
  event.preventDefault();
}

function handleExercisePointerMove(event) {
  if (state.pointerDragIndex === null) return;
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-index]");
  if (!target) return;
  const targetIndex = Number(target.dataset.index);
  updateDropTarget(targetIndex);
  if (targetIndex === state.pointerDragIndex) return;
  reorderActiveRoutineExercise(state.pointerDragIndex, targetIndex);
  state.pointerDragIndex = targetIndex;
}

function handleExercisePointerUp(event) {
  if (state.pointerDragIndex === null) return;
  const target = event.target.closest("[data-index]");
  if (target) {
    reorderActiveRoutineExercise(state.pointerDragIndex, Number(target.dataset.index));
  }
  clearExercisePointerDrag();
}

function clearExercisePointerDrag() {
  state.pointerDragIndex = null;
  state.dropTargetExerciseIndex = null;
  renderHome();
}

function updateDropTarget(index) {
  if (state.dropTargetExerciseIndex === index) return;
  state.dropTargetExerciseIndex = index;
  renderHome();
}

function reorderActiveRoutineExercise(fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex === null || Number.isNaN(fromIndex) || Number.isNaN(toIndex)) return;
  const routine = getActiveRoutine();
  const items = routine?.exerciseItems ?? [];
  if (!items[fromIndex] || !items[toIndex]) return;
  const [item] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, item);
  saveData();
  renderHome();
}

function renderRoutines() {
  els.routineList.classList.toggle("hidden", Boolean(state.editingRoutineId));
  els.routineEditor.classList.toggle("hidden", !state.editingRoutineId);
  els.routineList.innerHTML = state.data.routines.length
    ? state.data.routines
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
        .join("")
    : `<div class="empty-list">아직 만든 루틴이 없습니다. 위에서 루틴 제목을 적고 추가해보세요.</div>`;
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
  if (!activeItem) {
    els.detailRoutineName.textContent = routine?.title ?? "루틴 없음";
    els.detailExerciseName.textContent = "운동 없음";
    els.completionPill.textContent = "0/0 완료";
    els.previousTopSet.innerHTML = "지난주 탑 세트 <strong>기록 없음</strong>";
    renderSetGroup(els.warmupSetList, [], "warmup");
    renderSetGroup(els.topSetList, [], "top");
    renderSetGroup(els.workingSetList, [], "working");
    return;
  }
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

  renderSetGroup(els.warmupSetList, sets.filter((set) => set.type === "warmup"), "warmup");
  renderSetGroup(els.topSetList, sets.filter((set) => set.type === "top"), "top");
  renderSetGroup(els.workingSetList, sets.filter((set) => set.type === "working"), "working");
}

function renderSetGroup(container, sets, type) {
  const repsPlaceholder = type === "warmup" ? "8-10" : type === "working" ? "10-12" : "";
  container.innerHTML = sets
    .map(
      (set) => `
        <div class="set-row${set.completed ? " completed" : ""}" data-set-id="${set.id}">
          <div class="set-main-line">
            <span class="rir">${escapeHtml(set.rir)}</span>
            <label><input data-field="weight" inputmode="decimal" value="${escapeAttr(set.weight)}" placeholder="" /><span>kg</span></label>
            <label><input data-field="reps" inputmode="numeric" value="${escapeAttr(set.reps)}" placeholder="${repsPlaceholder}" /><span>회</span></label>
            <button class="check-button" data-check="${set.id}" type="button" aria-label="세트 완료">✓</button>
          </div>
          <input class="set-note" data-field="note" type="text" value="${escapeAttr(set.note ?? "")}" placeholder="세트 메모" />
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
  const sets = getCurrentSets();
  const setIndex = sets.findIndex((item) => item.id === button.dataset.check);
  const set = sets[setIndex];
  if (!set) return;
  set.completed = !set.completed;
  if (set.completed) {
    saveCompletedSet(set, setIndex);
    startRestTimer(Number(els.restSeconds.value));
  } else {
    removeCompletedSetLog(set.id);
  }
  saveData();
  renderAll();
}

function saveCompletedSet(set, setIndex) {
  if (!set.completed) return;
  const routine = getActiveRoutine();
  const weight = Number.parseFloat(set.weight);
  const reps = Number.parseInt(set.reps, 10);
  if (!routine || Number.isNaN(weight) || Number.isNaN(reps)) return;
  removeCompletedSetLog(set.id);
  state.data.logs.push({
    id: crypto.randomUUID(),
    sourceSetId: set.id,
    routineId: routine.id,
    routineTitle: routine.title,
    category: state.activeCategory,
    exercise: state.selectedExercise,
    setType: set.type,
    setOrder: setIndex,
    rir: set.rir,
    note: set.note ?? "",
    weight,
    reps,
    date: toDateInputValue(new Date()),
    createdAt: new Date().toISOString(),
  });
}

function removeCompletedSetLog(setId) {
  state.data.logs = state.data.logs.filter((log) => log.sourceSetId !== setId);
}

function startRestTimer(seconds) {
  if (seconds <= 0) {
    stopRestTimer();
    return;
  }
  state.timerRemaining = seconds;
  state.timerEndAt = Date.now() + seconds * 1000;
  els.restBanner.classList.remove("hidden");
  updateTimerText();
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
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
  state.timerEndAt = null;
  els.restBanner.classList.add("hidden");
}

function updateTimerText() {
  if (state.timerEndAt) {
    state.timerRemaining = Math.max(0, Math.ceil((state.timerEndAt - Date.now()) / 1000));
  }
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

  const selectedLogs = bestLogsForDate(state.selectedCalendarDate);
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
  const logs = bestLogsByDate(
    state.data.logs
    .filter((log) => log.exercise === exercise)
    .sort((a, b) => a.date.localeCompare(b.date)),
  );
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
    state.data.activeSets[key] = buildInitialSets(state.activeCategory, state.selectedExercise);
  }
  return state.data.activeSets[key];
}

function buildInitialSets(category, exercise) {
  const sets = defaultPrescription.map((set) => ({ ...set, id: crypto.randomUUID() }));
  const previousSets = getLastWorkoutSets(category, exercise);
  previousSets.slice(0, sets.length).forEach((log, index) => {
    sets[index].weight = String(log.weight ?? "");
    sets[index].reps = String(log.reps ?? "");
    sets[index].note = String(log.note ?? "");
  });
  return sets;
}

function getLastWorkoutSets(category, exercise) {
  const logs = state.data.logs
    .filter((log) => log.category === category && log.exercise === exercise)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!logs.length) return [];

  const lastDate = logs[0].date;
  return logs
    .filter((log) => log.date === lastDate)
    .sort((a, b) => {
      const orderA = Number.isFinite(a.setOrder) ? a.setOrder : Number.MAX_SAFE_INTEGER;
      const orderB = Number.isFinite(b.setOrder) ? b.setOrder : Number.MAX_SAFE_INTEGER;
      return orderA - orderB || a.createdAt.localeCompare(b.createdAt);
    });
}

function openRoutineEditor(routineId) {
  state.editingRoutineId = routineId;
  showScreen("routine");
  renderRoutines();
}

function closeRoutineEditor() {
  state.editingRoutineId = null;
  renderRoutines();
  renderHome();
}

function renderRoutineEditor() {
  const routine = getEditingRoutine();
  if (!routine) return;
  if (document.activeElement !== els.editingRoutineTitle) {
    els.editingRoutineTitle.value = routine.title;
  }
  const items = routine.exerciseItems ?? [];
  const searchValue = els.inlineExerciseName.value.trim();
  const query = normalizeSearchText(searchValue);
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

  const exercises = state.data.exercises[state.activeCategory] ?? [];
  const filteredExercises = query
    ? exercises.filter((exercise) => normalizeSearchText(exercise).includes(query))
    : exercises;

  els.routineExercisePicker.innerHTML = filteredExercises.length
    ? filteredExercises
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
        .join("")
    : `<div class="empty-list">${escapeHtml(searchValue)} 검색 결과가 없습니다. 운동 추가를 누르면 새 운동으로 추가됩니다.</div>`;
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
  const existingExercise = findExerciseByName(state.activeCategory, name);
  const exerciseName = existingExercise ?? name;
  if (!existingExercise) {
    state.data.exercises[state.activeCategory].push(exerciseName);
  }
  const routine = getEditingRoutine();
  if (routine) {
    routine.exerciseItems = routine.exerciseItems ?? [];
    const exists = routine.exerciseItems.some(
      (item) => item.category === state.activeCategory && isSameExerciseName(item.exercise, exerciseName),
    );
    if (!exists) {
      routine.exerciseItems.push({ category: state.activeCategory, exercise: exerciseName });
    }
  }
  els.inlineExerciseName.value = "";
  saveData();
  renderHome();
  renderRoutineEditor();
}

function updateEditingRoutineTitle() {
  const routine = getEditingRoutine();
  if (!routine) return;
  const title = els.editingRoutineTitle.value.trim();
  if (!title) return;
  routine.title = title;
}

function deleteRoutine(routineId) {
  state.data.routines = state.data.routines.filter((routine) => routine.id !== routineId);
  state.data.logs = state.data.logs.filter((log) => log.routineId !== routineId);
  state.data.sessions = (state.data.sessions ?? []).filter((session) => session.routineId !== routineId);
  Object.keys(state.data.activeSets).forEach((key) => {
    if (key.startsWith(`${routineId}:`)) {
      delete state.data.activeSets[key];
    }
  });
  if (state.activeRoutineId === routineId) {
    state.activeRoutineId = state.data.routines[0]?.id ?? null;
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
  const routines = data.routines?.length
    ? data.routines.map((routine) => ({
        ...routine,
        exerciseItems: routine.exerciseItems ?? defaultRoutineItems(),
      }))
    : [];
  const selectedRoutineId = routines.some((routine) => routine.id === data.selectedRoutineId)
    ? data.selectedRoutineId
    : routines[0]?.id ?? null;
  return {
    selectedRoutineId,
    routines,
    exercises: mergeExerciseCatalog(data.exercises),
    logs: data.logs ?? [],
    sessions: data.sessions ?? [],
    activeSets: removeLegacyDefaultActiveSets(data.activeSets ?? {}),
  };
}

function removeLegacyDefaultActiveSets(activeSets) {
  return Object.fromEntries(
    Object.entries(activeSets).filter(([, sets]) => {
      if (!Array.isArray(sets) || sets.length !== legacyDefaultSets.length) return true;
      const isLegacyDefault = sets.every((set, index) => {
        const [weight, reps] = legacyDefaultSets[index];
        return String(set.weight) === weight && String(set.reps) === reps && !set.completed;
      });
      return !isLegacyDefault;
    }),
  );
}

function mergeExerciseCatalog(savedExercises = {}) {
  const merged = {};
  Object.entries(defaultExercises).forEach(([category, exercises]) => {
    merged[category] = [...exercises];
  });
  Object.entries(savedExercises ?? {}).forEach(([category, exercises]) => {
    merged[category] = merged[category] ?? [];
    (exercises ?? []).forEach((exercise) => {
      if (!merged[category].some((item) => isSameExerciseName(item, exercise))) {
        merged[category].push(exercise);
      }
    });
  });
  return merged;
}

function findExerciseByName(category, name) {
  return (state.data.exercises[category] ?? []).find((exercise) => isSameExerciseName(exercise, name));
}

function isSameExerciseName(a, b) {
  return normalizeSearchText(a) === normalizeSearchText(b);
}

function normalizeSearchText(value) {
  return String(value).replace(/\s/g, "").toLowerCase();
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

function bestLogsForDate(date) {
  const bestByExercise = new Map();
  logsForDate(date).forEach((log) => {
    const current = bestByExercise.get(log.exercise);
    if (!current || compareLogStrength(log, current) > 0) {
      bestByExercise.set(log.exercise, log);
    }
  });
  return [...bestByExercise.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function bestLogsByDate(logs) {
  const bestByDate = new Map();
  logs.forEach((log) => {
    const current = bestByDate.get(log.date);
    if (!current || compareLogStrength(log, current) > 0) {
      bestByDate.set(log.date, log);
    }
  });
  return [...bestByDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function compareLogStrength(a, b) {
  return Number(a.weight) - Number(b.weight) || Number(a.reps) - Number(b.reps);
}

function populateRestSelects() {
  const options = [];
  for (let seconds = 0; seconds <= 120; seconds += 15) {
    options.push(`<option value="${seconds}">${formatTimer(seconds)}</option>`);
  }
  [els.restSeconds, els.detailRestSeconds].forEach((select) => {
    select.innerHTML = options.join("");
    select.value = "90";
  });
}

function syncRestSeconds(event) {
  const value = event.target.value;
  els.restSeconds.value = value;
  els.detailRestSeconds.value = value;
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
