---
id: "202605191641"
tags:
created: 2026/05/19
links: "[[SD-WAN]]"
source:
---
# Traditional Provisioning
Historically, deploying branch networking is operationally painful:
1. Ship router / NGFW to site
2. Engineers configure manually
3. Local staff connects equipment
4. Engineer validates remotely
5. Troubleshoot configs line-by-line

Pain points:
1. Slow rollout
2. Human error
3. Inconsistent configs
4. Expensive skilled labor
5. Difficult multinational scaling 
# Zero-Touch
Means that a device can automatically onboard and receive configuration with minimal manual intervention.

Typical flow:
1. Device shipped to branch
2. Local staff plugs in:
	1. Power
	2. WAN Links
3. Device gets internet connectivity
4. Device contacts orchestrator / controller
5. Device authenticates
6. Configuration downloads automatically 

No CLI staging is required onsite, enabling a plug-and-play SD-WAN

# Commercial benefits
1. Deployment
	1. No need for field engineers to travel onsite and stage configs
	2. Rollout speed no longer limited by manpower
	3. Standardization improves
2. Operations
	1. Centralized settings through 
		1. Templates
		2. Policy
		3. Orchestration
		4. Device ID
	2. Orchestrator knows the type of branch (site type)
	3. More scalable to operate than per router management

# Limitations
- Local ISP delays
- Wrong cabling
- NAT / Firewall restrictions
- Incorrect serial registration
- Local power issues
- Customs / logistics delay

WAN deployment problems are often operational, not technical. A huge amount of project managemet in WAN rollout revolves around logistics, local coordination, circuit readiness and cross-country dependencies