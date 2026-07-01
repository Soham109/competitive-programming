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
    int n,m; cin>>n>>m;
    while(m--){
        int l,r;
        cin>>l>>r;
    }
    bool zero=false;
    string s="";
    while(s.size()<n) {
        if(zero) {
            s.append("0");
            zero=false;
        }
        else {
            s.append("1");
            zero=true;
        }
    }
    cout<<s<<endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}