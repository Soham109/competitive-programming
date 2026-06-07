# DiceCombinations

> [Problem on CSES](https://cses.fi/problemset/task/1633)

## Idea

The key insight is that the number of ways to construct a sum $n$ can be expressed recursively: $dp[i]$ (the number of ways to form sum $i$) is the sum of $dp[i-1], dp[i-2], \dots, dp[i-6]$, provided $i-j \geq 0$. This works because any valid sequence to form $i$ must end with one of six dice values, and removing the last dice roll leaves a smaller sum $i-j$ that must also be valid. This recurrence guarantees correctness because it enumerates all possible ways to reach $i$ by considering every valid last dice roll.

## Approach

1. Define a dynamic programming array `dp` where `dp[i]` represents the number of ways to form sum $i$ using dice rolls. Initialize `dp[0] = 1` because there is exactly one way to form sum $0$: using no dice rolls.
2. Iterate over all sums $i$ from $1$ to $n$. For each sum $i$, compute `dp[i]` as the sum of `dp[i-j]` for all $j \in [1, 6]$ where $i-j \geq 0$. This accounts for all ways to reach $i$ by adding a single dice roll to a valid smaller sum.
3. Use modular arithmetic (`\pmod{10^9+7}`) at every step to ensure the result fits within the constraints and avoids overflow.
4. Output `dp[n]`, which contains the total number of ways to form the target sum $n$.

## Complexity

- **Time:** $O(n)$ — Each sum $i$ requires up to $6$ additions, making the total work proportional to $n$.
- **Space:** $O(n)$ — The `dp` array stores $n+1$ values.

## Notes

- Modular arithmetic is applied at every update of `dp[i]` to prevent overflow and ensure the result is within the problem's constraints.
