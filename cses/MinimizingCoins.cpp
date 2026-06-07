#include <bits/stdc++.h>

using namespace std;
using vi = vector<int>;
const int MOD=1e9+7;
#define all(c) (c).begin(), (c).end()
#define rep(i, a, b) for (int i = (a); i < (b); i++)

void solve() {
    int n,x; cin>>n>>x;
    vi c(n); vi dp(x+1,1e9);
    dp[0]=0;
    rep(i, 0, n) {
        cin>>c[i];
    }
    rep(i,1,x+1){
        rep(j,0,n) {
            if(c[j]<=i) dp[i] = min(dp[i], dp[i-c[j]] + 1);
        }
    }
    cout<<(dp[x] <1e9 ? dp[x]: -1) << endl;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);

    solve();
}