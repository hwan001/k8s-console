#!/bin/bash
set -e

SERVICE=$1

if [ -z "$SERVICE" ]; then
  echo "ERROR: 서비스 이름을 입력하세요."
  echo "  사용법: ./scripts/tag.sh <service>"
  echo "  예: ./scripts/tag.sh agent|be|fe"
  exit 1
fi

DATE=$(date +'%Y-%m-%d')

# 태그 가져오기
git fetch --prune --tags

# 최근 태그 검색
LATEST=$(git tag | grep "^${SERVICE}-${DATE}" | sort | tail -n1)

if [ -z "$LATEST" ]; then
  NEXT_NUM=01
else
  LAST_NUM=$(echo "$LATEST" | awk -F'-' '{print $NF}')
  NEXT_NUM=$(printf "%02d" $((10#$LAST_NUM + 1)))
fi

TAG="${SERVICE}-${DATE}-${NEXT_NUM}"

echo "Creating tag: $TAG"
git tag "$TAG"
git push origin "$TAG"
echo "Triggered GitHub Actions for $TAG"
