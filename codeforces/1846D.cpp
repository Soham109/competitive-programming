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
    int n,d,h; cin>>n>>d>>h;
    //total triangle area - total overlap area.
    // total triangle area - ()

    // common triangle area  = 1/2sum(s_i - s_j + h)*(d - 2*(s_j-si_i))
    vi heights(n); rep(i,0,n) cin>>heights[i];
    long double ttl = (long double)n*d*h/2;
    long double common=0;
    rep(i,0,n-1) {
        int dis = heights[i+1]-heights[i];
        if(dis<h) common += (long double)d*(h-dis)*(h-dis)/(2*h);
    }

    cout << fixed << setprecision(10) << ttl - common << endl;}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}