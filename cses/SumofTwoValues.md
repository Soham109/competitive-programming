# SumofTwoValues

> [Problem on CSES](https://cses.fi/problemset/task/1640)

## Idea

The key insight is that for any number $a_i$ in the array, the problem reduces to checking whether its complement $x - a_i$ exists elsewhere in the array. Using a hash map to store seen values allows this check to be performed in constant time. This approach works because the hash map ensures that we can efficiently track and retrieve previously seen values while iterating through the array.

## Approach

1. Initialize an empty hash map `mp` to store array values as keys and their indices as values. This allows constant-time lookup for complements.
2. Iterate through the array. For each element $a_i$ at index $i$, compute its complement $c = x - a_i$.
3. Check if $c$ exists in the hash map. If it does, the pair $(a_i, c)$ satisfies the condition $a_i + c = x$. Retrieve the index of $c$ from the hash map and output the pair of indices (adjusted to 1-based indexing).
4. If $c$ does not exist in the hash map, store $a_i$ and its index in `mp` for future reference. This ensures that subsequent elements can find $a_i$ as their complement, if needed.
5. If the loop completes without finding a valid pair, output `IMPOSSIBLE`.

This method is correct because the hash map ensures that every complement is checked exactly once, and the problem guarantees that only distinct positions are valid.

## Complexity

- **Time:** $O(n)$ — Each lookup and insertion in the hash map takes $O(1)$ on average, and we iterate through the array once.
- **Space:** $O(n)$ — The hash map stores up to $n$ elements.

## Notes

- The problem guarantees that the array contains integers $\leq 10^9$, so there is no risk of overflow when computing $x - a_i$.
