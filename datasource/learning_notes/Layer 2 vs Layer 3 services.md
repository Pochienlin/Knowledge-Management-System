---
id: "202605191424"
tags:
created: 2026/05/19
links: "[[Telco Solution Architecture]]"
source:
---
Key distinction: Who is in charge of routing?
## Layer 2 services
Layer 2 services extend ethernet between locations. The carrier transport frames transparently while customer controls IP addressing, routing, segmentation, routing protocols, etc. 

Examples include E-Line, EPL, EVPL, VPLS. i.e. "The carrier gives me a virtual cable"

### Common use cases
1. Data centre interconnect (DCI)
2. Financial trading
3. Storage replication
4. Enterprise-managed routing
5. Multi-cloud interconnects

| Advantages                 | Disadvantages                       |
| -------------------------- | ----------------------------------- |
| Customer control           | Customer-managed routing complexity |
| Protocol transparency      | Scaling can be difficult            |
| Deterministic connectivity |                                     |

## Layer 3 services

Lyer 3 services are routed WAN services. The carrier participates in the routing. 

Examples include MPLS IPVPN, Managed WAN, global IP VPN. Carriers handle WAN routing, reachability and core transport while customer manages Branch LANs, policy, applications. i.e. "The carrier manages the WAN for me"

| Advantages                       | Disadvantages        |
| -------------------------------- | -------------------- |
| Operational simplicity           | Less control         |
| Scalable any-to-any connectivity | Provider dependency  |
| Managed QoS                      | Slower change cycles |
