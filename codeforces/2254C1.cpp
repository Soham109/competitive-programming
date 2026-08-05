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
    //observations:
        //cnt(0)==cnt(1)
        // Lsum1a >= Lsum1b;
        //Lsum0a <= Lsum0b;
    int n; cin>>n;
    string a,b;cin>>a>>b;
    int ea=0,oa=0,eb=0,ob = 0;
    rep(i,0,n){
        if(a[i]=='1') i%2 ? oa++ : ea++;
        if(b[i]=='1') i%2 ? ob++ : eb++;
    }
    cout<<((ea==eb&&oa==ob)?"YES": "NO")<<endl;;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}