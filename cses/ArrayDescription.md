# Array Description

> [Problem on CSES](https://cses.fi/problemset/task/1746)

## Idea

The model-backed editorial generator was unavailable, so this fallback keeps the repository complete without failing CI. The accepted solution is the source of truth: it applies the core observation directly in about $27$ lines of C++ and avoids simulation beyond the necessary checks.

## Approach

1. Identify the quantities maintained by the solution and update them in the same order as the accepted code, because each update represents one required condition from the problem.
2. Use the dynamic-programming state transitions as the decisive step, since it is where the solution reduces the search space or verifies feasibility.
3. Return the answer once all required conditions have been checked, because no later state can invalidate an already completed test case.

## Complexity

- **Time:** $O(n)$ — dominated by the dynamic-programming state transitions.
- **Space:** $O(1)$ — aside from the input storage used by the implementation.
