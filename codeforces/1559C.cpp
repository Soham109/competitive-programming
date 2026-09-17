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
    if(a[n-1]==0) {
        rep(i,1,n+2) cout<<i<<" ";
        cout<<endl;
        return;
    }
    else if (a[0] == 1) {
        cout << n + 1 << " ";
        rep(i, 1, n + 1) cout << i << " ";
        cout << "\n";
        return;
    }
    else {
        rep(i,0,n-1){
            if(a[i]==0&&a[i+1]==1){
                rep(j,1,i+2) {
                    cout<<j<<" ";
                }
                cout<<n+1<<" ";
                rep(j,i+2,n+1){
                    cout<<j<<" ";
                }
                cout<<endl;
                return; 
            }
        }
    }
    
    cout<<-1<<endl;
    return;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}