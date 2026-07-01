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
    int n,x; cin>>n>>x;
    vi h(n); rep(i,0,n) cin>>h[i];
    vi s(n); rep(i,0,n) cin>>s[i];

    vi dp(x+1,0);

    rep(j,0,n) {
        for(int i=x; i>=h[j]; i--) {
            dp[i] = max(dp[i], dp[i-h[j]] + s[j]);
        }
    }

    cout<<dp[x]<<endl;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}
