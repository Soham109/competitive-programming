#include <bits/stdc++.h>

using namespace std;

using ll = long long;
using vi = vector<int>;
using vll = vector<long long>;

const int MOD = 1e9 + 7;
const int INF = 1e9;
const ll LINF = 4e18;

#define all(c) (c).begin(), (c).end()
#define rep(i, a, b) for (int i = (a); i < (b); i++)

bool isPrime(int n) {
    if(n<2) return false;
    for(int i=2; i*i<=n; i++) {
        if(n % i == 0) {
            return false;
        }
    }
    return true;
}

//sieve of erasthosis
vi prime(int n) {
    vi p;
    int i=0;
    while(p.size()<n+1) {
        if(isPrime(i)){
            p.push_back(i);
        }
        i++;
    }
    return p;
}


void solve() {
    int n;
    cin >> n;
    vi a = prime(n);

    rep(i,0,n) {
        cout<<1LL*a[i]*a[i+1]<<" ";
    }
    cout<<"\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int t;
    cin >> t;
    while (t--) solve();
}