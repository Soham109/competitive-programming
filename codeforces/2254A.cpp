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
    vi a(3);
    cin>>a[0]>>a[1]>>a[2];
    sort(all(a));
    int r=0;
    while(true){
        sort(all(a));
        if(a[0]==a[1]||a[1]==a[2]||a[0]==a[2]) break;
        a[0]++; a[2]--;
        r++;
    }
    cout<<r<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}