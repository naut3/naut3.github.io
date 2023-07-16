// [dependencies]
// wasm-bindgen = "0.2.84"
// rand = "0.7.3"

mod utils;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_maze(seed: u8) -> String {
    return generate_maze_inner(seed);
}

fn generate_maze_inner(seed: u8) -> String {
    use rand::Rng;
    const N: usize = 101;
    const C_low: usize = 50;
    const C_high: usize = 100;
    assert!(N % 2 == 1);
    let mut rng: rand::rngs::StdRng = rand::SeedableRng::from_seed([seed; 32]);
    let mut ret = vec![];
    ret.push(N);

    // コインの数を決める
    let C = rng.gen_range(C_low, C_high + 1);
    ret.push(C);

    // 迷路の生成
    let mut S = vec![vec!['#'; N]; N];
    let mut T = vec![];

    let mut uf = UnionFind::new(N * N);
    let id = |y, x| y * N + x;

    for i in (1..N).step_by(2) {
        for j in (1..N).step_by(2) {
            S[i][j] = '.';
        }
    }

    for i in (2..N - 1).step_by(2) {
        for j in (1..N - 1).step_by(2) {
            T.push((i, j));
        }
    }

    for i in (1..N - 1).step_by(2) {
        for j in (2..N - 1).step_by(2) {
            T.push((i, j));
        }
    }

    while !T.is_empty() {
        let i = rng.gen_range(0, T.len());
        let (ry, rx) = T[i];
        T.remove(i);

        if rx % 2 == 0 {
            if !uf.issame(id(ry, rx - 1), id(ry, rx + 1)) {
                S[ry][rx] = '.';
                uf.unite(id(ry, rx - 1), id(ry, rx + 1));
            }
        } else {
            if !uf.issame(id(ry - 1, rx), id(ry + 1, rx)) {
                S[ry][rx] = '.';
                uf.unite(id(ry - 1, rx), id(ry + 1, rx));
            }
        }
    }

    // 始点、終点の決定
    loop {
        let (sy, sx) = (rng.gen_range(1, N), rng.gen_range(1, N));

        if S[sy][sx] == '.' {
            S[sy][sx] = 'S';
            ret.push(sy + 1);
            ret.push(sx + 1);
            break;
        }
    }

    loop {
        let (gy, gx) = (rng.gen_range(1, N), rng.gen_range(1, N));

        if S[gy][gx] == '.' {
            S[gy][gx] = 'G';
            ret.push(gy + 1);
            ret.push(gx + 1);
            break;
        }
    }

    for _ in 0..C {
        loop {
            let (cy, cx) = (rng.gen_range(1, N), rng.gen_range(1, N));

            if S[cy][cx] == '.' {
                S[cy][cx] = 'C';
                break;
            }
        }
    }

    let mut ans = format!(
        "{} {}\n{} {}\n{} {}\n",
        ret[0], ret[1], ret[2], ret[3], ret[4], ret[5],
    );

    for s in S {
        ans += &format!(
            "{}\n",
            s.iter().map(|x| x.to_string()).collect::<Vec<_>>().join("")
        );
    }

    return ans;

    struct UnionFind {
        n: usize,
        parent: Vec<usize>,
        rank: Vec<usize>,
        size: Vec<usize>,
    }

    impl UnionFind {
        fn new(n: usize) -> Self {
            let uf = Self {
                n: n,
                parent: vec![n; n],
                rank: vec![0; n],
                size: vec![1; n],
            };
            uf
        }

        /// x と y が同じ集合に含まれるかを検索する.
        fn issame(&mut self, x: usize, y: usize) -> bool {
            return self.root(x) == self.root(y);
        }

        /// x と y が含まれる集合をそれぞれ合併する.
        fn unite(&mut self, mut x: usize, mut y: usize) {
            x = self.root(x);
            y = self.root(y);

            if x != y {
                if self.rank[x] < self.rank[y] {
                    std::mem::swap(&mut x, &mut y);
                }
                self.parent[y] = x;

                if self.rank[x] == self.rank[y] {
                    self.rank[x] += 1;
                }

                self.size[x] += self.size[y];
            }
        }

        /// x が含まれる集合の大きさを求める.
        fn size(&mut self, x: usize) -> usize {
            let r = self.root(x);
            return self.size[r];
        }

        fn root(&mut self, x: usize) -> usize {
            if self.parent[x] == self.n {
                return x;
            } else {
                self.parent[x] = self.root(self.parent[x]);
                return self.parent[x];
            }
        }
    }
}
