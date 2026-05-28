---
id: "202605191618"
tags:
created: 2026/05/19
links: "[[Telco Solution Architecture]]"
source:
---
Most enterprises don't replace MPLS fully and immediately. Instead they operate MPLS, broadband, DIA and LTE/5G simultaneously. This is called Hybrid WAN because different applications have different WAN usage. 

For example:

| Traffic type | Preferred transport |
| ------------ | ------------------- |
| Voice        | MPLS                |
| ERP          | MPLS or Premium DIA |
| SaaS         | Broadband / DIA     |
| Guest WiFi   | Internet            |
| Backup       | cheapest path       |
Hybrid WAN allows gradual migration, risk reduction and cost optimization