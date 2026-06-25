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
    int n,x,m;
    cin>>n>>x>> m;
    int lo = x, hi = x;
    while (m--) {
        int l, r;
        cin>>l>>r;
        if (l<=hi&& lo<=r) {  
            lo = min(lo, l);
            hi = max(hi, r);
        }
    }
    cout<<hi - lo + 1<<"\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}