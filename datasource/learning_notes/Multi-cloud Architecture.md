---
id: "202605191522"
tags:
created: 2026/05/19
links: "[[Telco Solution Architecture]]"
source:
---
Many enterprises chooses to use AWS, Azure and GCP at the same time. This is usually motivated by several reasons, including
- Avoiding vendor lock-in
- Regional capabilities
- Different business units
- M&A environments
- Specialized services 

This creates challenges in:
- Inter-cloud connectivity
- Routing policy
- Security consistency
- Cost optimization

Networking becomes cloud-to-cloud, not just site-to-site

```ad-question
How do we maintain routing intent, segmentation, security policies and observability across different providers?
```
This is a reason why SD-WAN, SASE and cloud networking platforms become strategically important