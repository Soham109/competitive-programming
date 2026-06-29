//        /\_/|
//       ( •_• )   SOHAM AGGARWAL
//      / >  >     gf said "commit"
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
#define int ll
 
void solve() {
    string s; cin>>s;
    char cur=s[0];
    int ans=1; int curmax=1;
    rep(i,1,s.size()) {
        if(s[i]==cur){
            curmax++;
        }
        else {
            ans = max(ans,curmax);
            curmax=1;
            cur=s[i];
        }
    }
    ans = max(ans, curmax);
    cout<<ans<<"\n";
}   
    
main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
}