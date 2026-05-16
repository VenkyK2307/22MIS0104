# Stage 1: Notification System Design

## Core Strategy
Incoming notifications are prioritized dynamically using a multi-layered composite matrix:
1. **Category Weight:** `Placement` (Weight 3) > `Result` (Weight 2) > `Event` (Weight 1).
2. **Recency:** Timestamps break ties, placing newer updates first.

## Efficiency Optimization
Instead of running expensive global sorts ($O(K \log K)$) on the client application, the system handles real-time data using bounded array slicing mimicking priority queue behavior:
* **Time Complexity:** $O(K \log n)$ where $K$ represents total streamed entries and $n = 10$.
* **Space Complexity:** $O(n)$ memory footprint.
* **Stream Maintenance:** Evaluation against local boundaries executes in $O(1)$ constant time, keeping the interface snappy during peak student load.