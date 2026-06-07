# Grid Paths I

> [Problem on CSES](https://cses.fi/problemset/task/1638)

## Idea
The key insight is that the number of paths to reach a cell $(i, j)$ depends solely on the number of paths to reach its two possible predecessors: $(i-1, j)$ (from above) and $(i, j-1)$ (from the left). This follows directly from the problem constraints, as movement is restricted to right and down. Using dynamic programming, we can compute the total paths to each cell iteratively, avoiding redundant computation.

## Approach
1. Define `dp[i][j]` as the number of ways to reach cell $(i, j)$ from $(0, 0)$ modulo $10^9 + 7$. Initialize `dp[0][0] = 1` if the top-left cell is not a trap (`.`), otherwise set it to $0$.
2. Traverse the grid row by row, column by column. For each cell $(i, j)$:
   - If the cell contains a trap (`*`), set `dp[i][j] = 0` because it cannot be part of any path.
   - Otherwise, compute `dp[i][j]` as the sum of paths from its valid predecessors: `dp[i-1][j]` (above) and `dp[i][j-1]` (left). Use modular arithmetic to ensure values stay within bounds.
3. At the end of the traversal, `dp[n-1][n-1]` contains the number of valid paths to the bottom-right corner.

## Complexity
- **Time:** $O(n^2)$ — each cell is processed once, and computing `dp[i][j]` involves $O(1)$ operations.
- **Space:** $O(n^2)$ — for the `dp` table.

## Notes
- Modular arithmetic ensures that the result fits within the constraints.
