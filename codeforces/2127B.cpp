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
    int n, x;
    cin>>n>>x;
    string s;
    cin >> s;

    int L =0;      
    int R = n + 1;

    for(int i = x - 2; i >= 0; i--) {
        if(s[i] == '#') {
            L = i + 1;
            break;
        }
    }

    for(int i = x; i < n; i++) {
        if(s[i] == '#') {
            R = i + 1;
            break;
        }
    }

    cout << max(min(x, n - R + 2),min(L + 1, n - x + 1)) << '\n';
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}