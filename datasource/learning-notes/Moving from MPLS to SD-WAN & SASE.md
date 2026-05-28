---
id: "202605191150"
tags:
created: 2026/05/19
links: "[[Telco Solution Architecture]]"
source:
---
Internet bandwidth became cheaper, faster, and globally available.

In response, modern enterprises increasingly use:
- Broadband internet
- DIA
- LTE/5G
- Cloud conenctivity

The trade-offs are:
1. Unpredictable latency
2. Packet loss
3. Inconsistent performance

SD-WAN emerged to intelligently manage this variability

### Shifting towards SaaS, SDWAN and SASE
Traditional WANs assumed apps were centralized, but SaaS apps live on the internet

Backhauling SaaS traffic to HQ creates latency, congestion, poor UX. So enterprises moved towards local internet breakout, cloud-first WAN design, and distributed security. This directly led to SD-WAN, SASE and SSE.


## MPLS advantages
MPLS still provides benefits that may be required, and does form complementary benefits to network design. This includes
- QoS enforcement
- Traffic engineering
- Logical Ethernet network isolation
- Predictable, deterministic path 
- SLA accountability

MPLS does not guaranty [[Network performance metrics - Latency Jitter & Packet Loss]]
- Latency
- Jitter
- Packet loss

In other words, MPLS isn't designed for newer network streaming use cases like:
- Voice
- Video
- Trading systems
- ERP
- SAP
- VDI