import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    affiliation: '',
  });
  const [validationError, setValidationError] = useState('');
  const { loading, error, handleSignup } = useAuth();

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationError('');
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // 비밀번호 확인 검사
    if (formData.password !== formData.passwordConfirm) {
      setValidationError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // passwordConfirm은 서버로 전송하지 않음
    const { passwordConfirm, ...payload } = formData;
    handleSignup(payload);
  };

  const displayError = validationError || error;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>회원가입</h2>

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
            <label htmlFor="name">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="affiliation">소속</label>
            <input
              id="affiliation"
              name="affiliation"
              type="text"
              placeholder="소속 기관을 입력하세요"
              value={formData.affiliation}
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

          <div className={styles.field}>
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.passwordConfirm}
              onChange={onChange}
              required
            />
          </div>

          {displayError && <p className={styles.errorMsg}>{displayError}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <p className={styles.switchLink}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
