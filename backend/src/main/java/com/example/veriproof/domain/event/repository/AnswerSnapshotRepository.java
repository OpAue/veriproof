package com.example.veriproof.domain.event.repository;

import com.example.veriproof.domain.event.entity.AnswerSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerSnapshotRepository extends JpaRepository<AnswerSnapshot, Long> {

    /** 사후 재생(백로그 15)용. 한 세션의 모든 스냅샷을 시간순. */
    List<AnswerSnapshot> findAllByExamSessionIdOrderByCapturedAtAsc(Long examSessionId);
}
