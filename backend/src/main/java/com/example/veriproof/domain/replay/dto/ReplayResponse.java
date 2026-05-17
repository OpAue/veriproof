package com.example.veriproof.domain.replay.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * 답안 재생 응답 (백로그 15).
 * timeline은 event_log를 startedAt 기준 상대 ms(`t`)로 변환한 시간순 배열.
 * snapshots는 answer_snapshot의 시간순 배열.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ReplayResponse(
        Long sessionId,
        String studentNumber,
        String studentName,
        String examTitle,
        OffsetDateTime startedAt,
        OffsetDateTime submittedAt,
        List<QuestionMeta> questions,
        List<TimelineItem> timeline,
        List<SnapshotItem> snapshots
) {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record QuestionMeta(
            Long id,
            String questionType,
            String body,
            Integer displayOrder,
            Integer points
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record TimelineItem(
            Long t,
            String type,
            Long questionId,
            Integer durationMs,
            Object payload   // 파싱된 JSON 객체 (프론트가 e.payload.key 등으로 직접 접근)
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record SnapshotItem(
            Long t,
            Long questionId,
            String answerText,
            List<Long> selectedChoiceIds
    ) {}
}
