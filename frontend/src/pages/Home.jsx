import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

// 서비스 진입점: 로그인 / 회원가입으로 이동하는 홈 화면
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>온라인 시험 플랫폼</h1>
        <p className={styles.subtitle}>시험을 개설하고 응시자를 관리하세요</p>
        <div className={styles.buttonGroup}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate('/login')}
          >
            로그인
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => navigate('/signup')}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
