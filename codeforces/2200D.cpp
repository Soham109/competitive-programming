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
    int n,x,y; cin>>n>>x>>y;
    vi a(n); rep(i,0,n) cin>>a[i];

    vi outside;
    vi mid;

    rep(i,0,x) outside.push_back(a[i]);
    rep(i,y,n) outside.push_back(a[i]);

    rep(i,x,y) mid.push_back(a[i]);

    int mn_pos = 0;
    rep(i,0,(int)mid.size()) {
        if(mid[i] < mid[mn_pos]) {
            mn_pos = i;
        }
    }

    vi best_mid;

    rep(i,mn_pos,(int)mid.size()) {
        best_mid.push_back(mid[i]);
    }

    rep(i,0,mn_pos) {
        best_mid.push_back(mid[i]);
    }

    int pos = outside.size();

    rep(i,0,(int)outside.size()) {
        if(outside[i] > best_mid[0]) {
            pos = i;
            break;
        }
    }

    rep(i,0,pos) {
        cout<<outside[i]<<" ";
    }

    for(int v: best_mid) {
        cout<<v<<" ";
    }

    rep(i,pos,(int)outside.size()) {
        cout<<outside[i]<<" ";
    }

    cout << "\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t; cin>>t;
    while(t--) solve();
}