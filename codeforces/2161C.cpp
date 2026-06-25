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

// if(p >= ceil(s/x) - s/x) -> bonus+=p, s+=p;

// index of minimum element satisfying -> >= ceil(s/x) - s/x)
int minSatisfying(ll s, vi arr, int x) {
    int smallest;
    int l=0; int r = arr.size()-1;
    while(l<r){
        int mid = (l + r)/2;
        if(arr[mid] >= (int)s/x){
            if(arr[mid] < arr[smallest]){
                smallest = mid;
            }
            r = mid -1;
            
        }
        else {
            l = mid + 1;
        }

    }
    if(smallest == NULL) return -1;
    else{
        return smallest;
    }
}   


void solve() {
    int n,x; cin>>n>>x;
    vll a(n); rep(i,0,n) cin>>a[i];
    ll ans=0;
    sort(all(a));  
    ll s = 0;
    vll ansv;  
    int p1=0;
    int p2 = n-1;

    while(p1<=p2) {
        ll need = x - (s%x);

        if(a[p2] >= need) {
            s+=a[p2];
            ans+=a[p2];
            ansv.push_back(a[p2]);
            p2--;
            continue;
        }

        else {
            s+=a[p1];
            ansv.push_back(a[p1]);
            p1++;
            continue;
        }
    }

    cout<<ans<<endl;
    for(auto i: ansv) cout<<i<<" ";
    cout<< endl;

}   

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin>>t;
    while(t--) solve();
}