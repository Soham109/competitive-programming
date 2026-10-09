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

//notes
    // dp[x] = total for tree rooted at this node
    // dp[x] = dp[x.left] + dp[x.right] + 4
    // dp[leaf] = 0;
    // ans[x] = dp[x] + 1 + ans[parent[x]];
void solve() {
    int n; cin>>n;
    vector<int> l(n + 1);
    vector<int> r(n + 1);
    vector<int> parent(n + 1);
    vector<long long> dp(n + 1);
    vector<long long> ans(n + 1);

    rep(i,1,n+1) {
        cin>>l[i]>>r[i];

        if (l[i] != 0) parent[l[i]] = i;
        if (r[i] != 0) parent[r[i]] = i;
    } 

    vi order; order.push_back(1);

    rep(i,0,order.size()){
        int x = order[i];
        if(l[x]!=0) order.push_back(l[x]);
        if(r[x]!=0) order.push_back(r[x]);
    }

    for(int i = order.size()-1; i >= 0; i--) {
        int x = order[i];

        if(l[x]==0) dp[x] = 0;
        else dp[x] = (4 + dp[l[x]] + dp[r[x]])%MOD;
    }

    for (int x : order) {
        ans[x] = (dp[x] + 1 + ans[parent[x]]) % MOD;
    }

    for (int i = 1; i <= n; i++) {
        cout << ans[i] << (i == n ? '\n' : ' ');
    }
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}