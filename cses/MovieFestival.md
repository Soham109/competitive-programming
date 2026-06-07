# Movie Festival

> [Problem on CSES](https://cses.fi/problemset/task/1629)

## Idea

The key insight is that to maximize the number of movies watched, you should always prioritize movies that finish the earliest among those available. This greedy strategy works because watching an earlier-ending movie leaves more time for subsequent movies, and ensures that the schedule remains as flexible as possible. Sorting by ending times guarantees that every movie considered is optimal for the current step.

## Approach

1. Represent each movie as a pair $(b, a)$, where $b$ is the ending time and $a$ is the starting time. Sorting by ending times ensures that we always consider the earliest-ending movie first.
2. Initialize a variable `last_end` to track the ending time of the last selected movie. This ensures that no two selected movies overlap, as a movie can only be watched if its starting time is $\geq$ `last_end`.
3. Iterate through the sorted list of movies. For each movie, check if its starting time $a$ satisfies $a \geq$ `last_end`. If so, select the movie, increment the count of watched movies, and update `last_end` to the current movie's ending time $b$.
4. At the end of the iteration, the count of selected movies represents the maximum number of non-overlapping movies that can be watched.

## Complexity

- **Time:** $O(n \log n)$ — dominated by sorting the $n$ movies by their ending times.
- **Space:** $O(n)$ — for storing the list of movie intervals.

## Notes

- Sorting by ending times is critical for the greedy approach to work. Sorting by starting times or other criteria would not guarantee an optimal solution.
