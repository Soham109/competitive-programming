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
    int n,k; cin>>n>>k;
    int n0=(n+1)/2;
    int n1=n/2;

    if(k>n-2) {
        cout<<-1<<endl;
        return;
    }
    else {
        int h=n-k;
        int h0=(h+1)/2; 
        int h1=h/2;

        string ans="";
        ans.append(n0-h0+1, '0');
        ans.append(n1-h1+1,'1');
        rep(i,0,h-2){
            if(i%2==0) ans+='0';
            else ans+='1';
        }
        cout<<ans<<endl;
    }

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}