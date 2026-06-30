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

int countUniqueDigits(ll n) {
    if (n == 0) return 1;
    unordered_set<int> unique_digits;
    
    while (n > 0) {
        int digit = n % 10;
        unique_digits.insert(digit);
        n /= 10;
    }
    
    return unique_digits.size();
}

void solve() {
    int x; cin>>x;
    int p=1;
    int tm=x;
    while (tm>0) {
        p*=10;
        tm/= 10;
    }
    cout<<p+1<<"\n";
    return; 
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}
