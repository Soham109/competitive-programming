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

#define all(c) (c).rbegin(), (c).rend()
#define rep(i, a, b) for (int i = (a); i < (b); i++)

//observaitons:
// - decreasing order better for number with common gcds etc.
// - first element outputed will be max element
// - algo:
// sort in decreasing order. after first element, output the elemtn with max gcd
// and if 2 elements have same gcd with it,



void solve() {
    int n; cin>>n;
    vi a(n); rep(i,0,n) cin>>a[i];
    sort(all(a));

    vi used(n,0);
    vi ans(n);

    ans[0] = a[0]; used[0] = 1;
    
    int g = a[0];
    rep(i,1,n) {
        int mx=0;
        int idx=0;
        rep(j,0,n) {
            if(used[j] == 0 && gcd(g,a[j])>mx) {
                idx=j;
                mx = gcd(g,a[j]);
            }
        }
        g = gcd(g,a[idx]);
        used[idx] = 1;
        ans[i] = a[idx];
    }
    rep(i,0,n) cout<<ans[i]<<" ";
    cout<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}