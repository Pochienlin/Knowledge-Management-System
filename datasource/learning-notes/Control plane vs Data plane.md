---
id: "202605191551"
tags:
created: 2026/05/19
links: "[[SD-WAN]]"
source:
---
The core concept of this segregation is to separate concerns in system resource use. While control plane should ideally be a single instance to avoid conflicts, are usually smart, lightweight and handles policy, routing, configs, etc, data plane are usually more resource-heavy, runs the bulk of workloads, require scaling and replication and handles higher volumes. Separating these two means we can have a single lightweight control plane, with a scalable and bulkier data plane and allocate the appropriate sizes to these two.

This concept is a common architectural pattern, not just within networks

# In SD-WAN
Data plane usually carries the actual traffic, e.g.:
1. Application packets
2. User traffic
3. Voice / video

Control plane usually carries intelligence and policy, e.g.:
- Routing policy
- Path selection
- Orchestration
- Tunnel management

Traditional WANs distributed control locally, while SD-WAN centralizes policy decisions through [[Centralized SD-WAN orchestration]]. This creates simpler operations, consistent policy and faster deployment.