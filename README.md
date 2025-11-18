# k8s-console

[![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)](/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/hwan001/k8s-console/ci.yaml)](https://github.com/hwan001/k8s-console/actions)
[![CodeQL](https://github.com/hwan001/k8s-console/actions/workflows/codeql.yml/badge.svg)](https://github.com/hwan001/k8s-console/actions/workflows/codeql.yml)
[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hwan001/k8s-console/pulls)

**k8s-console**은 여러 Kubernetes 클러스터를 중앙에서 실시간으로 모니터링, 제어, 공유 할 수 있는
**agent 기반 콘솔 시스템**입니다.

## 기능 및 특성

아래 기능을 개발할 예정입니다.

- RBAC 기반으로 내 클러스터의 리소스를 공유 (또는 판매 + Cluster owner 개념)
- 클러스터 접근 권한을 UI로 설정하고 config로 제공
- Billing API를 활용한 사용량 통계

(개발이 완료되면) 아래 특성을 가지고 있습니다.

- 설치 스크립트 또는 OCI 제공으로 쉬운 Agent 설치
- 오토스케일링 지원 (Self-hosted Server일 경우)

## 문서

- [한국어 문서](/docs/ko/README.md)
- [English Docs](/docs/en/README.md) _(coming soon)_

## 최신 이미지

| Platform | Image                               | Tag                                                                                                        | Link                                                                              |
| -------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| GHCR     | `ghcr.io/hwan001/k8s-console/be`    | ![BE](https://img.shields.io/github/v/tag/hwan001/k8s-console?filter=be*&label=tag&cacheSeconds=300)       | [View](https://github.com/hwan001/k8s-console/pkgs/container/k8s-console%2Fbe)    |
| GHCR     | `ghcr.io/hwan001/k8s-console/fe`    | ![FE](https://img.shields.io/github/v/tag/hwan001/k8s-console?filter=fe*&label=tag&cacheSeconds=300)       | [View](https://github.com/hwan001/k8s-console/pkgs/container/k8s-console%2Ffe)    |
| GHCR     | `ghcr.io/hwan001/k8s-console/agent` | ![Agent](https://img.shields.io/github/v/tag/hwan001/k8s-console?filter=agent*&label=tag&cacheSeconds=300) | [View](https://github.com/hwan001/k8s-console/pkgs/container/k8s-console%2Fagent) |

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.
See the [LICENSE](/LICENSE) file for details.
