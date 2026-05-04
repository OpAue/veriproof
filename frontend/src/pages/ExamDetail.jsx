import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

// ──────────────────────────────────────────
// TODO: API 연동 시 아래 mock 데이터를 제거하고
// import { getExamDetail } from "../api/exam"; 사용
// ──────────────────────────────────────────
const mockExam = {
  id: 1,
  title: "중간고사",
  startAt: "2025-05-01T09:00:00",
  endAt: "2025-05-01T11:00:00",
  code: "A1B2C3",
  applicantCount: 32,
  questions: [
    { type: "subjective", content: "다음을 설명하시오.", score: 10 },
    { type: "objective", content: "다음 중 옳은 것은?", score: 5, options: ["①", "②", "③", "④"] },
  ],
};

export default function ExamDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    // 시험 개설 페이지에서 넘어온 경우 → state에서 바로 꺼내 사용
    if (location.state?.exam) {
      setExam(location.state.exam);
      setLoading(false);
      return;
    }

    // TODO: URL로 직접 접근한 경우 → API 연동 시 아래 주석 해제
    // const examId = window.location.pathname.split("/").pop();
    // const res = await getExamDetail(examId);
    // setExam(res.data);
    // setLoading(false);

    // mock: URL 직접 접근 시 fallback
    setTimeout(() => {
      setExam(mockExam);
      setLoading(false);
    }, 500);
  }, [location.state]);

  // 날짜 포맷 헬퍼
  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // 코드 복사
  const copyCode = async () => {
    if (!exam) return;
    try {
      await navigator.clipboard.writeText(exam.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // 클립보드 API 미지원 시 fallback
      const textarea = document.createElement("textarea");
      textarea.value = exam.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <span style={styles.navTitle}>시험 플랫폼</span>
        </nav>
        <div style={styles.loadingText}>불러오는 중...</div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <span style={styles.navTitle}>시험 플랫폼</span>
        </nav>
        <div style={styles.content}>
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>개설된 시험이 없습니다</p>
            <button
              style={styles.createBtn}
              onClick={() => navigate("/exam/create")}
            >
              + 새 시험 만들기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 코드를 3글자씩 나눠서 표시 (A1B2C3 → A1B 2C3)
  const displayCode = exam.code.match(/.{1,3}/g)?.join(" ") || exam.code;

  return (
    <div style={styles.page}>
      {/* 네비게이션 */}
      <nav style={styles.nav}>
        <span style={styles.navTitle}>시험 플랫폼</span>
        <button
          style={styles.createBtn}
          onClick={() => navigate("/exam/create")}
        >
          + 새 시험 만들기
        </button>
      </nav>

      <div style={styles.content}>
        {/* 상단: 시험명 + 목록 버튼 */}
        <div style={styles.pageHeader}>
          <div>
            <p style={styles.breadcrumb}>{exam.title}</p>
            <h1 style={styles.pageTitle}>시험 상세</h1>
          </div>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/dashboard")}
          >
            목록으로
          </button>
        </div>

        {/* 통계 카드 */}
        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>시작 시각</div>
            <div style={styles.statValue}>{formatDate(exam.startAt)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>종료 시각</div>
            <div style={styles.statValue}>{formatDate(exam.endAt)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>응시자 수</div>
            <div style={styles.statValueBig}>{exam.applicantCount}명</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>문항 수</div>
            <div style={styles.statValueBig}>{exam.questions.length}개</div>
          </div>
        </div>

        {/* 시험 코드 */}
        <div style={styles.sectionLabel}>시험 코드</div>
        <div style={styles.codeBox}>
          <span style={styles.codeValue}>{displayCode}</span>
          <button style={styles.copyBtn} onClick={copyCode}>
            {codeCopied ? "복사됨!" : "복사"}
          </button>
        </div>

        {/* QR 코드 */}
        <div style={styles.sectionLabel}>QR 코드</div>
        <div style={styles.qrBox}>
          {/* TODO: mock 데이터 대신 실제 코드 생성 기능 구현 후 교체 */}
          {/* <QRCodeSVG value={`https://도메인/join/${exam.code}`} size={120} /> */}
          <div style={styles.qrPlaceholder}>
            <QRCodeSVG value="A1B2C3" size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 스타일 (인라인 — 팀 CSS 방식 확정 전 임시)
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

  content: { maxWidth: 640, margin: "0 auto", padding: "32px 20px" },
  loadingText: { fontSize: 14, color: "#999", textAlign: "center", padding: 60 },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  breadcrumb: { fontSize: 13, color: "#888", margin: "0 0 2px" },
  pageTitle: { fontSize: 20, fontWeight: 500, margin: 0 },
  backBtn: {
    fontSize: 12,
    padding: "6px 14px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "#fff",
    color: "#666",
    cursor: "pointer",
  },
  createBtn: {
    fontSize: 13,
    padding: "8px 16px",
    border: "none",
    borderRadius: 8,
    background: "#185FA5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
  },

  // 통계 카드
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    padding: "14px 16px",
  },
  statLabel: { fontSize: 12, color: "#888", marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: 500, color: "#333" },
  statValueBig: { fontSize: 22, fontWeight: 500, color: "#222" },

  // 시험 코드
  sectionLabel: { fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 8 },
  codeBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    padding: "16px 20px",
    marginBottom: 20,
  },
  codeValue: {
    fontSize: 28,
    fontWeight: 500,
    fontFamily: '"SF Mono", "Fira Code", monospace',
    letterSpacing: "0.15em",
    color: "#222",
  },
  copyBtn: {
    fontSize: 12,
    padding: "6px 14px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "#fff",
    color: "#666",
    cursor: "pointer",
    fontWeight: 500,
  },

  // QR 코드
  qrBox: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    padding: "24px 20px",
    textAlign: "center",
  },
  qrPlaceholder: { marginBottom: 8 },
  qrHint: { fontSize: 12, color: "#888", margin: "0 0 2px" },
  qrSubHint: {
    fontSize: 11,
    color: "#aaa",
    fontFamily: '"SF Mono", "Fira Code", monospace',
    margin: 0,
  },

  // 빈 상태
  emptyState: { textAlign: "center", padding: "60px 20px" },
  emptyText: { fontSize: 15, color: "#666", marginBottom: 16 },
};
