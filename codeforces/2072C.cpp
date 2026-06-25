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
    int n,x; cin>>n>>x;
    
    vi ans;
    int cur_or=0;

    rep(i,0,n) {
        if((i|x)==x) {
            ans.push_back(i);
            cur_or|=i;
        }
        else break;
    }

    if((int)ans.size()==n) {
        if(cur_or!=x) ans.back()=x;
    }
    else {
        ans.push_back(x);
        while((int)ans.size()<n){
            ans.push_back(0);
        }
    }
    rep(i,0,n){
        cout<<ans[i]<<" ";
    }
    cout<<"\n";

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}