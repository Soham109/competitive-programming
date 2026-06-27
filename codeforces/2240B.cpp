//        /\_/|
//       ( •_• )   SOHAM AGGARWAL
//      / >   >    gf said "commit"
//                 so I pushed to GitHub

#include <bits/stdc++.h>

using namespace std;

using ll = long long;
using vi = vector<int>;
using vll = vector<long long>;

const int MOD=998244353;
const int INF = 1e9;
const ll LINF = 4e18;

#define all(c) (c).begin(), (c).end()
#define rep(i, a, b) for (int i = (a); i < (b); i++)

ll pow(ll a, ll b, int m){
    ll ans = 1;
    while(b){
        if (b&1) ans=(ans*a) % m;
        b/= 2;
        a = (a*a)%m;
    }
    return ans;
}

void solve() {
    ll n,m,r,c; cin>>n>>m>>r>>c;
    ll power = pow(2,m*(r-1)+(n-r+1)*(c-1),MOD);
    cout<<power<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}