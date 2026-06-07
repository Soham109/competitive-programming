//        /\_/|
//       ( •_• )   SOHAM AGGARWAL
//      / >  >     gf said "commit"
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
    vi c(n); rep(i,0,n) cin>>c[i];
    vll d(x+1); d[0]=1;
    rep(i,0,n){
        rep(j,c[i],x+1){
            //for every coin, for each j >= coin.
            // dp[sum] += dp[sum-coin];
            d[j] =  (d[j]+d[j-c[i]])%MOD;
        }
    }

    cout<<d[x]%MOD<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
}