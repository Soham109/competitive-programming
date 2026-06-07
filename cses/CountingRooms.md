# CountingRooms

> [Problem on CSES](https://cses.fi/problemset/task/1192)

## Idea

The key observation is that each room corresponds to a connected component of floor squares (`.`) in the grid. By marking all squares in a connected component as visited, we ensure that each room is counted exactly once. This works because connectivity is defined as adjacency in the four cardinal directions, and the grid is finite and bounded.

## Approach

1. Represent the grid as a 2D array and maintain a `visited` array of the same dimensions to track which squares have been explored.
2. Iterate over all squares in the grid. For each unvisited floor square (`.`), initiate a breadth-first search (BFS) or depth-first search (DFS) to explore all reachable floor squares from that starting point. Mark these squares as visited during the traversal.
3. Each BFS or DFS corresponds to discovering a new connected component, so increment the room count for every traversal initiated. This guarantees that all rooms are counted exactly once.
4. The BFS or DFS ensures correctness because it exhaustively explores all reachable floor squares from any starting square, respecting the adjacency condition.

## Complexity

- **Time:** $O(n \cdot m)$ — each square is visited exactly once during the BFS or DFS.
- **Space:** $O(n \cdot m)$ — for the `visited` array and the queue used in BFS.

## Notes

- BFS is used in the solution, but DFS could also be implemented with a stack or recursion. Both approaches work because they traverse all reachable nodes in a connected component.
