# Coin Combinations II

> [Problem on CSES](https://cses.fi/problemset/task/1636)

## Idea

The key insight is that the number of ways to form a sum $x$ using the first $i$ coins can be expressed recursively: if we use a coin $c_i$, the remaining sum to form is $x - c_i$. This leads to the recurrence $d[j] = d[j] + d[j - c_i]$, where $d[j]$ tracks the number of ways to form sum $j$. By iterating over each coin and updating all possible sums, we ensure every combination is counted exactly once, preserving order.

## Approach

1. Define a dynamic programming array `d` where `d[j]` represents the number of ways to form sum $j$ using the first $i$ coins. Initialize `d[0] = 1` since there is exactly one way to form sum $0$: using no coins.
2. Iterate through each coin $c_i$. For every possible sum $j \geq c_i$, update `d[j]` as `d[j] = d[j] + d[j - c_i]`. This accounts for all ways to form $j$ by adding $c_i$ to combinations that form $j - c_i$.
3. After processing all coins, `d[x]` contains the total number of ways to form the target sum $x$ modulo $10^9 + 7$.

This approach guarantees correctness because each coin is processed sequentially, ensuring that order is preserved in the combinations.

## Complexity

- **Time:** $O(n \cdot x)$ — $n$ coins, each updating up to $x$ sums.
- **Space:** $O(x)$ — for the dynamic programming array `d`.

## Notes

- Modular arithmetic ensures no overflow when updating `d[j]`.
