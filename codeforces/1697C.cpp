//        /\_/|
//       ( •_• )   SOHAM AGGARWAL
//      / >   >    gf said "commit"
//                 so I pushed to GitHub

#include <bits/stdc++.h>
#include <string>
using namespace std;

using ll = long long;
using vi = vector<int>;
using vll = vector<long long>;

const int MOD=1e9+7;
const int INF = 1e9;
const ll LINF = 4e18;

#define all(c) (c).begin(), (c).end()
#define rep(i, a, b) for (int i = (a); i < (b); i++)


// remove all b: a/c order must match
// a can only shift right
// c can only shift left
// b is flexible only within those constraints


void solve() {
    int n;cin>>n;
    string s,t; cin>>s>>t;
    string x,y;
    for (char ch : s) if (ch != 'b') x += ch;
    for (char ch : t) if (ch != 'b') y += ch;

    if(x!=y){
        cout<<"NO"<<endl; return;
    }

    vector<int> ps, pt;

    rep(i,0,n) {
        //ps and pt store index of non b chars
        if (s[i] != 'b') ps.push_back(i);
        if (t[i] != 'b') pt.push_back(i);
    }

    //iterating through x
    bool yes=true;
    rep(i,0,(int)x.size()) {
        if (x[i] == 'a' && ps[i] > pt[i]) yes=false;
        if (x[i] == 'c' && ps[i] < pt[i]) yes = false;
    }

    cout<< ( yes ? "YES" :  "NO") <<endl;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}