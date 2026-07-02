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

void solve() {
    int n; cin>>n;
    vi p; vi ne;
    int nz=0;

    vi a(n); 
    rep(i,0,n) {
        cin>>a[i];
        if(a[i]==0) nz++;
        else if(a[i]<0) ne.push_back(a[i]);
        else p.push_back(a[i]);
    }

    if(n-nz<5) {
        cout<<0<<endl;
        return;
    }

    sort(all(p));
    sort(all(ne));

    ll prod=1;

    if(n==5){
        rep(i,0,n) prod*=a[i];
        cout<<prod<<endl; 
        return;   
    }

    else if(p.size()==0) {
        if(nz > 0) {
            cout << 0 << endl;
            return;
        }

        for(int i = (int)ne.size() - 5; i < (int)ne.size(); i++) {
            prod *= ne[i];
        }

        cout << prod << endl; 
        return;
    }

    else if(ne.size()==0) {
        for(int i = (int)p.size()-1; i >= (int)p.size()-5; i--) {
            prod*=p[i];
        }
        cout<<prod<<endl;
        return;
    }

    else {
        ll ans = -LINF;

        if(nz > 0) ans = max(ans, 0LL);

        // 5 positives
        if(p.size() >= 5) {
            ll cur = 1;
            for(int i = (int)p.size() - 5; i < (int)p.size(); i++) {
                cur *= p[i];
            }
            ans = max(ans, cur);
        }

        // 3 positives + 2 negatives
        if(p.size() >= 3 && ne.size() >= 2) {
            ll cur = 1;

            for(int i = (int)p.size() - 3; i < (int)p.size(); i++) {
                cur *= p[i];
            }

            cur *= ne[0];
            cur *= ne[1];

            ans = max(ans, cur);
        }

        // 1 positive + 4 negatives
        if(p.size() >= 1 && ne.size() >= 4) {
            ll cur = p.back();

            for(int i = 0; i < 4; i++) {
                cur *= ne[i];
            }

            ans = max(ans, cur);
        }

        cout<<ans<<endl;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}