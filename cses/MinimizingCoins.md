# Minimizing Coins

> [Problem on CSES](https://cses.fi/problemset/task/1634)

## Idea

The key insight is that the problem can be reduced to finding the smallest number of coins needed to form every sum from $0$ to $x$. This can be achieved using dynamic programming: if we already know the minimum number of coins required for a smaller sum $i - c_j$, we can compute the minimum for $i$ by adding one coin of value $c_j$. This works because the optimal solution for $i$ must involve the optimal solution for $i - c_j$.

## Approach

1. Define a dynamic programming array `dp` where `dp[i]` represents the minimum number of coins required to form the sum $i$. Initialize `dp[0] = 0` since zero coins are needed to form a sum of $0$, and set all other values to a large number (e.g., $10^9$) to represent that those sums are initially unreachable.

2. Iterate over all possible sums $i$ from $1$ to $x$. For each sum $i$, iterate over all coin values $c_j$. If $c_j \leq i$, update `dp[i]` as $\min(dp[i], dp[i - c_j] + 1)$ because adding one coin of value $c_j$ to the optimal solution for $i - c_j$ gives a valid solution for $i$.

3. After processing all sums, the value of `dp[x]` represents the minimum number of coins required to form the sum $x$. If `dp[x]` remains equal to the initial large value, output $-1$ to indicate that the sum $x$ cannot be formed.

## Complexity

- **Time:** $O(n \cdot x)$ — for each sum $i \in [1, x]$, we iterate over $n$ coin values.
- **Space:** $O(x)$ — for the `dp` array storing results for sums up to $x$.

## Notes

- The large initialization value ($10^9$) ensures that unreachable sums are correctly identified as $-1$ in the output.
