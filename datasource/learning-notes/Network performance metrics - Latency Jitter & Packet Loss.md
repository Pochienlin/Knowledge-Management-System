---
id: "202605191204"
tags:
  - MPLS
  - WAN
created: 2026/05/19
links: "[[Telco Solution Architecture]]"
source:
---
These metrics help explain why premium connectivity matters
## Latency
is the time it takes for data to travel from source to destination, usually measured in milliseconds

Low latency matters for:
- Voice / video
- Trading systems
- Gaming
- VDI
- Real-time applications

As higher latency causes slower responses, lag, and poor UX

## Jitter
is the variation in latency over time. If packets arrive with great variation in latency, that would mean the network has high jitter.

Real-time applications expect smooth packet timing. High jitter would put packets out of order and cause robotic-sounding voice streams, frozen video feeds, choppy calls and instability in video conferences. This is often more damaging to UX than raw latency

## Packet loss
happens when packets fail to arrive at their intended destination. This might be caused by congestion, bad circuits, overloaded links, wireless instability. The effects of this are retransmissions (depending on the protocol used), poor application performance, broken feeds, and TCP slowdown. Even 1% of loss can severely damage streaming experience

