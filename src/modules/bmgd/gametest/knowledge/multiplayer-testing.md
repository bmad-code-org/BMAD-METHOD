# Multiplayer Testing Guide

## Overview

Multiplayer testing validates network code, synchronization, and the player experience under real-world conditions. Network bugs are notoriously hard to reproduce—systematic testing is essential.

## Test Categories

### Synchronization Testing

| Test Type           | Description                              | Priority |
| ------------------- | ---------------------------------------- | -------- |
| State sync          | All clients see consistent game state    | P0       |
| Position sync       | Character positions match across clients | P0       |
| Event ordering      | Actions occur in correct sequence        | P0       |
| Conflict resolution | Simultaneous actions handled correctly   | P1       |
| Late join           | New players sync correctly mid-game      | P1       |

### Network Conditions

| Condition       | Simulation Method | Test Focus               |
| --------------- | ----------------- | ------------------------ |
| High latency    | 200-500ms delay   | Input responsiveness     |
| Packet loss     | 5-20% drop rate   | State recovery           |
| Jitter          | Variable delay    | Interpolation smoothness |
| Bandwidth limit | Throttle to 1Mbps | Data prioritization      |
| Disconnection   | Kill connection   | Reconnection handling    |

## Test Scenarios

### Basic Multiplayer

```
SCENARIO: Player Join/Leave
  GIVEN host has started multiplayer session
  WHEN Player 2 joins
  THEN Player 2 appears in host's game
  AND Player 1 appears in Player 2's game
  AND player counts sync across all clients

SCENARIO: State Synchronization
  GIVEN 4 players in match
  WHEN Player 1 picks up item at position (10, 5)
  THEN item disappears for all players
  AND Player 1's inventory updates for all players
  AND no duplicate pickups possible

SCENARIO: Combat Synchronization
  GIVEN Player 1 attacks Player 2
  WHEN attack hits
  THEN damage is consistent on all clients
  AND hit effects play for all players
  AND health updates sync within 100ms
```

### Network Degradation

```
SCENARIO: High Latency Gameplay
  GIVEN 200ms latency between players
  WHEN Player 1 moves forward
  THEN movement is smooth on Player 1's screen
  AND other players see interpolated movement
  AND position converges within 500ms

SCENARIO: Packet Loss Recovery
  GIVEN 10% packet loss
  WHEN important game event occurs (goal, kill, etc.)
  THEN event is eventually delivered
  AND game state remains consistent
  AND no duplicate events processed

SCENARIO: Player Disconnection
  GIVEN Player 2 disconnects unexpectedly
  WHEN 5 seconds pass
  THEN other players are notified
  AND Player 2's character handles gracefully (despawn/AI takeover)
  AND game continues without crash
```

### Edge Cases

```
SCENARIO: Simultaneous Actions
  GIVEN Player 1 and Player 2 grab same item simultaneously
  WHEN both inputs arrive at server
  THEN only one player receives item
  AND other player sees consistent state
  AND no item duplication

SCENARIO: Host Migration
  GIVEN host disconnects
  WHEN migration begins
  THEN new host is selected
  AND game state transfers correctly
  AND gameplay resumes within 10 seconds

SCENARIO: Reconnection
  GIVEN Player 2 disconnects temporarily
  WHEN Player 2 reconnects within 60 seconds
  THEN Player 2 rejoins same session
  AND state is synchronized
  AND progress is preserved
```

## Network Simulation Tools

### Unity

```csharp
// Using Unity Transport with Network Simulator
using Unity.Netcode;

public class NetworkSimulator : MonoBehaviour
{
    [SerializeField] private int latencyMs = 100;
    [SerializeField] private float packetLossPercent = 5f;
    [SerializeField] private int jitterMs = 20;

    void Start()
    {
        var transport = NetworkManager.Singleton.GetComponent<UnityTransport>();
        var simulator = transport.GetSimulatorParameters();

        simulator.PacketDelayMS = latencyMs;
        simulator.PacketDropRate = (int)(packetLossPercent * 100);
        simulator.PacketJitterMS = jitterMs;
    }
}

// Test
[UnityTest]
public IEnumerator Position_UnderLatency_ConvergesWithinThreshold()
{
    EnableNetworkSimulation(latencyMs: 200);

    // Move player
    player1.Move(Vector3.forward * 10);

    yield return new WaitForSeconds(1f);

    // Check other client's view
    var player1OnClient2 = client2.GetPlayerPosition(player1.Id);
    var actualPosition = player1.transform.position;

    Assert.Less(Vector3.Distance(player1OnClient2, actualPosition), 0.5f);
}
```

### Unreal

