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
    int n,h; cin>>n>>h;
    vi a(n);
    rep(i,0,n) cin>>a[i];
    int ans = 0;
    rep(k, 1, n + 1) {
        vi v(a.begin(), a.begin() + k);
        sort(all(v), greater<int>());      
        ll height = 0;
        for (int i = 0; i < k; i += 2){
            height += v[i];
        }
        if (height<=h) ans=k;
        else break;                    
    }

    cout<<ans<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}