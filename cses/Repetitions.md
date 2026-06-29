# Repetitions

> [Problem on CSES](https://cses.fi/problemset/task/1069)

## Idea

The key insight is that the problem reduces to counting the length of consecutive identical characters in the string. This is because the longest repetition corresponds to the maximum length of a contiguous substring where all characters are the same. By iterating through the string and maintaining a count of consecutive identical characters, we can efficiently determine the longest such sequence.

## Approach

1. Initialize two variables: `curmax` to track the length of the current streak of identical characters, and `ans` to store the maximum streak encountered so far. Start with `curmax = 1` and `ans = 1`, as the minimum possible repetition length is 1 (a single character).
2. Traverse the string from left to right, comparing each character with the previous one:
   - If the current character matches the previous character, increment `curmax` because the streak continues.
   - Otherwise, update `ans` to the maximum of its current value and `curmax`, reset `curmax` to 1, and update the current character to the new character.
3. After the loop, perform a final update of `ans` to ensure the longest streak is accounted for, as the longest repetition might end at the last character.
4. Output the value of `ans`, which is the length of the longest repetition.

## Complexity

- **Time:** $O(n)$ — The algorithm processes each character of the string exactly once.
- **Space:** $O(1)$ — Only a constant amount of extra space is used for the variables `curmax`, `ans`, and `cur`.

## Notes

No additional implementation details are necessary, as the algorithm is straightforward and operates within the constraints.
