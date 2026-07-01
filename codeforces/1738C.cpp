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
    int no=0; int ne=0;
    vi a(n); rep(i,0,n) {
        cin>>a[i];
        (a[i]%2==0) ? ne++ : no++;
    }
    int rem = no%4;
    if(rem==0 || rem==3 || (rem==1 && ne%2==1)){
        cout<<"Alice"<<endl; return;
    }
    cout<<"Bob"<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}
