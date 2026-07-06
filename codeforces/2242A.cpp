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
    int num2=0; int numt=0;
    vi a(n); rep(i,0,n) {
        cin>>a[i];
        if(a[i]>=3) numt++;
        else if(a[i]==2) num2++;
    }
    if(numt >=1 || num2>=2) {
        cout<<"YES"<<endl;
    }
    else{
        cout<<"NO"<<endl;
    }

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}