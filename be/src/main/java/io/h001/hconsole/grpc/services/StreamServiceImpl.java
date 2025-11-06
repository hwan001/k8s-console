package io.h001.hconsole.grpc.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.grpc.stub.StreamObserver;
import io.h001.hconsole.grpc.Log;
import io.h001.hconsole.grpc.Metric;
import io.h001.hconsole.grpc.Response;
import io.h001.hconsole.grpc.StreamPayload;
import io.h001.hconsole.grpc.StreamServiceGrpc;
import io.h001.hconsole.grpc.dto.LogResponse;
import io.h001.hconsole.grpc.dto.MetricResponse;
import io.h001.hconsole.redis.services.RedisPublisherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class StreamServiceImpl extends StreamServiceGrpc.StreamServiceImplBase {

    private final ObjectMapper objectMapper;
    private final RedisPublisherService redisPublisherService;

    @Override
    public StreamObserver<StreamPayload> sendStream(StreamObserver<Response> responseObserver) {

        return new StreamObserver<>() {
            @Override
            public void onNext(StreamPayload payload) {
                try {
                    String channel = "username:7:";

                    if (payload.hasMetric()) {
                        Metric metric = payload.getMetric();
                        MetricResponse dto = MetricResponse.fromGrpc(metric);
                        String json = objectMapper.writeValueAsString(dto);

                        redisPublisherService.publish(channel + "metric", json);
                        log.info("[STREAM][{}] Published metric: {}", channel, json);
                    } else if (payload.hasLog()) {
                        Log logMsg = payload.getLog();
                        LogResponse dto = LogResponse.fromGrpc(logMsg);
                        String json = objectMapper.writeValueAsString(dto);

                        redisPublisherService.publish(channel + "log", json);
                        log.info("[STREAM][{}] Published log: {}", channel, json);
                    }

                } catch (Exception e) {
                    log.error("[STREAM] Error processing payload", e);
                }
            }

            @Override
            public void onError(Throwable t) {
                log.error("[STREAM] Error: {}", t.getMessage());
            }

            @Override
            public void onCompleted() {
                Response response = Response.newBuilder().setSuccess(true).build();
                responseObserver.onNext(response);
                responseObserver.onCompleted();
                log.info("[STREAM] Completed.");
            }
        };
    }
}
