---
id: "202605191559"
tags:
created: 2026/05/19
links: "[[SD-WAN]]"
source:
aliases:
  - Application_Steering
---
Traditional routing defined architecture by transport, while SD-WAN defines architecture through policy.

Traditional routing chooses paths based mainly on destinations and routing tables. SD-WAN instead chooses path based on:
1. Application type
2. Latency
3. Jitter
4. Packet loss
5. Business policy

For instance, an enterprise would want conference calls to be at the lowest jitter, or their IT ticket system to have the lowest packet loss, while backup can take its time on the cheapest path, and Guest WiFi will be segregated to internet only.

This is called dynamic path selection and application steering