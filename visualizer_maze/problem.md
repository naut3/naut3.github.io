<script type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax:{inlineMath:[['\$','\$'],['\\(','\\)']],processEscapes:true},CommonHTML: {matchFontHeight:false}});</script>
<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML"></script>

# ざっくりした問題設定

* $N$ 行 $N$ 列のグリッドがあり、上から $i$ 行目で左から $j$ 列目のマスを $(i, j)$ と表記する。
* グリッドには、通れる道と壁が存在し、壁は `#` で表される。道同士は上下左右のいずれかで繋がっているときに限り相互に移動できる。
* 探索の始点 $(s_y, s_x)$ と、探索の終点 $(t_y, t_x)$ が与えられるので、グリッド上に $K$ 個存在するすべてのコインを集めて、終点までできるだけ短い距離で移動したい。

## 制約

* $N = 101, 50 \leq K \leq 100$

## 入力

* 入力は下のように与えられる。 $S_{i, j}$ はマス $(i, j)$ の状態を表し、 `.` であるときは通れる道であり、 `S` は始点、 `G` は終点、 `C` はコインが置かれていることを表す。 これらのマスは通過することができる。

```text
N K
s_y s_x
t_y t_x
S_11 S_12 ... S_1N
S_21 S_22 ... S_2N
...
S_N1 S_N2 ... S_NN
```

# 手元で検証用に使った貪欲解

```rust
// [dependencies]
// proconio = { version = "=0.3.6", features = ["derive"] }
#![allow(non_snake_case, unused_imports)]
use proconio::{fastout, input, marker::*};

#[fastout]
fn main() {
    input! {
        N: usize, K: usize,
        sy: Usize1, sx: Usize1,
        ty: Usize1, tx: Usize1,
        S: [Chars; N],
    }

    let mut ny = sy;
    let mut nx = sx;
    let mut ans = vec![];

    let mut coins = std::collections::BTreeSet::new();

    for i in 0..N {
        for j in 0..N {
            if S[i][j] == 'C' {
                coins.insert((i, j));
            }
        }
    }

    while !coins.is_empty() {
        let d = dfs(ny, nx, N, &S);

        let mut min_dist = 1 << 30;
        let mut min_pos = (0, 0);

        for &(cy, cx) in coins.iter() {
            if d[cy][cx] < min_dist {
                min_pos = (cy, cx);
                min_dist = d[cy][cx];
            }
        }

        let mut my = min_pos.0;
        let mut mx = min_pos.1;
        let mut route = vec![];
        while (my, mx) != (ny, nx) {
            if my > 0 && d[my][mx] == d[my - 1][mx] + 1 {
                my -= 1;
                route.push('D');
                continue;
            }

            if mx > 0 && d[my][mx] == d[my][mx - 1] + 1 {
                mx -= 1;
                route.push('R');
                continue;
            }

            if my + 1 < N && d[my][mx] == d[my + 1][mx] + 1 {
                my += 1;
                route.push('U');
                continue;
            }

            if mx + 1 < N && d[my][mx] == d[my][mx + 1] + 1 {
                mx += 1;
                route.push('L');
                continue;
            }
        }

        route.reverse();

        for r in route {
            ans.push(r);
        }

        coins.remove(&min_pos);
        (ny, nx) = min_pos;
    }

    let d = dfs(ny, nx, N, &S);
    let mut my = ty;
    let mut mx = tx;
    let mut route = vec![];
    while (my, mx) != (ny, nx) {
        if my > 0 && d[my][mx] == d[my - 1][mx] + 1 {
            my -= 1;
            route.push('D');
            continue;
        }

        if mx > 0 && d[my][mx] == d[my][mx - 1] + 1 {
            mx -= 1;
            route.push('R');
            continue;
        }

        if my + 1 < N && d[my][mx] == d[my + 1][mx] + 1 {
            my += 1;
            route.push('U');
            continue;
        }

        if mx + 1 < N && d[my][mx] == d[my][mx + 1] + 1 {
            mx += 1;
            route.push('L');
            continue;
        }
    }

    route.reverse();

    for r in route {
        ans.push(r);
    }

    println!(
        "{}",
        ans.iter()
            .map(|x| x.to_string())
            .collect::<Vec<_>>()
            .join("")
    );
}


fn dfs(y: usize, x: usize, N: usize, S: &Vec<Vec<char>>) -> Vec<Vec<usize>> {
    let mut dist = vec![vec![1 << 30; N]; N];
    let mut seen = vec![vec![false; N]; N];
    let mut q = std::collections::VecDeque::new();

    q.push_front((y, x));
    dist[y][x] = 0;
    seen[y][x] = true;

    while let Some((ny, nx)) = q.pop_front() {
        if ny > 0 && S[ny - 1][nx] != '#' && !seen[ny - 1][nx] {
            seen[ny - 1][nx] = true;
            dist[ny - 1][nx] = dist[ny][nx] + 1;
            q.push_back((ny - 1, nx));
        }

        if nx > 0 && S[ny][nx - 1] != '#' && !seen[ny][nx - 1] {
            seen[ny][nx - 1] = true;
            dist[ny][nx - 1] = dist[ny][nx] + 1;
            q.push_back((ny, nx - 1));
        }

        if ny + 1 < N && S[ny + 1][nx] != '#' && !seen[ny + 1][nx] {
            seen[ny + 1][nx] = true;
            dist[ny + 1][nx] = dist[ny][nx] + 1;
            q.push_back((ny + 1, nx));
        }

        if nx + 1 < N && S[ny][nx + 1] != '#' && !seen[ny][nx + 1] {
            seen[ny][nx + 1] = true;
            dist[ny][nx + 1] = dist[ny][nx] + 1;
            q.push_back((ny, nx + 1));
        }
    }

    return dist;
}
```