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
    vector<array<int,3>> v;

    rep(i,1,n+1) {
        int lo, hi;
        cin>>lo>>hi;
        v.push_back({hi, lo, i});
    }

    sort(all(v), [](auto &a, auto &b) {
        if(a[0] != b[0]) return a[0] > b[0];
        return a[1] < b[1];                
    });

    auto [hi, lo, idx] = v[0];
    vector<array<int,3>> dup=v;
    v.erase(v.begin());

    int prevlo=lo;
    int prevloidx=idx;

    int a1=0,a2=0;
    bool found=false;
    for (auto pair: v) {
        if(pair[1] >= prevlo){
            a1=prevloidx;
            a2=pair[2]; 
            found=true;
            break; 
        }
        else {
            prevlo=pair[1];
            prevloidx=pair[2];
        }
    }
    
    if(found) {
        cout<<a2<<" "<<a1<<"\n";
        return;
    }

    else {
        cout<<-1<<" "<<-1<<"\n";
    }      
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}