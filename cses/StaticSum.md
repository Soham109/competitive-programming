# StaticSum

> [Problem on CSES](https://cses.fi/problemset/)

## Idea

The key insight is that the sum of elements in any subarray $[a, b]$ can be computed in constant time if we precompute a prefix sum array. This works because the sum of elements from index $a$ to $b$ is equal to the difference between the cumulative sum up to $b$ and the cumulative sum up to $a-1$. This avoids recalculating the sum for every query.

## Approach

1. Construct a prefix sum array `prefix` where $prefix[i]$ stores the sum of the first $i$ elements of the input array. This is achieved by iterating through the array and setting $prefix[i] = prefix[i-1] + x_i$, where $x_i$ is the $i$-th element of the array.
2. For each query $(a, b)$, compute the sum of elements in the range $[a, b]$ using the formula $prefix[b] - prefix[a-1]$. This works because $prefix[b]$ gives the sum of the first $b$ elements, and subtracting $prefix[a-1]$ removes the sum of the elements before index $a$.

## Complexity

- **Time:** $O(n + q)$ — $O(n)$ to compute the prefix sum array and $O(q)$ to process $q$ queries in constant time each.
- **Space:** $O(n)$ — for storing the prefix sum array.
