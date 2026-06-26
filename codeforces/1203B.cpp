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
//code chaged
#define all(c) (c).begin(), (c).end()
#define rep(i, a, b) for (int i = (a); i < (b); i++)

void solve() {
    int n; cin>>n;
    map<int,int> mp;
    vi a(4*n); rep(i,0,4*n){
        cin>>a[i];
        mp[a[i]]++;
        if(mp[a[i]]%2==0) {
            mp.erase(a[i]);
        }
    }
    if(!mp.empty()) {
        cout<<"NO"<<"\n";
        return;
    }
    
    sort(all(a));
    int l=0, r=4*n-1;
    ll area = a[l]*a[r];
    l++; r--;
    while(l<r) {
        if(a[l]*a[r]!=area) {
            cout<<"NO"<<"\n";
            return;
        }
        l++; r--;
    }
    cout<<"YES"<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}