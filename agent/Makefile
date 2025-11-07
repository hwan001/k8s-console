
LOCAL_TASKS := local-run proto-gen
COMMON_TASKS := run proto

.PHONY: $(BUILD_TASKS) $(COMMON_TASKS)

run: local-run

proto: proto-gen

local-run:
	uv run python3 src/agent/main.py

proto-gen:
	@echo "Cleaning old generated proto files..."
	rm -f src/agent/*_pb2.py src/agent/*_pb2_grpc.py
	@echo "Generating gRPC Python stubs..."
	uv run python -m grpc_tools.protoc \
		-I=../protos \
		--python_out=src/agent \
		--grpc_python_out=src/agent \
		../protos/*.proto
	@echo "Proto generation complete."
