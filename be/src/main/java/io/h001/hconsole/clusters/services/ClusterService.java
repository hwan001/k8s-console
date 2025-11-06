package io.h001.hconsole.clusters.services;

import org.springframework.stereotype.Service;

import io.h001.hconsole.global.hasura.HasuraClient;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClusterService {

  private final HasuraClient hasuraClient;

  public void fetchClusters() {
    String query = """
            query {
              clusters {
                id
                name
                status
              }
            }
        """;

    String response = hasuraClient.query(query);
    System.out.println("Hasura response: " + response);
  }

  public String getAllClusters() {
    String gql = """
            query {
              clusters {
                id
                name
                status
                created_at
              }
            }
        """;

    return hasuraClient.query(gql);
  }
}
