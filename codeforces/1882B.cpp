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

    // initial approach: missed edge cases ;-;
    // failed on TC 9

    // int n; cin>>n;
    // int c=n;
    // set<int> s;
    // map<int,int> mp;
    // while(c--){
    //     int k;
    //     cin>>k;
    //     while(k--) {
    //         int a;
    //         cin>>a;
    //         s.insert(a);
    //         mp[a]++;
    //     }
    // }
    // bool fine=false;
    // for(auto pair: mp) {
    //     if(pair.second!=n) {
    //         fine=true;
    //         break;
    //     }
    // }
    // if(n==1) {
    //     cout<<0<<"\n";
    //     return;
    // } 
    // if(!fine) {
    //     cout<<0<<"\n";
    //     return;
    // }
    // else {
    //     cout<<s.size()-1<<"\n";
    //     return;
    // }


// 2nd try: worked (looks weird as hell tho)!

    int n; cin>>n;
    int c=n;
    set<int> s;
    vector<set<int>> v;
    while(c--){
        int k;
        cin>>k;
        set<int> ts;
        while(k--) {
            int a;
            cin>>a;
            ts.insert(a);
            s.insert(a);
        }
        v.push_back(ts);
    }
    int ans=0;
    for(auto it: s) {
        set<int> ts;
        for(auto i: v) {
            if(i.count(it)==0) {
                for(auto j: i) {
                    ts.insert(j);
                }
            }
        }
        ans = max(ans,(int)ts.size());
    }
    cout<<ans<<endl;
}  

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}