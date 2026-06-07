# Distinct Numbers

> [Problem on CSES](https://cses.fi/problemset/task/1621)

## Idea

The key insight is that the number of distinct values in a list corresponds to the number of unique keys in a frequency map of the list. This follows from the definition of distinct values: each unique element appears exactly once as a key, regardless of its frequency. Efficiently tracking these keys allows us to compute the answer without explicitly comparing every pair of elements.

## Approach

1. Use a hash-based data structure (`std::map` or `std::unordered_map`) to track the frequency of each value in the list. This ensures that each unique value is stored as a single key.
2. Iterate through the input values and insert them into the map. The insertion operation automatically ensures that duplicate values are not stored as separate keys.
3. After processing all values, the size of the map (`mp.size()`) directly gives the number of distinct values, as each unique value corresponds to one key.

## Complexity

- **Time:** $O(n \log n)$ — dominated by $O(\log n)$ insertion time for each of the $n$ elements into the map.
- **Space:** $O(n)$ — for storing up to $n$ unique keys in the map.

## Notes

- Using `std::unordered_map` could reduce the average-case time complexity to $O(n)$ due to constant-time hash table operations, but `std::map` ensures worst-case $O(n \log n)$ performance.
