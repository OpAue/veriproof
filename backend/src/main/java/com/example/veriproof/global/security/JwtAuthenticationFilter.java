package com.example.veriproof.global.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 헤더에서 토큰 추출
        String token = resolveToken(request);

        // 2. 토큰이 존재하고 유효한지 검증 (DB 조회 없음!)
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // 3. 토큰에서 유저 정보(ID, username) 추출
            Claims claims = jwtTokenProvider.getClaims(token);
            Long professorId = claims.get("id", Long.class);
            String username = claims.getSubject();

            // 4. 인증 객체 생성 및 SecurityContext 저장 (비밀번호는 null로 처리)
            JwtAuthenticationToken authentication = new JwtAuthenticationToken(professorId, username);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후의 순수 토큰만 추출
        }
        return null;
    }
}