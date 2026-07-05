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

bool isSquare(ll n) {
    if (n < 0) return false;
    ll r = sqrt(n);
    return r * r == n;
}

void solve() {
    int n; cin>>n;
    string sn = to_string(n);
    int mn=INF;
    rep(msk, 0, (1<<sn.size())) {
        string sub="";
        rep(i,0,sn.size()) {
            if(msk & (1<<i)) {
                sub+=sn[i];
            }
        }
        if(sub.empty()) continue;
        if(sub[0]=='0') continue;
        if(isSquare(stoi(sub))) mn = min(mn,(int)sn.size() - (int)sub.size());
    }
    if(mn == INF) cout << -1 << endl;
    else cout<<mn<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}