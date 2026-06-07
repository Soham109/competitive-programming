# Missing Number

> [Problem on CSES](https://cses.fi/problemset/task/1083)

## Idea

The sum of integers from $1$ to $n$ is fixed and can be computed as $S = \frac{n \cdot (n + 1)}{2}$. If one number is missing, the sum of the given numbers will be $S - x$, where $x$ is the missing number. Thus, $x$ can be determined as $x = S - sum$, where `sum` is the sum of the given numbers. This insight works because addition is commutative, and subtracting the sum of the given numbers isolates the missing one.

## Approach

1. Compute the expected sum $S = \frac{n \cdot (n + 1)}{2}$ using the formula for the sum of the first $n$ natural numbers.
2. Compute the actual sum of the given numbers, `sum`, by iterating through the input list.
3. Subtract `sum` from $S$ to find the missing number $x = S - sum$.
4. Output $x$, which is guaranteed to be the missing number because all other numbers are accounted for and $x \in [1, n]$.

## Complexity

- **Time:** $O(n)$ — dominated by the single pass to compute the sum of the input numbers.
- **Space:** $O(1)$ — only a few scalar variables are used.

## Notes

- The formula $\frac{n \cdot (n + 1)}{2}$ is safe from overflow within the constraints because $n \leq 2 \cdot 10^5$, and the result fits within a 64-bit integer.
