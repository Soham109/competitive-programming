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


void solve() {
    int n;
    cin >> n;

    // map ->
    // n-> num_occurrence (write in euclid's form)
    vi arr;
    map<int,int> mp;
    vi a(n); rep(i, 0, n) {
        cin >> a[i];
        mp[a[i]]++;
    }

    ll s=0;

    for (auto pair : mp) {
        if (pair.second % pair.first != 0) {
            cout << -1 << "\n";
            return;
        }
    }

    int i = 1;

        for(auto pair: mp) {
            
            int ki = pair.second%pair.first;
            int xi = (pair.second - ki)/pair.first;
            while(xi--) {
                arr.insert(arr.end(), pair.first, i);
                i++;
            }
            arr.insert(arr.end(), ki,i);
        }

        for(int x: arr) {
            cout<<x<<" ";
        }
        cout<<"\n";
        return;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int t;
    cin >> t;
    while (t--) solve();
}