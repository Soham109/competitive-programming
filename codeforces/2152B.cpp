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
    int n,rk,ck,rd,cd; cin>>n>>rk>>ck>>rd>>cd;

    ll ans=0;

    if(rk < rd) ans=max(ans, (ll)rd);
    if(rk > rd) ans=max(ans, (ll)n-rd);
    if(ck < cd) ans=max(ans, (ll)cd);
    if(ck > cd) ans=max(ans, (ll)n-cd);

    cout<<ans<<"\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}