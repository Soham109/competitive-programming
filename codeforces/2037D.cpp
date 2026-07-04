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

#define all(c) (c).rbegin(), (c).rend()
#define rep(i, a, b) for (int i = (a); i < (b); i++)

void solve() {

    //INITIAL APPROACH [WRONG GREEDY]


    // int n,m,L; cin>>n>>m>>L;

    // before every restriction, check current power.
    // required = r-l+2
    // sort all between all restrictions.

    // vector<pair<int,int>> hurdles;
    // rep(i,0,n) {
    //     int l, r;
    //     cin >> l >> r;
    //     hurdles.push_back({l, r});
    // }

    // vector<pair<int,int>> powerups;
    // rep(i,0,m) {
    //     int x, v;
    //     cin >> x >> v;
    //     powerups.push_back({x, v});
    // }
    

    // idx (hurdle's l=idx) -> sorted decreasing -> keep taking till req not reached.
    // map<int,vi> s_pups;


    // rep(i,0,n){
    //     int prev_r = (i == 0 ? 0 : hurdles[i - 1].second);
    //     for(auto [idx, pwr]: powerups) {
    //         if(idx<hurdles[i].first&&idx>prev_r){
    //             s_pups[hurdles[i].first].push_back(pwr);
    //         }
    //     }
    //     sort(all(s_pups[hurdles[i].first]));
    // }

    // int cur=1;
    // int used=0;
    // for(auto [l,r]: hurdles) {
    //     int req = r-l+2;
    //     if(cur>=req) continue;
    //     else {
    //         for (int pu : s_pups[l]) {
    //             if (cur >= req) break;
    //             cur+=pu;
    //             used++;
    //         }
    //         if (cur < req) {
    //             cout << -1 << endl;
    //             return;
    //         }
    //     }
    // }
    // cout<<used<<endl; return;



    // CORRECT APPROACH:  (greedy using pq)

    int n,m,L; cin>>n>>m>>L;

    vector<pair<int,int>> hurdles(n);
    rep(i,0,n) cin >> hurdles[i].first >> hurdles[i].second;

    vector<pair<int,int>> powerups(m);
    rep(i,0,m) cin >>powerups[i].first >> powerups[i].second;

    priority_queue<int> pq;
    int cur=1;
    int used=0;
    int j=0;

    for(auto [l,r]: hurdles) {
        while(j<m && powerups[j].first<l){
            pq.push(powerups[j].second);
            j++;
        }

        int req=r-l+2;

        while(cur<req && !pq.empty()) {
            cur+=pq.top();
            pq.pop();
            used++;
        }
        if(cur<req) {
            cout<<-1<<endl;
            return;
        }
    }
    cout<<used<<endl;

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}
