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

bool possible(int n1, int n2, ll sum) {
    int md=sum%9;
    int res=(9-md)%9;

    //find if there exist k1, k2 s.t. k1+k2 (both pos)=n1, 
    // and (k2-k1+n2)%9==res

    //

    //iterate over all ways of breaking n into k1 + k2;

    // 3-> (1,2), (2,1), (3,0), (0,3);

    // n ->
        // for i 
        // check pairs (i,n-i). n^2 pairs [O(n^2)]

    rep(i,0,n1+1) {
        rep(j,0,n2+1) {
            if((2*i + 4*(n1-i) + 3*j + 9*(n2-j))%9==res) return true;
        }
    }
    return false;

}
void solve() {
    string n; cin>>n;
    map<int,int> mp = {{2,0},{3,0}};
    ll sum=0;
    for(char c: n) {
        int dig = c-'0';
        if(dig==2 || dig==3){
            mp[dig]++;
        }
        else{
            sum+=dig;
        }
    }

    bool ans = possible(mp[2], mp[3], sum);
    if(ans) {
        cout<<"YES"<<"\n";
    }
    else{
        cout<<"NO"<<"\n";
    }

}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int t;
    cin >> t;
    while (t--) solve();
}