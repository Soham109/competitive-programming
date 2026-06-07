//        /\_/|
//       ( •_• )   SOHAM AGGARWAL
//      / >  >     gf said "commit"
//                 so I pushed to GitHub

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

bool even(int n, string s) {
    rep(i,0, n) {
        if(i%2==1 && s[i-1] == s[i] && !(s[i]== '?' && s[i-1]=='?')) return false;
    }
    return true;
}   

bool odd(int n, string s) {
    if(s[0]=='b') return false;
    rep(i,1,n) {
        if(i%2==0 &&  s[i-1] == s[i] && !(s[i]== '?' && s[i-1]=='?')) return false;
    }
    return true;
}

void solve() {
    int n;
    cin >> n;
    string x; cin>>x;
    bool b;
    if(count(all(x), 'a') > (n+1)/2 || 
        count(all(x), 'b') > n/2) {
        cout << "NO" << "\n";
        return;
    }
    else {
        if(n%2==0) b = even(n,x);
        else b = odd(n,x); 
        cout << (b ? "YES" : "NO") << "\n";
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int t;
    cin >> t;
    while (t--) solve();
}