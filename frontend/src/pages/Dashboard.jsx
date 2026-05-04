// 대시보드는 다른 팀원이 구현 예정 — 임시 플레이스홀더
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>대시보드</h2>
      {user.name && <p>{user.name}님 환영합니다.</p>}
    </div>
  );
}
