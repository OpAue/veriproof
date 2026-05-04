import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

export default function Login() {
  const location = useLocation();
  // 회원가입 직후 리다이렉트된 경우 안내 메시지 표시
  const signupSuccess = location.state?.signupSuccess;

  const [formData, setFormData] = useState({ username: '', password: '' });
  const { loading, error, handleLogin } = useAuth();

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>로그인</h2>

        {signupSuccess && (
          <p className={styles.successMsg}>회원가입이 완료됐습니다. 로그인해주세요.</p>
        )}

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username">아이디</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={formData.username}
              onChange={onChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={onChange}
              required
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className={styles.switchLink}>
          계정이 없으신가요?{' '}
          <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
