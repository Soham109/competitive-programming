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
    for (int i = 0; i <= MAXN; i++) spf[i] = i;

    for (int i = 2; i * i <= MAXN; i++) {
        if (spf[i] == i) {
            for (long long j = 1LL * i * i; j <= MAXN; j += i) {
                if (spf[j] == j) spf[j] = i;
            }
        }
    }
}

ll ceil_log2(ll n) {
    if (n <= 1) return 0;
    return 64 - __builtin_clzll(n - 1);
}
bool isPrime(long long n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0)
            return false;
    }
    return true;
}

bool is_power_of_two(int n) {
    if(n==1) return false;
    return n > 0 && (n & (n - 1)) == 0;
}

void solve() {
    int n; cin>>n;
    ll prod=1;
    vi exps;
    while(n>1) {
        int p=spf[n];
        int cnt=0;
        while(n>1&&spf[n]==p){
            n/=p;
            cnt++;
        }
        prod*=p;
        exps.push_back(cnt);
    }
    int mx=0;
    ll max_ceil=0;
    int k = 0;
    for(int e: exps) {
        k = max(k, (int)ceil_log2(e));
    }

    int target=1<<k;

    bool needed = false;
    for(int e: exps) {
        if(e!=target) {
            needed=true;
            break;
        }
    }

    int ops=k+needed;
    cout<<prod<<" "<<ops<<"\n";

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    build_spf();

    solve();
}