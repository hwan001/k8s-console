## 로컬 개발 환경 구성

- 각 경로에서 실행

- fe

  ```sh
  make init # npm i
  make build # npm run build
  make run # npm run dev
  ```

- be

  ```sh
  make build # ./gradlew build
  make run # java -jar ./build/libs/hconsole-0.0.1-SNAPSHOT.jar
  make proto # ./gradlew clean generateProto
  ```

- agent

  ```sh
  make run # uv run python3 src/agent/main.py
  make proto # ...
  ```

- redis

  ```sh
  docker compose -f ./infra/local/docker-compose.redis.yml up -d
  ```

- database

  ```sh
  docker compose -f ./infra/local/docker-compose.data.yml up -d
  ```

---

## Docker로 한번에 구성하기

- docker-compose.yml 활용 (작성 예정)

---

## k8s에 배포하기

- Helm charts 활용 (작성 예정)
