#include <bits/stdc++.h>
using namespace std;

using vi = vector<int>;

const int MAX_N = 200005;
const int LOG = 20;
int a[MAX_N];
int m[MAX_N][LOG];

//floor[log2(n)]
int pow_2_max(int n) {
    return 31-__builtin_clz(n);
}

int shift(int k) {
    return 1<<k;
}

int query(int a, int b) {
    int k = pow_2_max(b-a+1);
    return min(m[a][k], m[b-shift(k)+1][k]);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);

    int n,q;cin>>n>>q;
    for(int i = 0; i < n; i++){
        cin>>a[i];
        m[i][0] = a[i];
    }

    //preprocessing
    for(int k = 1; k <= pow_2_max(n); k++){
        for(int i = 0; i + shift(k) <=n; i++) {
            m[i][k] = min(m[i][k-1], m[i + shift(k-1)][k-1]);
        }
    }

    while(q--) {
        int a,b; cin>>a>>b; a--; b--;
        cout << query(a,b) << "\n";
    }
    
}