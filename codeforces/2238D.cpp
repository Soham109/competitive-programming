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

const int MAXN = 1e6;
vector<int> spf(MAXN + 1);

void build_spf() {
    for(int i = 0; i <= MAXN; i++) spf[i] = i;
    for(int i = 2; i * i <= MAXN; i++) {
        if(spf[i] == i) {
            for(long long j = 1LL * i * i; j <= MAXN; j += i) {
                if(spf[j] == j) spf[j] = i;
            }
        }
    }
}

void solve() {
    int n; cin>>n;
    int d=0;
    int tot=0;
    while(n>1) {
        int p=spf[n];
        int cnt=0;
        while(n%p==0){
            n/=p;
            cnt++;
        }
        d++;
        tot+=cnt;
    }
    cout<<tot+d-1<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    build_spf();
    int t; cin>>t;
    while(t--) solve();
}