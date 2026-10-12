//        /\_/|
//       ( •_• )   SOHAM AGGARWAL
//      / >   >    gf said "commit"
//                 so I pushed to GitHub

#include <bits/stdc++.h>

using namespace std;

using ll = long long;
using vi = vector<int>;
using vll = vector<long long>;
using vb = vector<bool>;

const int MOD=1e9+7;
const int INF = 1e9;
const ll LINF = 4e18;

#define all(c) (c).begin(), (c).end()
#define rep(i, a, b) for (int i = (a); i < (b); i++)


void solve() {
    int n,k; cin>>n>>k;

    vll c(n+1), dp(n+1), sum(n+1,0);
    rep(i,1,n+1) cin>>c[i];
    dp=c;

    rep(i,0,k) {
        int p; cin>>p;
        dp[p]=0;
    }

    vector<vi> adj(n+1);
    vi indegree(n+1,0);
    vector<bool> hasRecipe(n+1,false);

    rep(i,1,n+1) {
        int m; cin>>m;
        hasRecipe[i]=(m>0);

        rep(j,0,m) {
            int x; cin>>x;
            adj[x].push_back(i);
            indegree[i]++;
        }
    }

    queue<int> q;
    rep(i,1,n+1) if(indegree[i]==0) q.push(i);

    while(!q.empty()) {
        int u=q.front(); q.pop();

        if(hasRecipe[u]) dp[u]=min(dp[u],sum[u]);

        for(int v:adj[u]) {
            sum[v]+=dp[u];
            indegree[v]--;
            if(indegree[v]==0) q.push(v);
        }
    }

    rep(i,1,n+1) cout<<dp[i]<<" ";
    cout<<"\n";
}



int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}