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

void solve() {
    int n; cin>>n;
    vector<pair<int,int>> m;
    rep(i,0,n){
       int a,b;cin>>a>>b;
       m.push_back({b,a});
    }
    sort(m.begin(), m.end());

    int last_end=0;
    int total=0;
    for(auto pair: m){
        if(pair.second >=last_end) {
            total++;
            last_end=pair.first;
        }
    }

    cout<<total<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
}