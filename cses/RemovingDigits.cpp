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

vi digits(int n){
    vi d;
    if(n==0){
        d.push_back(0);
        return d;
    }
    while(n>0){
        d.push_back(n%10);
        n/=10;
    }
    return d;
}

// ----GREEDY APPROACH -----

// void solve() {
//     int n; cin>>n;
//     vi dg = digits(n);
//     int steps=0;
//     while(n>0){
//         steps++;
//         n-= *max_element(dg.begin(), dg.end());
//         dg = digits(n);
//     }
//     cout<<steps<<"\n";
// }   


// ----DP APPROACH------

//dp[n] = minimum steps to convert n to 0
void solve() {
    int n; cin>>n;
    vi dp(n+1,INF);
    dp[0]=0;
    vi dg=digits(n);
    rep(i,1,n+1){
        string a=to_string(i);
        for(char c: a){
            int digit = c-'0';
            if(digit!=0){
                dp[i]=min(dp[i], dp[i-digit]+1);
            }
        }
    }

    cout<<dp[n]<<endl;
}


int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
}