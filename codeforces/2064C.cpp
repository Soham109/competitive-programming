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
#define repl(i, a, b) for (ll i = (a); i < (b); i++)

void solve() {
    int n; cin>>n;
    vi a(n); rep(i,0,n) cin>>a[i];

    vll possum(n,0), negsum(n,0);

    ll psum=0, nsum=0;

    rep(i,0,n){
        if(a[i]>0){
            psum += a[i];
        }
        else {
            nsum += -1LL*a[i];
        }

        possum[i] = psum;
        negsum[i] = nsum;
    }

    ll ans = max(psum, nsum);

    rep(i,0,n){
        ans = max(ans, possum[i] + nsum - negsum[i]);
    }

    cout<<ans<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t; cin>>t;
    while(t--) solve();
}
