# Understand Graph

## Output
The local knowledge graph was written to:

```
.understand-anything/knowledge-graph.json
```

## Graph Contents
- Project file nodes: 220
- Total nodes including functions/classes: 448
- Import, lazy-load, and containment edges: 432
- Layers: 10
- Tour steps: 6

## Method
This graph uses deterministic understand-anything scripts for file discovery, import resolution, and structural extraction. Semantic summaries and layer descriptions were generated locally from the scan, import map, direct source review, and known app architecture.

## Important Limitation
The full understand skill normally dispatches specialized subagents for richer semantic graph nodes. This Codex session did not use delegated subagents, so the graph intentionally favors deterministic source facts and explicit architecture docs over speculative semantic expansion.
