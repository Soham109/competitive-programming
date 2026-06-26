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

long long nCr(int n, int r) {
    if(r < 0 || r > n) return 0;
    r = min(r, n - r);

    long long ans = 1;
    for(int i = 1; i <= r; i++) {
        ans = ans * (n - r + i) / i;
    }
    return ans;
}

void solve() {
    int n; cin>>n;
    map<int,int> mp;
    ll p=0;
    vi a(n); rep(i,0,n) {
        cin>>a[i];
        mp[__builtin_clz(a[i])]++;   
    }

    for (auto pair: mp) {
        p+=nCr(pair.second, 2);
    }
    
    cout<<p<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}