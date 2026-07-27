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
    //if k greater, ball left
    //if k lighter, ball right
    int n; cin>>n;
    vi a(n); rep(i,0,n) cin>>a[i];
    if(n%2==1) {
        cout<<"NO"<<endl; return;
    }
    int l=INF,r=-1;
    for(int i=0; i < n; i+=2){
        if(a[i]<=a[i+1]){
            cout<<"NO"<<endl;
            return;
        }
        
        l=min(l,a[i]);
        r=max(r,a[i+1]);

    }
    if(l-r<=1) {
        cout<<"NO"<<endl;
        return;
    }
    cout<<"YES"<<endl;
    return;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}