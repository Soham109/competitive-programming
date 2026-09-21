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
    int n; cin>>n;
    vi a(n); rep(i,0,n) cin>>a[i];

    vi used(n,0);
    int g = 0;

    rep(step,0,n) {
        int best = -1;
        rep(j,0,n) {
            if(used[j]) continue;
            if(best==-1 || gcd(g,a[j])>gcd(g,a[best])) best=j;
        }
        used[best] = 1;
        g = gcd(g,a[best]);
        cout<<a[best]<<" ";
    }
    cout<<"\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}
