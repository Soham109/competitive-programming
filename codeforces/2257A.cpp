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
    set<char> st;
    rep(i,0,n) {
        string s;
        cin>>s;
        st.insert(toupper(s[0]));
    }
    bool y=true;
    rep(i,0,m) {
        string k; cin>>k;
        for(char c: k) {
            if(st.find(c) == st.end()) {
                y=false;
            }
        }
    }
    cout << (y ? "YES" : "NO") << endl;
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}