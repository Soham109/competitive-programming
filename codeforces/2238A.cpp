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
    int n,c; cin>>n>>c;
    vi a(n); rep(i,0,n) cin>>a[i];
    vi b(n); rep(i,0,n) cin>>b[i];

    ll total1=0;
    bool ok1=true;
    rep(i,0,n) {
        if(a[i]<b[i]){
            ok1=false;
            break;
        }
        else {
            total1+=a[i]-b[i];
        }
    }

    sort(all(a));
    sort(all(b));
    ll total2=c;
    ll ans = 0;
    bool ok2=true;
    rep(i,0,n) {
        if(a[i]<b[i]){
            ok2=false;
            break;
        }
        else {
            total2+=a[i]-b[i];
        }
    }
    if(!ok1 && ok2) ans = total2;
    else if(ok1 && ok2) ans = min(total1,total2);
    else ans = -1;

    cout<<ans<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}