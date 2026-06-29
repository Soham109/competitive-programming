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

    int ans = 0;
    int rstart = a[0], rend = a[0];
    int cur = 1;

    rep(i,1,n) {
        if(a[i]-a[i-1]==1) {
            cur++;
            rend = a[i];
        }
        else {
            int can = cur - 2;

            if(rstart == 1) can = max(can, cur - 1);
            if(rend == 1000) can = max(can, cur - 1);

            ans = max(ans, can);

            rstart = a[i];
            rend = a[i];
            cur = 1;
        }
    }

    int can = cur - 2;

    if(rstart == 1) can = max(can, cur - 1);
    if(rend == 1000) can = max(can, cur - 1);

    ans = max(ans, can);
    cout << ans << "\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}