---
id: "202605191051"
tags:
  - syllabus
created: 2026/05/19
links:
source:
---
# 1.0 Enterprise Networking Foundations

## 1.1 Enterprise WANs
What every enterprise architect must understand before products 

### Goals
To understand why enterprise WANs exist, how MNCs connect sites, business drivers behind network tarnsformation 

### Core concepts:
1. [[Network sites]] Branches, HQs, DCs, cloud, remote users
2. [[Wide Area Networks]] Legacy WAN vs. internet-centric WAN
3. [[Network Underlay & Overlay]]
4. [[Network performance metrics - Latency Jitter & Packet Loss]] and [[Service level agreement for networks|SLA]]
5. [[Moving from MPLS to SD-WAN & SASE]]

----
## 1.2 Routing, Transport, Basics of international connectivity

### Goals
To understand how traffic moves internationally and what carriers actually sell

```ad-summary
Enterprises do not care about the specific product per se, but they do care about reliability, availability, access to cloud / intranet / DC, latency, security, operational simplicity etc
```

### Core Concepts 
1. [[Packet transit]] IP Transits, MPLS, Ethernet, Internet DIA
2. [[Layer 2 vs Layer 3 services]]
3. [[Global internet infrastructure]] Subsea cables, PoPs, backbone networks
4. [[Last-mile network access]] Last mile access vs global backbone
5. [[Carrier neutrality & interconnects]]

---
## 1.3 Enterprise Cloud Connectivity

### Goals
To understand how enterprises connect securely and reliably to cloud providers like AWS/Azure/GCP

### Core Concepts
1. [[Public vs. Private cloud access]]
2. [[Public cloud interconnects]]
3. [[Hub-and-spoke vs Cloud-native networks]]
4. [[Hybrid Cloud Networking]]
5. [[Multi-cloud Architecture]]
6. [[Cloud-adjacent & strategic POPs]]
![[Cloud connectivity types]]

---
# 2.0 SD-WAN

## 2.1 SD-WAN Architecture fundamentals 
### Goals
Understand SD-WAN deeply from architecture, independent of vendor marketing

### Core concepts
1. [[SD-WAN]]
2. [[SD-WAN Overlay architecture]]
3. [[Control plane vs Data plane]]
4. [[Centralized SD-WAN orchestration]]
5. [[Application-aware routing]]
6. [[Zero-touch provisioning (ZTP)]]

---
## 2.2 SD-WAN operations and design
### Goals 
Learn how SD-WAN is actually deployed in enterprises

### Core concepts
1. [[Hybrid WANs]] MPLS + Internet + LTE/5G
2. [[Active-active pathing]]
3. [[QoS in SD-WAN]]
4. [[SD-WAN availability]] High availability and failover

## 2.3 SD-WAN vendor ecosystem
### Goals
Understand major SD-WAN platforms and how carriers package them 
### Core concepts
1. [[Comparison of SD-WAN products]]
	1. [[VMWare VeloCloud]]
	2. [[Cisco SD-WAN]] Viptela and Meraki
	3. [[Fortinet Secure SD-WAN]]
	4. [[Versa Networks]]
	5. [[HPE Aruba SD-WAN]]
2. [[Self-managed vs service managed SD-WAN]]

----
# 3.0 SASE & Security

## 3.1 SASE Fundamentals
### Goals
Understand why SD-WAN evolved into SASE

### Core concepts
1. [[Network-Cybersecurity convergence]]
2. [[ID-centric security]]
3. [[Cloud-delivered security stack]]
4. [[Branch-to-cloud security]]
5. [[User-to-cloud security]]

## 3.2 SSE Components

### Goals
Understand the security stack inside SSE

### Core Concepts
1. [[Secure Web Gateway]]
2. [[Cloud Access Security Broker]]
3. [[Zero Trust Network Access]]
4. [[Firewall-as-a-Service]]
5. [[Data loss prevention]]

----
## 3.3 SASE Architecture & Deployment
### Goals
Understand how enterprises adopt SASE practically 

### Core Concepts
1. [[Single-vendor vs. Multi-vendor SASE]]
2. [[PoP architecture]]
3. [[Network security inspection pathing]]
4. [[Remote workforce integration to networks]]
5. [[Network performance vs. security tradeoffs]]

----
# 4.0 International Carrier Services
## 4.1 International Ethernet & Private connectivity 

### Goals
Understand carrier Ethernet and private connectivity services 
### Core concepts
1. [[E-Line, EPL, EVPL]]
2. [[P2P Ethernet]]
3. [[Layer 2 VPN services]]
4. [[Deterministic bandwidth]]
5. [[Enterprise international carrier services use cases]]
### Singtel product mapping
1. [[Singtel ELine - Carrier Ethernet private connectivity]]
2. [[Singtel ConnectPlus]]
3. [[ Singtel Metro-E]]

---
## 4.2 Global IP VPN / MPLS Services
### Goals
Understand traditional carrier-managed global WAN 

### Core Concepts 
1. [[MPLS VPN Architecture]]
2. [[QoS Classes]]
3. [[Any-to-any routing]]
4. [[Global managed WAN]]
5. [[SLA-backed transport]]

### Singtel product mapping
1. [[Singtel ConnectPlus]]
2. [[Singtel Regional & Global WAN aggregation]]

----
## 4.3 International Exchange & Interconnect ecosystems

### Goals 
Understand IXs and peering ecosystems

### Core concepts
1. [[Public peering]]
2. [[Private peering]]
3. [[IX Ecosystems]]
4. [[International interconnect latency optimization]]
5. [[International exchange cloud adjacency]]
### Singtel product mapping
1. [[Singtel STiX]]
2. [[Singtel Regional interconnection ecosystem]]
3. [[Singtel Carrier & cloud peering hub]]

----
# 5.0 Telco solution architect skills
## 5.1 Discovery and requirements gathering
### Core Concepts
1. [[Telco solutions business drivers]] Put business drivers first
2. [[Telco application dependency mapping]]
3. [[Telco compliance & security requirements]]
4. [[Network traffic profiling]]
5. [[Telco solution budget vs performance trade-offs]]

---
## 5.2 Solution positioning and commercial thinking
### Core Concepts
1. [[Outcome selling]]
2. [[Managed services positioning]]
3. [[TCO vs CAPEX]]
4. [[SLA Differentiation]]
5. [[Multi-country deal complexity]]
---
# 6.0 Case studies
