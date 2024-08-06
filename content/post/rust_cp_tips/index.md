---
title: 💡Tips
description: 自分用のメモ, Tips (随時更新)
date: 2024-08-05 14:47:21.590 +0000
categories:
    - Tips
draft: false # 脱稿したら、falseにする
tags:
    - Tips
math: true # 数式を使わないなら、falseにしたほうがよい。
weight: 1 # これを小さくすると、上に表示されるらしい。
---

## 便利な書き方

### Map と Entry

* [The Rust Programming Language - Storing Keys with Associated Values in Hash Maps](https://doc.rust-lang.org/book/ch08-03-hash-maps.html#adding-a-key-and-value-only-if-a-key-isnt-present)

```rust
use std::collections::HashMap;

let mut counter: HashMap<u32, usize> = HashMap::default();

counter.entry(1).or_insert(1);
assert_eq!(counter[&1], 1);
counter.entry(1).or_insert(10);
assert_eq!(counter[&1], 1);

counter.entry(2).or_default();
assert_eq!(counter[&2], 0);

// or_insert と or_insert_with の違いを見る
let mut a = 5;
let f = |n: &mut usize| {
    *n += 1;
    *n
};

counter.entry(3).or_insert_with(|| f(&mut a));
assert_eq!(counter[&3], 6);
counter.entry(4).or_insert(f(&mut a));
assert_eq!(counter[&4], 7);

counter.entry(5).or_insert_with(|| f(&mut a));
assert_eq!(a, 8);
counter.entry(5).or_insert_with(|| f(&mut a)); // `f` is not executed here.
assert_eq!(a, 8);
counter.entry(5).or_insert(f(&mut a)); // `f` is executed here.
assert_eq!(a, 9);
assert_eq!(counter[&5], 8);
```

### if let と while let

* [The Rust Programming Language - if let](https://doc.rust-lang.org/rust-by-example/flow_control/if_let.html)
* [The Rust Programming Language - while let](https://doc.rust-lang.org/rust-by-example/flow_control/while_let.html)

```rust
// N: 頂点数, graph: Vec<Vec<usize>> の隣接リスト での幅優先探索
let mut seen = vec![false; N];
let mut dist = vec![usize::MAX; N];
let mut q = std::collections::VecDeque::new();

let src = 0;
q.push_back(src);
seen[src] = true;
dist[src] = 0;

while let Some(u) = q.pop_front() {
    for &v in graph[u].iter() {
        if seen[v] {
            continue;
        }

        q.push_back(v);
        seen[v] = true;
        dist[v] = dist[u] + 1;
    }
}
```

### ラベル付きの break

* [Rust By Example - Nesting and labels](https://doc.rust-lang.org/rust-by-example/flow_control/loop/nested.html)
* [Rust By Example - Returning from loops](https://doc.rust-lang.org/rust-by-example/flow_control/loop/return.html)

```rust
let N = 1000;
let mut isok = false;

'OUTER: for i in 0..N {
    for j in 0..N {
        isok |= hoge(i, j);

        if isok {
            break 'OUTER;
        }
    }
}

// よくある書き方
// for i in 0..N {
//     for j in 0..N {
//         isok |= hoge(i, j);

//         if isok {
//             break;
//         }
//     }

//     if isok {
//         break;
//     }
// }
```

## 少しだけ実行時間制限を超過するときにできること

### FxHashMap, FxHashSetの利用

* Rustがデフォルトで使用するアルゴリズムよりも高速なハッシュアルゴリズムを使用した HashMap を利用する。
* [rustc-hash](https://docs.rs/rustc-hash/1.1.0/rustc_hash/)
* [ABC339 G - Smaller Sum](https://atcoder.jp/contests/abc339/tasks/abc339_g) では動的2次元Binary Indexed Treeを使った解法において、FxHashMapを使うとACできた。
  * [FxHashMapを使った提出 3450ms](https://atcoder.jp/contests/abc339/submissions/56408883)
  * [FxHashMapを使わない提出 TLE](https://atcoder.jp/contests/abc339/submissions/56408941)

```rust
use rustc_hash::FxHashMap;

let mut map: FxHashMap<u32, char> = FxHashMap::default();
map.insert(1, 'b');
```

### 2次元の vector を1次元にする

* $H$ 行 $W$ 列の行列を $H \times W$ 個の要素の `vector` に変換するような状況では、1次元化するのと一緒に以下のような関数を書いておくと、少し便利になる。
  * 2次元座標を1次元座標に変換する `let flatten = |y: usize, x: usize| y * W + x;`
  * 1次元座標を2次元座標に変換する `let unflatten = |p: usize| (p / W, p % W);`

## ミスを減らすために

### {}を上手に使う

下記のように、{} を上手く使うとミスを減らせる。

* 可変性が必要な場所だけ可変にできる
* 繰り返し同じ名前の変数を使うときに初期化を忘れるといった凡ミスを防止できる

```rust
proconio::input! {N: usize, M: usize, edges: [(Usize1, Usize1); M]}

let graph = {
    let mut g = vec![vec![]; N];
    for (u, v) in edges {
        g[u].push(v);
        g[v].push(u);
    }
    g
};
```


