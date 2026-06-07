# StaticMin

> [Problem on CSES](https://cses.fi/problemset/)

## Idea
The problem involves efficiently answering range minimum queries (RMQ) on a static array. The key observation is that any range minimum can be computed using precomputed results from overlapping smaller ranges of power-of-two lengths. This is based on the Sparse Table technique, which exploits the fact that any range $[a, b]$ can be split into two overlapping ranges of length $2^k$, where $k = \lfloor \log_2(b-a+1) \rfloor$.

## Approach
1. Precompute a sparse table `m` such that `m[i][k]` stores the minimum value in the range $[i, i + 2^k - 1]$. This is achieved iteratively:
   - For $k = 0$, `m[i][0] = a[i]`, as ranges of size $2^0 = 1$ contain only one element.
   - For $k > 0$, compute `m[i][k]` as $\min(m[i][k-1], m[i + 2^{k-1}][k-1])$, since a range of size $2^k$ can be split into two overlapping ranges of size $2^{k-1}$.
2. To answer a query for the minimum in range $[a, b]$, determine $k = \lfloor \log_2(b-a+1) \rfloor$. Use the precomputed values to compute the result as $\min(m[a][k], m[b - 2^k + 1][k])$, which covers the entire range $[a, b]$.
3. This approach ensures that both preprocessing and query answering are efficient, leveraging the overlapping structure of power-of-two ranges.

## Complexity
- **Time:** $O(n \log n)$ for preprocessing the sparse table, as each of the $\log n$ levels processes $O(n)$ entries. Query answering is $O(1)$ per query due to the precomputed table.
- **Space:** $O(n \log n)$ for storing the sparse table.

## Notes
The function `__builtin_clz` efficiently computes $\lfloor \log_2(x) \rfloor$ for integers $x > 0$ by counting leading zeros. Ensure array indices are adjusted correctly when converting between 1-based and 0-based indexing.