```cpp
// Using Network Emulation
void UNetworkTestHelper::EnableLatencySimulation(int32 LatencyMs)
{
    if (UNetDriver* NetDriver = GetWorld()->GetNetDriver())
    {
        FPacketSimulationSettings Settings;
        Settings.PktLag = LatencyMs;
        Settings.PktLagVariance = LatencyMs / 10;
        Settings.PktLoss = 0;

        NetDriver->SetPacketSimulationSettings(Settings);
    }
}

// Functional test for sync
void AMultiplayerSyncTest::StartTest()
{
    Super::StartTest();

    // Spawn item on server
    APickupItem* Item = GetWorld()->SpawnActor<APickupItem>(
        ItemClass, FVector(0, 0, 100));

    // Wait for replication
    FTimerHandle TimerHandle;
    GetWorld()->GetTimerManager().SetTimer(TimerHandle, [this, Item]()
    {
        // Verify client has item
        if (VerifyItemExistsOnAllClients(Item))
        {
            FinishTest(EFunctionalTestResult::Succeeded, "Item replicated");
        }
        else
        {
            FinishTest(EFunctionalTestResult::Failed, "Item not found on clients");
        }
    }, 2.0f, false);
}
```

### Godot

```gdscript
# Network simulation
extends Node

var simulated_latency_ms := 0
var packet_loss_percent := 0.0

func _ready():
    # Hook into network to simulate conditions
    multiplayer.peer_packet_received.connect(_on_packet_received)

func _on_packet_received(id: int, packet: PackedByteArray):
    if packet_loss_percent > 0 and randf() < packet_loss_percent / 100:
        return  # Drop packet

    if simulated_latency_ms > 0:
        await get_tree().create_timer(simulated_latency_ms / 1000.0).timeout

    _process_packet(id, packet)

# Test
func test_position_sync_under_latency():
    NetworkSimulator.simulated_latency_ms = 200

    # Move player on host
    host_player.position = Vector3(100, 0, 100)

    await get_tree().create_timer(1.0).timeout

    # Check client view
    var client_view_position = client.get_remote_player_position(host_player.id)
    var distance = host_player.position.distance_to(client_view_position)

    assert_lt(distance, 1.0, "Position should converge within 1 unit")
```

## Dedicated Server Testing

### Test Matrix

| Scenario              | Test Focus                           |
| --------------------- | ------------------------------------ |
| Server startup        | Clean initialization, port binding   |
| Client authentication | Login validation, session management |
| Server tick rate      | Consistent updates under load        |
| Maximum players       | Performance at player cap            |
| Server crash recovery | State preservation, reconnection     |

### Load Testing

```
SCENARIO: Maximum Players
  GIVEN server configured for 64 players
  WHEN 64 players connect
  THEN all connections succeed
  AND server tick rate stays above 60Hz
  AND latency stays below 50ms

SCENARIO: Stress Test
  GIVEN 64 players performing actions simultaneously
  WHEN running for 10 minutes
  THEN no memory leaks
  AND no desync events
  AND server CPU below 80%
```

## Matchmaking Testing

```
SCENARIO: Skill-Based Matching
  GIVEN players with skill ratings [1000, 1050, 2000, 2100]
  WHEN matchmaking runs
  THEN [1000, 1050] are grouped together
  AND [2000, 2100] are grouped together

SCENARIO: Region Matching
  GIVEN players from US-East, US-West, EU
  WHEN matchmaking runs
  THEN players prefer same-region matches
  AND cross-region only when necessary
  AND latency is acceptable for all players

SCENARIO: Queue Timeout
  GIVEN player waiting in queue
  WHEN 3 minutes pass without match
  THEN matchmaking expands search criteria
  AND player is notified of expanded search
```

## Security Testing

| Vulnerability    | Test Method                 |
| ---------------- | --------------------------- |
| Speed hacking    | Validate movement on server |
| Teleportation    | Check position delta limits |
| Damage hacking   | Server-authoritative damage |
| Packet injection | Validate packet checksums   |
| Replay attacks   | Use unique session tokens   |

## Performance Metrics

| Metric                | Good      | Acceptable | Poor       |
| --------------------- | --------- | ---------- | ---------- |
| Round-trip latency    | < 50ms    | < 100ms    | > 150ms    |
| Sync delta            | < 100ms   | < 200ms    | > 500ms    |
| Packet loss tolerance | < 5%      | < 10%      | > 15%      |
| Bandwidth per player  | < 10 KB/s | < 50 KB/s  | > 100 KB/s |
| Server tick rate      | 60+ Hz    | 30+ Hz     | < 20 Hz    |

## Best Practices

### DO

- Test with real network conditions, not just localhost
- Simulate worst-case scenarios (high latency + packet loss)
- Use server-authoritative design for competitive games
- Implement lag compensation for fast-paced games
- Test host migration paths
- Log network events for debugging

### DON'T

- Trust client data for important game state
- Assume stable connections
- Skip testing with maximum player counts
- Ignore edge cases (simultaneous actions)
- Test only in ideal network conditions
- Forget to test reconnection flows
