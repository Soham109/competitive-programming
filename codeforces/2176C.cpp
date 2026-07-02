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
    vll e,o;

    rep(i,0,n) {
        if(a[i]&1) o.push_back(a[i]);
        else e.push_back(a[i]);
    }
    sort(all(e)); sort(all(o));

    if(e.size()==n) {
        rep(i,0,n) cout<<0<<" ";
        cout<<"\n"; return;
    }
    if(o.size()==n) {
        rep(k,1,n+1){
            //if k is odd
            if(k&1) cout<<o.back()<<" ";
            else cout<<0<<" ";
        }
        cout<<"\n";
        return;
    }

    ll score = o.back();

    vll ans(n + 1);
    ans[1] = score;

    rep(k, 2, n + 1) {
        if(e.size() == 0) {
            ans[k]=ans[k - 2];
        }
        else {
            ans[k] = ans[k - 1] + e.back();
            e.pop_back();
        }
    }
    if(o.size()%2== 0) {
        ans[n] = 0;
    }

    rep(i, 1, n + 1) cout << ans[i] << " ";
    cout << "\n";
   
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}