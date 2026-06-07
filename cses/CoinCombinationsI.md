# CoinCombinationsI

> [Problem on CSES](https://cses.fi/problemset/task/1635)

## Idea

The key insight is that the number of ways to form a sum $x$ using the given coins can be expressed recursively: if we know the number of ways to form smaller sums $x - c_i$ (where $c_i$ is the value of a coin), we can compute the number of ways to form $x$. This is because any valid combination for $x - c_i$ can be extended by appending the coin $c_i$ to form $x$. This dynamic programming approach works because the order of coins matters, aligning with the problem's definition of distinct ways.

## Approach

1. Define a dynamic programming array `dp` where `dp[i]` represents the number of ways to form the sum $i$ using the given coins. Initialize `dp[0] = 1` because there is exactly one way to form a sum of $0$: using no coins.

2. Iterate over all possible sums $i$ from $1$ to $x$. For each sum, iterate over all coin values $c_j$ in the input.

3. If the current coin value $c_j$ can contribute to the sum $i$ (i.e., $i \geq c_j$), update `dp[i]` by adding `dp[i - c_j] \pmod{10^9 + 7}`. This addition corresponds to extending all combinations that form $i - c_j$ by appending the coin $c_j$.

4. After processing all sums up to $x$, the value of `dp[x]` will contain the total number of distinct ways to form the sum $x$, modulo $10^9 + 7$.

## Complexity

- **Time:** $O(n \cdot x)$ — for each of the $x$ sums, we iterate over $n$ coins.
- **Space:** $O(x)$ — for the `dp` array storing the number of ways to form each sum.

## Notes

- Modular arithmetic is applied during every update to `dp[i]` to prevent overflow and ensure the result stays within the bounds of $10^9 + 7$.
