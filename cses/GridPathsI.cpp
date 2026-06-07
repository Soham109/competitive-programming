//        /\_/|
//       ( •_• )   SOHAM AGGARWAL
//      / >  >     gf said "commit"
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


//dp[i][j] = number of ways of reaching from i,j to n-1, n-1;
void solve() {
    int n; cin>>n;
    vector<string> a(n);

    rep(i,0,n) cin>>a[i];

    vector<vector<ll>> dp(n, vector<ll> (n,0));

    if(a[n-1][n-1]=='*') dp[n-1][n-1] = 0;
    else {
        dp[n-1][n-1]=1;

        for(int i = n-1; i >=0; i--){
            for(int j=n-1; j>=0; j--) {
                if(i==n-1 && j==n-1) continue;
                if(a[i][j]=='*'){ dp[i][j]=0; continue;}
                if(i == n-1) dp[i][j] = (dp[i][j+1])%MOD;  
                else if(j == n-1) dp[i][j] = (dp[i+1][j])%MOD;
                else dp[i][j] = (dp[i+1][j] + dp[i][j+1])%MOD;
            }
        }
         
    }
    cout<<dp[0][0]<<"\n";

    
}   
    
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
}