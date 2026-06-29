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

vi getDivisors(int n) {
    vi divisors;
    for (int i = 1; i * i <= n; ++i) {
        if (n % i == 0) {
            divisors.push_back(i);
            if (i * i != n) { 
                divisors.push_back(n/i); 
            }
        }
    }
    sort(all(divisors));
    return divisors;
}

map<int,int> digits(int n) {
    map<int,int> mp;
    while(n!=0) {
        int p = n % 10;
        n /= 10;
        mp[p]++;
    }
    return mp;
}

void solve() {
    int n; cin>>n;
    map<int,int> dg = digits(n);
    vi div = getDivisors(n);
    int total=0;
    for(int d: div) {
        map<int,int> ddg = digits(d);
        for(auto pair: ddg) {
            // if found
            if(dg.find(pair.first) != dg.end()) {
                total++;
                break;
            }
        }
    }
    cout<<total<<"\n";
}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}