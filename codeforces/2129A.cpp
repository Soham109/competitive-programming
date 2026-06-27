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
    vector<array<int,3>> v;
    rep(i,1,n+1) {
        int lo, hi;
        cin>>lo>>hi;
        v.push_back({hi, lo, i});
        }
    sort(all(v), [](auto &a, auto &b) {
        if(a[0] != b[0]) return a[0] > b[0]; // hi decreasing
        return a[1] < b[1];                  // lo increasing
    });

    int total = 0;
    int glo=INF;
    vi ans;

    for(auto pair: v) {
        int hi = pair[0];
        int lo = pair[1];
        int idx = pair[2];

        if(lo<glo) {
            glo = lo;
            total++;
            ans.push_back(idx);
        }
    }

    cout<<total<<"\n";
    for(int x: ans) cout<<x<<" ";
    cout<<"\n";

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}