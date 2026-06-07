//-----SOHAM AGGARWAL-----//

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
    vi a(n); rep(i,0,n) cin>>a[i];
    vll dp(x+1); dp[0]=1;
    rep(i,1,x+1) {
        rep(j, 0, n) {
            //dp[i] added so as to preserve each add. dp[5] = dp[2] + dp[3] +....
            if(i>=a[j]) dp[i] = (dp[i-a[j]] + dp[i])%MOD;
        }
    }
    cout<<dp[x]<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
}