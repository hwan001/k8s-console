# Contributing Guide

감사합니다 🙌
k8s-console에 기여하려면 아래 규칙을 따라주세요.

## Branch / Commit 컨벤션

- 모든 작업은 `feature/`, `fix/`, `docs/` 등 prefix로 시작합니다.
- 커밋 메시지는 다음 규칙을 따릅니다:
  예:
  `feat(agent): support remote provisioning`
  `fix(be): handle API error in controller`

## Code Style

- backend:
- frontend: ESLint + Prettier
- 모든 PR은 CI를 통과해야 merge 가능

## 테스트

- 단위 테스트 필수 (`make test` 통과)
- 새로운 기능은 반드시 e2e test 케이스 추가

## PR & Review

- PR 제목은 명확히, 설명은 “무엇을, 왜” 중심으로 작성
- Reviewer는 최소 1명 필요
- Approved 되면 squash merge로 병합
