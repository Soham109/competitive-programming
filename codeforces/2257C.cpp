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
    int n; cin >> n;

    vi p(n+1); vector<vi> ch(n+1);
    rep(u,2,n+1) cin >> p[u], ch[p[u]].push_back(u);

    vi dam(n+1), cnt(n+1);
    int m; cin >> m;
    while(m--) {
        int x; cin >> x;
        dam[x] = cnt[x] = 1;
    }

    vi ans;

    for(int u=n; u>=1; u--) {
        for(int v: ch[u]) cnt[u] += cnt[v];

        vector<int> good;
        for(int v: ch[u])
            if(cnt[v]) good.push_back(v);

        if(dam[u]) {
            for(int v: good) ans.push_back(v);
        }
        else {
            for(int i=1; i<(int)good.size(); i++)
                ans.push_back(good[i]);
        }
    }

    cout << ans.size();
    for(int u: ans) cout << ' ' << u;
    cout << '\n';
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}