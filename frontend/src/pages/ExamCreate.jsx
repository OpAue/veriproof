import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// 빈 문항 생성 헬퍼
const createEmptyQuestion = () => ({
  id: Date.now() + Math.random(),
  type: "subjective",
  content: "",
  score: "",
  options: ["", "", "", ""],
  imageFile: null,
  imagePreview: null,
});

// ─────────────────────────────────────────────
// 이미지 업로드 컴포넌트 (드래그앤드롭 + 파일선택)
// ─────────────────────────────────────────────
function ImageUploader({ imagePreview, onImageChange, onImageRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // 파일 처리 공통 함수
  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => onImageChange(file, e.target.result);
      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  // 드래그 이벤트
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // 파일 선택 버튼
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  // 이미지가 이미 있으면 미리보기
  if (imagePreview) {
    return (
      <div style={styles.previewWrap}>
        <img src={imagePreview} alt="첨부 이미지" style={styles.previewImg} />
        <button type="button" onClick={onImageRemove} style={styles.removeBtn}>
          삭제
        </button>
      </div>
    );
  }

  // 업로드 영역
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      style={{
        ...styles.dropZone,
        borderColor: isDragging ? "#378ADD" : "#d0d0d0",
        background: isDragging ? "#f0f7ff" : "#fafafa",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <div style={styles.dropIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 3v10M6 7l4-4 4 4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={styles.dropText}>이미지를 드래그하거나 클릭해서 선택</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// 문항 카드 컴포넌트
// ─────────────────────────────────────────────
function QuestionCard({ question, index, onChange, onDelete, isOnly }) {
  const update = (field, value) => onChange({ ...question, [field]: value });

  // 선택지 업데이트
  const updateOption = (optIdx, value) => {
    const newOptions = [...question.options];
    newOptions[optIdx] = value;
    update("options", newOptions);
  };

  // 선택지 추가/삭제
  const addOption = () => update("options", [...question.options, ""]);
  const removeOption = (optIdx) => {
    if (question.options.length <= 2) return; // 최소 2개
    update("options", question.options.filter((_, i) => i !== optIdx));
  };

  return (
    <div style={styles.questionCard}>
      {/* 헤더: 문항 번호 + 유형 토글 + 삭제 */}
      <div style={styles.qHeader}>
        <span style={styles.qNumber}>문항 {index + 1}</span>
        <div style={styles.qHeaderRight}>
          <div style={styles.typeToggle}>
            <button
              type="button"
              onClick={() => update("type", "subjective")}
              style={{
                ...styles.typeBtn,
                borderRadius: "6px 0 0 6px",
                ...(question.type === "subjective" ? styles.typeBtnActive : {}),
              }}
            >
              주관식
            </button>
            <button
              type="button"
              onClick={() => update("type", "objective")}
              style={{
                ...styles.typeBtn,
                borderRadius: "0 6px 6px 0",
                borderLeft: "none",
                ...(question.type === "objective" ? styles.typeBtnActive : {}),
              }}
            >
              객관식
            </button>
          </div>
          {!isOnly && (
            <button type="button" onClick={onDelete} style={styles.deleteBtn}>
              삭제
            </button>
          )}
        </div>
      </div>

      {/* 문항 본문 입력 */}
      <textarea
        placeholder="문항 내용을 입력하세요"
        value={question.content}
        onChange={(e) => update("content", e.target.value)}
        rows={2}
        style={styles.textarea}
      />

      {/* 객관식일 때만 선택지 표시 */}
      {question.type === "objective" && (
        <div style={styles.optionsSection}>
          <div style={styles.optionsLabel}>선택지</div>
          {question.options.map((opt, optIdx) => (
            <div key={optIdx} style={styles.optionRow}>
              <span style={styles.optionNum}>{optIdx + 1}</span>
              <input
                type="text"
                placeholder={`선택지 ${optIdx + 1}`}
                value={opt}
                onChange={(e) => updateOption(optIdx, e.target.value)}
                style={styles.optionInput}
              />
              {question.options.length > 2 && (
                <button type="button" onClick={() => removeOption(optIdx)} style={styles.optionDeleteBtn}>
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption} style={styles.addOptionBtn}>
            + 선택지 추가
          </button>
        </div>
      )}

      {/* 배점 */}
      <div style={styles.qFooter}>
        <div style={styles.scoreWrap}>
          <label style={styles.scoreLabel}>배점</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={question.score}
            onChange={(e) => update("score", e.target.value)}
            style={styles.scoreInput}
          />
        </div>
      </div>

      {/* 이미지 업로드 */}
      <ImageUploader
        imagePreview={question.imagePreview}
        onImageChange={(file, preview) =>
          onChange({ ...question, imageFile: file, imagePreview: preview })
        }
        onImageRemove={() =>
          onChange({ ...question, imageFile: null, imagePreview: null })
        }
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인: 시험 개설 페이지
// ─────────────────────────────────────────────
export default function ExamCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 문항 CRUD
  const addQuestion = () => setQuestions([...questions, createEmptyQuestion()]);
  const deleteQuestion = (id) => setQuestions(questions.filter((q) => q.id !== id));
  const updateQuestion = (id, updated) =>
    setQuestions(questions.map((q) => (q.id === id ? updated : q)));

  // 시험 개설 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("시험명을 입력하세요.");
    if (!startAt) return alert("시작 시각을 입력하세요.");
    if (!endAt) return alert("종료 시각을 입력하세요.");

    setIsSubmitting(true);

    // ──────────────────────────────────────────
    // TODO: API 연동 시 아래 주석 해제하고 mock 제거
    // ──────────────────────────────────────────
    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("startAt", startAt);
    // formData.append("endAt", endAt);
    // formData.append("questions", JSON.stringify(
    //   questions.map((q) => ({
    //     type: q.type,
    //     content: q.content,
    //     score: Number(q.score),
    //     options: q.type === "objective" ? q.options : undefined,
    //   }))
    // ));
    // questions.forEach((q, i) => {
    //   if (q.imageFile) formData.append(`image_${i}`, q.imageFile);
    // });
    // const res = await api.post("/exams", formData);
    // navigate(`/exam/${res.data.id}`);

    // mock: 1초 후 성공 (API 연동 시 이 블록 교체)
    setTimeout(() => {
      setIsSubmitting(false);

      // 개설한 시험 데이터를 state로 만들어서 상세 페이지로 전달
      const newExam = {
        id: Date.now(),
        title,
        startAt,
        endAt,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        applicantCount: 0,
        questions: questions.map((q) => ({
          type: q.type,
          content: q.content,
          score: Number(q.score),
          options: q.type === "objective" ? q.options : [],
          imagePreview: q.imagePreview,
        })),
      };

      navigate(`/exam/${newExam.id}`, { state: { exam: newExam } });
    }, 1000);
  };

  return (
    <div style={styles.page}>
      {/* 네비게이션 */}
      <nav style={styles.nav}>
        <span style={styles.navTitle}>시험 플랫폼</span>
        <span style={styles.navUser}>홍길동 교수</span>
      </nav>

      <form onSubmit={handleSubmit} style={styles.content}>
        <h1 style={styles.pageTitle}>새 시험 만들기</h1>

        {/* 시험 기본 정보 */}
        <section style={styles.section}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>시험명</label>
            <input
              type="text"
              placeholder="예: 2025 중간고사"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>시작 시각</label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>종료 시각</label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>
        </section>

        <hr style={styles.divider} />

        {/* 문항 목록 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>문항 ({questions.length}개)</h2>
            <span style={styles.totalScore}>
              총 배점: {questions.reduce((s, q) => s + (Number(q.score) || 0), 0)}점
            </span>
          </div>

          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              onChange={(updated) => updateQuestion(q.id, updated)}
              onDelete={() => deleteQuestion(q.id)}
              isOnly={questions.length === 1}
            />
          ))}

          <button type="button" onClick={addQuestion} style={styles.addQBtn}>
            + 문항 추가
          </button>
        </section>

        {/* 하단 액션 */}
        <div style={styles.actions}>
          <button type="button" style={styles.cancelBtn} onClick={() => navigate("/dashboard")}>
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ ...styles.submitBtn, opacity: isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? "개설 중..." : "시험 개설"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// 스타일 (인라인 — 팀 CSS 방식 확정 전 임시)
// ─────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f8",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderBottom: "1px solid #e5e5e5",
    background: "#fff",
  },
  navTitle: { fontSize: 16, fontWeight: 500 },
  navUser: { fontSize: 13, color: "#888" },

  content: { maxWidth: 640, margin: "0 auto", padding: "32px 20px" },
  pageTitle: { fontSize: 20, fontWeight: 500, marginBottom: 24 },

  section: { marginBottom: 24 },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: 500, margin: 0 },
  totalScore: { fontSize: 13, color: "#666" },

  fieldGroup: { marginBottom: 12 },
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 4 },
  input: {
    width: "100%",
    padding: "8px 12px",
    fontSize: 14,
    border: "1px solid #ddd",
    borderRadius: 8,
    outline: "none",
    boxSizing: "border-box",
  },
  row: { display: "flex", gap: 12 },
  divider: { border: "none", borderTop: "1px solid #e5e5e5", margin: "24px 0" },

  // 문항 카드
  questionCard: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  qHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  qNumber: { fontSize: 13, fontWeight: 500, color: "#333" },
  qHeaderRight: { display: "flex", alignItems: "center", gap: 10 },
  typeToggle: { display: "flex" },
  typeBtn: {
    fontSize: 12,
    padding: "4px 12px",
    border: "1px solid #ddd",
    background: "#fff",
    color: "#888",
    cursor: "pointer",
  },
  typeBtnActive: {
    background: "#eef4ff",
    color: "#185FA5",
    borderColor: "#85B7EB",
  },
  deleteBtn: {
    fontSize: 12,
    color: "#e24b4a",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "8px 12px",
    fontSize: 14,
    border: "1px solid #ddd",
    borderRadius: 8,
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    marginBottom: 10,
  },

  // 객관식 선택지
  optionsSection: { marginBottom: 10 },
  optionsLabel: { fontSize: 12, color: "#888", marginBottom: 6 },
  optionRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  optionNum: { fontSize: 12, fontWeight: 500, color: "#aaa", minWidth: 16, textAlign: "center" },
  optionInput: {
    flex: 1,
    padding: "6px 10px",
    fontSize: 13,
    border: "1px solid #ddd",
    borderRadius: 6,
    outline: "none",
  },
  optionDeleteBtn: {
    fontSize: 12,
    color: "#ccc",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },
  addOptionBtn: {
    fontSize: 12,
    color: "#185FA5",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginTop: 2,
  },

  // 배점
  qFooter: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  scoreWrap: { display: "flex", alignItems: "center", gap: 6 },
  scoreLabel: { fontSize: 12, color: "#888" },
  scoreInput: {
    width: 60,
    padding: "5px 8px",
    fontSize: 13,
    border: "1px solid #ddd",
    borderRadius: 6,
    outline: "none",
    textAlign: "center",
  },

  // 이미지 업로드
  dropZone: {
    border: "1.5px dashed #d0d0d0",
    borderRadius: 8,
    padding: "16px 12px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  dropIcon: { marginBottom: 4 },
  dropText: { fontSize: 12, color: "#999" },
  previewWrap: { position: "relative", display: "inline-block", marginTop: 4 },
  previewImg: {
    maxWidth: "100%",
    maxHeight: 160,
    borderRadius: 8,
    border: "1px solid #eee",
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    fontSize: 11,
    padding: "2px 8px",
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },

  // 버튼들
  addQBtn: {
    width: "100%",
    padding: 12,
    fontSize: 13,
    border: "1.5px dashed #ccc",
    borderRadius: 8,
    background: "transparent",
    color: "#888",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
    paddingTop: 20,
    borderTop: "1px solid #e5e5e5",
  },
  cancelBtn: {
    padding: "8px 20px",
    fontSize: 14,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    color: "#666",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "8px 24px",
    fontSize: 14,
    border: "none",
    borderRadius: 8,
    background: "#185FA5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
  },
};
