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
    int n,m; cin>>n>>m;
    vll a(n), b(m); 
    rep(i,0,n) cin>>a[i];
    rep(i,0,m) cin>>b[i];

    ll ac = a[0]+n;
    ll bc = b[0]+m;

    cout<<(bc<=ac?1:2)<<endl;

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}