# Removing Digits

> [Problem on CSES](https://cses.fi/problemset/task/1637)

## Idea

The key insight is that the problem can be modeled as finding the shortest path from $n$ to $0$ in a graph where each node represents a number, and edges correspond to subtracting one of the digits of the number. Each step reduces the number, and the minimum number of steps corresponds to the shortest path. This formulation allows dynamic programming to efficiently compute the solution.

## Approach

1. Define `dp[i]` as the minimum number of steps required to reduce $i$ to $0$. The goal is to compute `dp[n]`.
2. Initialize `dp[0] = 0` because no steps are needed to reduce $0$ to itself.
3. For each number $i \in [1, n]$, iterate over its digits (obtained using `to_string` and character manipulation). For each non-zero digit $d$, update `dp[i]` as $\min(dp[i], dp[i - d] + 1)$ because subtracting $d$ from $i$ is a valid move that leads to $i - d$.
4. This ensures that for every $i$, `dp[i]` holds the shortest path to $0$, as each transition considers all possible digits and takes the minimum number of steps.
5. Finally, output `dp[n]`, which represents the minimum steps required to reduce $n$ to $0$.

## Complexity

- **Time:** $O(n \cdot k)$, where $n$ is the input number and $k$ is the average number of digits in numbers $\leq n$. Since $k \leq \lceil \log_{10} n \rceil$, the complexity is $O(n \log n)$.
- **Space:** $O(n)$ for the `dp` array.

## Notes

- The greedy approach (subtracting the largest digit at each step) fails for cases like $27$, where greedily subtracting $7$ leads to a suboptimal solution. Dynamic programming ensures correctness by exploring all possible transitions.
