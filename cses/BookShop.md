# Book Shop

> [Problem on CSES](https://cses.fi/problemset/task/1158)

## Idea

The core insight is that this is a classic *0/1 Knapsack Problem*. For each book, we have two choices: include it in the selection or skip it. If we include it, we reduce the remaining budget by the book's price and increase the total pages by its value. This decision-making process can be efficiently modeled using dynamic programming (DP), where the state represents the maximum pages achievable for a given budget.

## Approach

1. Define a DP array `dp` where `dp[i]` represents the maximum number of pages that can be obtained with a budget of exactly $i$. Initialize `dp[0] = 0` and all other entries as $0$, since with zero budget, no pages can be bought.

2. Iterate through each book (denoted by index $j$). For each book, consider its price $h_j$ and pages $s_j$.

3. For each budget $i$ from $x$ down to $h_j$ (iterate in reverse to avoid overwriting results for the current book), update `dp[i]` as:
   \[
   dp[i] = \max(dp[i], dp[i - h_j] + s_j)
   \]
   This transition ensures that we either skip the book (keep the current value of $dp[i]$) or include it (add its pages $s_j$ to the best result achievable with the remaining budget $i - h_j$).

4. After processing all books, the maximum number of pages that can be bought with a budget of $x$ is stored in `dp[x]`.

## Complexity

- **Time:** $O(n \cdot x)$ — iterating over $n$ books and for each book, iterating over a budget of up to $x$.
- **Space:** $O(x)$ — a single DP array of size $x+1$.

## Notes

The reverse iteration for the budget is crucial to ensure that the current book is not reused multiple times in the same state transition. This correctly implements the 0/1 Knapsack constraint of picking each book at most once.
