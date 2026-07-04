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
    int n,k; cin>>n>>k;
    vll a(n); rep(i,0,n) cin>>a[i];
    ll s=0;
    if(k==1) {
        s=max(s,a[0]+*max_element(a.begin()+1, a.end()));
        s=max(s,a[n-1]+*max_element(a.begin(), a.end()-1));
    }
    else {
        sort(all(a));
        rep(i,0,k+1) s+=a[i];
    }
    cout<<s<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}