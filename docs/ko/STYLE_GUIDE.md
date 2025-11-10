# Style Guide

## Backend (Java 17 + Srping boot 3.5.x)

- 패키지 구조: `cmd/`, `internal/`, `pkg/`
- 네이밍: `CamelCase` for types, `snake_case` for variables
- 에러 처리: `fmt.Errorf` + `errors.Is/As` 사용

## Frontend (Next.js)

- 파일명: `PascalCase` for components, `kebab-case` for utils
- 코드 스타일: Prettier default, ESLint + Airbnb config
- import 순서: React → 3rd party → local

## Agent (Python)

## Docs (MD)

- 문서 언어: 한국어 우선, 이후 영어 버전 확장
- 마크다운 문법: GitHub Flavored Markdown (GFM)
