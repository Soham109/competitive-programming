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

void solve() {
    int n;
    cin >> n;

    vi a(n), b(n);

    rep(i, 0, n) cin >> a[i];
    rep(i, 0, n) cin >> b[i];

    sort(all(a));
    sort(all(b));

    // prefix sums
    vi pa(n + 1, 0), pb(n + 1, 0);

    rep(i, 0, n) {
        pa[i + 1] = pa[i] + a[i];
        pb[i + 1] = pb[i] + b[i];
    }

    for (int x = 0; ; x++) {

        int total = n + x;
        int k = total - total / 4;
        int oldA = k - x;
        int oldB = min(k, n);

        int sa = 100 * x + pa[oldA];
        int sb = pb[oldB];

        if (sa >= sb) {
            cout << x << '\n';
            return;
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}