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

    //  ------ failed approach :( ----- 
    //req > 100*t
    // subarray such that total sum of all values
    // exceeds 100*length
    // int ms = 0;
    // int l=0,r=0;
    // ll res = 0;
    // while(l<=r) {
    //     if(a[r] + res > 100) {
    //         if(a[r] <= 100) res -= 100 - a[r];
    //         else res +=a[r] - 100;
    //     }
    //     else {
    //         ms = max(ms, r-l+1);
    //         l=r+1;
    //         res=0;
    //     }
    //     r++;
    // }
    // cout<<ms<<endl;

    
    int ans = 0;
    // Try every starting point
    rep(l,0,n) {
        int sum = 0;
        // Extend the subarray to the right
        rep(r,l,n) {
            sum += a[r] - 100;
            if (sum > 0) ans = max(ans, r - l + 1);
        }
    }
    cout<<ans<< '\n';
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}