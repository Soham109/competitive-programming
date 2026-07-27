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

    vi l(n),r(n),u(n),v(n);
    
    rep(i,0,n) cin>>l[i]>>r[i]>>u[i]>>v[i];
    bool found=false;
    for(int m=n; m>=1; m--){
        int j=1;
        rep(i,0,n){
            
            if(j>m) break;

            bool left=false;
            if(j>=l[i]&& j<=r[i]) left = true;
            bool right=false;
            if(m-j+1 >=u[i] && m-j+1 <=v[i]) right=true;

            if(!left&&!right) j++;
        }
        if(j>m){
            cout<<m<<endl;
            return;
        }
    }
    cout<<0<<endl;
    return;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}