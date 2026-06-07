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
    bool found=false;
    int n; 
    int x;
    cin>>n>>x;
    map<int,int> mp;
    vi a(n); 
    int j=-1;
    rep(i,0,n) {
        cin>>a[i];
        if(mp.find(x-a[i])!= mp.end()){
            found=true;
            j=i;
        }
        else{
            mp[a[i]]=i;
        }
    }

    if(found){
        cout<<mp[x-a[j]]+1<<" "<<j+1<<"\n";
    }
    else{
        cout<<"IMPOSSIBLE"<<"\n";
    }

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
}


