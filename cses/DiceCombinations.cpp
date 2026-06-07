#include <bits/stdc++.h>

using namespace std;
using vi = vector<int>;
const int MOD=1e9+7;

void solve() {
    int n;
    cin >> n;

    vi dp(n+1, 0);
    if(n>=1) dp[0]=1;

    for(int i=1;i <= n; i++) {
       for(int j = 1; j <= 6; j++) {
        if(i-j >=0) {
            dp[i]=(dp[i]+dp[i-j])%MOD;
        }
       }
    }

    cout << dp[n] << "\n";

}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);

    solve();
}