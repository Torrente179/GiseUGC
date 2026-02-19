# Vercel Firewall Rules (Manual UI Setup)

These are dashboard-level rules and are not managed through repository files.

## Rule 1: Block Unexpected Methods

- Action: `Deny`
- Expression:
  - `method NOT IN ["GET", "HEAD", "OPTIONS"]`

## Rule 2: Enforce Host Header

- Action: `Deny`
- Expression:
  - `host NOT IN ["www.giselasaldarriaga.com", "giselasaldarriaga.com"]`

## Rule 3: Block Scanner User-Agents

- Action: `Deny`
- Expression:
  - `user_agent CONTAINS_ANY ["sqlmap", "nikto", "acunetix", "masscan", "nmap", "zgrab", "dirbuster"]`

## Rollout Notes

1. Apply rules in monitor-only mode first if available.
2. Watch for false positives for at least 24 hours.
3. Move to deny mode once validated.
