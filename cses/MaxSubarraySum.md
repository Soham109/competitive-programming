# Max Subarray Sum

> [Problem on CSES](https://cses.fi/problemset/)

## Idea
The key observation is that the maximum subarray sum ending at position $i$ can be computed using the maximum subarray sum ending at position $i-1$. Specifically, either the subarray ending at $i$ starts fresh with $a[i]$, or it extends the subarray ending at $i-1$. This is a direct application of Kadane's algorithm, which relies on maintaining a running maximum and leveraging overlapping subproblems.

## Approach
1. Define `sum` as the maximum subarray sum ending at the current position and `best` as the global maximum subarray sum found so far.
2. Initialize `sum` and `best` with the first element of the array, as the smallest subarray is a single element.
3. Iterate through the array from the second element. At each position $i$, update `sum` as $\max(a[i], \texttt{sum} + a[i])$, which either starts a new subarray at $i$ or extends the previous subarray to include $a[i]$.
4. Update `best` as $\max(\texttt{best}, \texttt{sum})$ to track the global maximum subarray sum.
5. After processing all elements, `best` contains the maximum subarray sum.

## Complexity
- **Time:** $O(n)$ — one pass through the array.
- **Space:** $O(1)$ — only a constant amount of extra space is used.

## Notes
Ensure that the array contains at least one element, as the algorithm assumes the first element initializes `sum` and `best`.
