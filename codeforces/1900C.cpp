//        /\_/|
//       ( •_• )   SOHAM AGGARWAL
//      / >   >    gf said "commit"
//                 so I pushed to GitHub

#include <bits/stdc++.h>

using namespace std;

using ll = long long;
using vi = vector<int>;
using vll = vector<long long>;

const int MOD=1e9+7;
const int INF = 1e9;
const ll LINF = 4e18;

#define all(c) (c).begin(), (c).end()
#define rep(i, a, b) for (int i = (a); i < (b); i++)

void solve() {
    int n; cin>>n;
    string s; cin>>s;
    //if u ->parent
    //if l -> lchild
    //if r-> rchild

    //dp[i] = minimum number of changes needed to a vertex i and its descendants path such that 
    //starting from vertex i, you reach some leaf in i's subtree

    vi dp(n+1, INF);
    vi L(n+1), R(n+1);
    rep(i, 1, n+1) {
        cin >> L[i] >> R[i];
    }

    // need children processed before parents ->
    // DFS from root to get an order, then process it in reverse
    vi order;
    vi stk;
    stk.push_back(1);
    while (!stk.empty()) {
        int u = stk.back();
        stk.pop_back();
        order.push_back(u);
        if (L[u] != 0) stk.push_back(L[u]);
        if (R[u] != 0) stk.push_back(R[u]);
    }

    for (int idx = order.size() - 1; idx >= 0; idx--) {
        int i = order[idx];
        int l = L[i], r = R[i];
        char c = s[i-1]; // s is 0-indexed, vertex i's letter is s[i-1]

        if (l == 0 && r == 0) dp[i] = 0;
        else {
            int cost = INF;
            // dp[i] = min( (going left cost), (going right cost) )
            if (l != 0) cost = min(cost, (c == 'L' ? 0 : 1) + dp[l]);
            if (r != 0) cost = min(cost, (c == 'R' ? 0 : 1) + dp[r]);
            dp[i] = cost;
        }
    }

    cout << dp[1] << "\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}