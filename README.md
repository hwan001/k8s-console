# k8s-console

[![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)](/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/hwan001/k8s-console/ci.yaml)](https://github.com/hwan001/k8s-console/actions)
[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hwan001/k8s-console/pulls)

**k8s-console**은 여러 Kubernetes 클러스터를 중앙에서 실시간으로 모니터링하고 제어할 수 있는
**agent 기반 RBAC 콘솔**입니다.
추후 AWX처럼 원격 프로비저닝 기능을 지원할 예정입니다.

- 웹 기반 실시간 모니터링
- 클러스터/네임스페이스 단위 RBAC 제어
- 에이전트 설치만으로 손쉬운 통합
- 확장 가능한 백엔드 API

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
