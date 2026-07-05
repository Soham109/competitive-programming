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
    ll n; cin>>n;
    ll o = 0; ll f = 0; ll init=0; int num=0; ll extra=0;
    vll a(n); rep(i,0,n) {
        cin>>a[i];
        if(a[i]==1) o++;
        else {
            num++;
            init+=a[i];
            f+=a[i]/2;
            extra += (a[i]-2) / 2;
        }
    }
    ll ans = 0;

    if(o==n) ans = 0;
    else if(num > 1) ans = init + min(extra, o);
    else ans = init + min(f, o);

    if(ans < 3) ans = 0;
    
    cout<<ans<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}