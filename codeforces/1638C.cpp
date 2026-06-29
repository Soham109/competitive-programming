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
    vi a(n); rep(i,0,n) cin>>a[i];
    //inefficient method

    // set<int> s1; set<int> s2;
    // int total=0;
    //int k=1;
    // for(int c: a) {
        // s1.insert(k);
        // s2.insert(c);
        // if(s1==s2) {
        //     total++;
        //     s1.clear();
        //     s2.clear();        
        // }
    //     k++;
    // }
    // cout<<total<<"\n";

    //same idea, but more efficient (previous one TLE on 56th test case ;-;)

    int total=0; int mx=0;

    rep(i,0,n) {
        mx=max(mx,a[i]);
        if(mx==i+1) {
            total++;
        }
    }
    cout<<total<<endl;


}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}