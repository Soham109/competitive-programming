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

    vi p(n);
    int s=0;
    rep(i,0,n) {
        if(a[i]==3) s--;
        else s++;
        p[i]=s;
    }

    int l=0;
    int mn=INF;
    for(int j=1;j<=n-2;j++) {
        int i=j-1;
        if(a[i]==1) l++;
        else l--;

        if(l>=0) mn=min(mn, p[i]);
        if(mn<=p[j]) {
            cout<<"YES"<<endl;
            return;
        }
    }
    cout<<"NO"<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}
