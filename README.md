# 作成物置き場

* [実際に表示されるページ](https://naut3.github.io/)
* [githubへのリンク](https://github.com/naut3/naut3.github.io)

## ビジュアライザ

* [グラフの簡易的なビジュアライザ](./visualizer_graph/vis.html)
  * (TODO)根付き木っぽい表示とか、辺の色を変えて最小全域木, 最短経路を強調表示する機能とかを実装したい

* [グリッド状の迷路を探索するビジュアライザ](./visualizer_maze/index.html)
  * wasm を使ってみたかったので、迷路の生成を Rust で書いて JavaScript 側から呼び出せるようにした
  * [ざっくりとした問題設定](./visualizer_maze/problem.md)と、[手元で実験するときに使った適当な貪欲法解](./visualizer_maze/solver.rs)
