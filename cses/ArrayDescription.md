# Array Description

> [Problem on CSES](https://cses.fi/problemset/task/1746)

## Idea
Adjacent values differ by at most $1$, so the count of arrays ending at value $v$ in position $i$ only depends on the counts ending at $v-1$, $v$, $v+1$ in position $i-1$. This is a classic transfer-matrix DP where the state is "value at the current position" and the transition is restricted to a window of width $3$, which keeps the whole computation linear in $n \cdot m$ instead of exponential in $n$.

## Approach
1. Define $dp[v]$ as the number of ways to fill the array up to the current index so that it ends with value $v$, for $v \in [1, m]$.
2. Initialize $dp[v] = 1$ for every $v$ if $x_1 = 0$, or $dp[x_1] = 1$ alone if $x_1$ is fixed, since the first element has no predecessor to constrain it.
3. For each next position $i$, compute a new array $ndp[v] = dp[v-1] + dp[v] + dp[v+1]$ (missing neighbors treated as $0$), because a value $v$ can only be reached from $v-1$, $v$, or $v+1$ at the previous position.
4. If $x_i \neq 0$, zero out every entry of $ndp$ except $ndp[x_i]$, since a fixed value in the description eliminates all other possibilities at that index.
5. Take every sum and update modulo $10^9 + 7$ as required by the output.
6. After processing all $n$ positions, sum $dp[v]$ over all $v \in [1, m]$ to get the total count, since the final value is unconstrained unless the description fixes it.

## Complexity
- **Time:** $O(n \cdot m)$, one $O(m)$ transition per array position.
- **Space:** $O(m)$, keeping only the current and next `dp` rows.

## Notes
The provided solution file is an unfinished stub, it only reads $n$ and the array `a` without implementing the DP described above; the transitions and modular reduction still need to be added.
