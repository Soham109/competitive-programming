#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<vector<bool>> visited;
vector<string> grid;
int n, m;

void bfs(int i, int j) {
    queue<pair<int, int>> q;

    visited[i][j] = true;
    q.push({i, j});

    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();

        if (y + 1 < m && !visited[x][y + 1] && grid[x][y + 1] == '.') {
            visited[x][y + 1] = true;
            q.push({x, y + 1});
        }

        if (y - 1 >= 0 && !visited[x][y - 1] && grid[x][y - 1] == '.') {
            visited[x][y - 1] = true;
            q.push({x, y - 1});
        }

        if (x + 1 < n && !visited[x + 1][y] && grid[x + 1][y] == '.') {
            visited[x + 1][y] = true;
            q.push({x + 1, y});
        }

        if (x - 1 >= 0 && !visited[x - 1][y] && grid[x - 1][y] == '.') {
            visited[x - 1][y] = true;
            q.push({x - 1, y});
        }
    }
}

int main() {
    cin >> n >> m;

    grid.resize(n);
    visited.assign(n, vector<bool>(m, false));

    for (int i = 0; i < n; i++) {
        cin >> grid[i];
    }

    int ans = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (grid[i][j] == '.' && !visited[i][j]) {
                bfs(i, j);
                ans++;
            }
        }
    }

    cout << ans << '\n';

    return 0;
}