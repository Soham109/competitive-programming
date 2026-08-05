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
    string s; cin>>s;

    // int l=0; int r=1;
    // int total=1;
    // bool br=false;
    // while(r<n){
    //     char cl=s[l];
    //     char cr=s[r];
    //     if(cl==cr) {
    //         r++;
    //         total++;
    //     }
    //     else if(br && cr!=cl) {
    //         l++;
    //         br=false;
    //         total=max(total,);
    //     }
    //     else {
    //         br=true;
    //         r++;
    //     }
    // }
    // cout<<n-total/2-1<<endl;

    int r=1;
    rep(i,1,n) {
        if(s[i]!=s[i-1])r++;
    }
    int ans=INT_MAX;
    rep(i,1,n-1){
        int c=r;
        if(s[i-1]==s[i+1]&&s[i]!=s[i-1]) c-=2;
        else if(s[i-1]!=s[i]&&s[i]!=s[i+1])c-=1;

        ans=min(ans,c);
    }
    cout<<ans<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}